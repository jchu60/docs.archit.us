const path = require("path");
const linkSchema = require("./src/components/Link/schema");
const DocsPageTemplate = path.resolve("./src/templates/Docs/index.jsx");
const {
  trimMarkdownPath,
  splitPath,
  capitalize
} = require("./src/utility/path.js");
const _ = require("lodash");

// Whether or not to print verbose debug messages to stdout
const verbose = true;
const ifVerbose = func => (verbose ? func() : void 0);
const debug = (reporter, text, mode = "info") =>
  ifVerbose(() =>
    ({
      info: content => reporter.info(content),
      success: content => reporter.success(content)
    }[mode](text))
  );

const isDefined = obj => !(obj == null);

// Define custom graphql schema to enforce rigid type structures
exports.sourceNodes = ({ actions, reporter }) => {
  activity = reporter.activityTimer("implementing custom graphql schema");
  activity.start();

  const { createTypes } = actions;
  // ? links field currently unused
  const typeDefs = `
    type Frontmatter {
      title: String!
      shortTitle: String
      overrideBreadcrumb: String
      overrideNav: String
      noTOC: Boolean
      isRoot: Boolean
      overview: Boolean
      noBreadcrumb: Boolean
      links: [Link]
    }
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter!
      html: String
    }
    type Mdx implements Node {
      frontmatter: Frontmatter!
    }
    type File implements Node {
      childMarkdownRemark: MarkdownRemark
      childMdx: Mdx
    }
    type DataYaml implements Node {
      links: [Link]
    }
  `;
  createTypes(linkSchema);
  createTypes(typeDefs);

  activity.end();
};

// Dynamically create documentation pages
exports.createPages = ({ graphql, actions, reporter }) => {
  let activity = reporter.activityTimer(`loading docs pages via graphql`);
  activity.start();

  const { createPage } = actions;
  const frontmatterFragment = `
    title
    shortTitle
    overrideBreadcrumb
    overrideNav
    noBreadcrumb
    noTOC
    isRoot
    overview
  `;
  return graphql(
    `
      query loadPagesQuery($limit: Int!) {
        allFile(
          limit: $limit
          filter: {
            sourceInstanceName: { eq: "docs" }
            extension: { regex: "/^(?:md)|(?:mdx)$/" }
          }
        ) {
          edges {
            node {
              relativePath
              childMarkdownRemark {
                id
                frontmatter {
                  ${frontmatterFragment}
                }
              }
              childMdx {
                id
                frontmatter {
                  ${frontmatterFragment}
                }
              }
            }
          }
        }
      }
    `,
    { limit: 1000 }
  ).then(result => {
    if (result.errors) {
      activity.end();
      throw result.errors;
    }

    // Flatmap function that tags whether a node is md or mdx while validating
    // that it has content at all
    const tagOrCull = ({ childMarkdownRemark: md, childMdx: mdx, ...rest }) => {
      const isMd = isDefined(md);
      const isMdx = isDefined(mdx);
      const { id, frontmatter } = isMdx ? mdx : md;
      if (isMd || isMdx) return { ...rest, isMdx, id, ...frontmatter };
      else {
        // Log error and cull by returning empty array
        reporter.error(`node ${rest.name} has no valid md or mdx content`);
        return [];
      }
    };

    activity.end();
    activity = reporter.activityTimer(`walking navigation tree`);
    activity.start();

    // Walk the navigation tree and add each docs page node
    const navTree = {
      children: [],
      // Default root node
      slug: "",
      title: "Documentation",
      isRoot: true,
      invisible: true
    };
    result.data.allFile.edges
      .flatMap(({ node }) => tagOrCull(node))
      .forEach(node => walkTree(node, navTree));

    activity.end();
    activity = reporter.activityTimer(`adding defaults to nav tree nodes`);
    activity.start();
    addDefaults(navTree);

    activity.end();
    activity = reporter.activityTimer(`separating nav roots`);
    activity.start();
    const roots = collectRoots(navTree);

    activity.end();
    activity = reporter.activityTimer(`assembling breadcrumbs`);
    activity.start();
    roots.forEach(root => assembleBreadcrumbs(root, []));

    activity.end();
    activity = reporter.activityTimer(`dynamically generating docs pages`);
    activity.start();
    function createSubtreePages(subtree, root) {
      if (!subtree.invisible) {
        createPage({
          path: subtree.path,
          component: DocsPageTemplate,
          context: { ..._.omit(subtree, "path"), navRoot: root }
        });

        const debugMessage = `docs page @ '${subtree.path}' ${
          subtree.invisible
            ? ""
            : subtree.isOrphan
            ? "(orphan)"
            : `=> ${subtree.id}`
        }`;
        debug(reporter, debugMessage);
      }

      subtree.children.forEach(child => createSubtreePages(child, root));
    }
    roots.forEach(root => createSubtreePages(root, root));

    activity.end();
  });
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    // Allow relative imports like "import Foo from 'components/Foo'"
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      extensions: [".js", ".jsx", ".json", ".mdx"]
    }
  });
};

// ? ==========================
// ? Navigation tree processing
// ? ==========================

function walkTree(node, navTree) {
  const path = trimMarkdownPath(node.relativePath);

  // If root, replace default root node with this one
  if (path === "/") {
    Object.assign(navTree, node, {
      path,
      isOrphan: false,
      invisible: false
    });
  } else {
    // Walk tree as normal
    const fragments = splitPath(path);
    let subtree = navTree;
    for (let i = 0; i < fragments.length; ++i) {
      const previousNode = subtree.children.find(
        child => child.slug === fragments[i]
      );

      // Node existed before
      if (typeof previousNode !== "undefined") {
        subtree = previousNode;
      } else {
        // Create new node here
        const newNode = {
          children: [],
          title: capitalize(fragments[i]),
          slug: fragments[i],
          path: `/${fragments.slice(0, i + 1).join("/")}`,
          isOrphan: true,
          invisible: false
        };
        subtree.children.push(newNode);
        subtree = newNode;
      }

      // Current node: merge page into
      if (i === fragments.length - 1) {
        Object.assign(subtree, node, {
          path,
          isOrphan: false
        });
      }
    }
  }
}

function addDefaults(subtree) {
  // shortTitle; fallback to title
  if (subtree.shortTitle == null) subtree.shortTitle = subtree.title;

  // breadcrumbTitle; fallback to shortTitle
  if (subtree.overrideBreadcrumb == null) {
    subtree.breadcrumbTitle = subtree.shortTitle;
  } else {
    subtree.breadcrumbTitle = subtree.overrideBreadcrumb;
  }

  // navTitle; fallback to title
  if (subtree.overrideNav == null) {
    subtree.navTitle = subtree.title;
  } else {
    subtree.navTitle = subtree.overrideNav;
  }

  // isRoot; fallback to false
  if (!subtree.isRoot) subtree.isRoot = false;

  // originalPath = relativePath
  if (subtree.relativePath != null) subtree.originalPath = subtree.relativePath;

  delete subtree.overrideBreadcrumb;
  delete subtree.overrideNav;
  delete subtree.relativePath;

  subtree.children.forEach(addDefaults);
}

function collectRoots(navTree) {
  const roots = [navTree];
  function separateRootNodes(subtree) {
    for (let i = 0; i < subtree.children.length; ++i) {
      const child = subtree.children[i];
      if (child.isRoot) {
        roots.push(child);
        // Remove and rewind iteration
        subtree.children.splice(i, 1);
        --i;
      } else {
        separateRootNodes(child);
      }
    }
  }
  // Iteratively separate all root nodes
  for (let i = 0; i < roots.length; ++i) {
    separateRootNodes(roots[i]);
  }
  // Remove empty roots
  for (let i = 0; i < roots.length; ++i) {
    if (roots[i].children.length === 0) {
      // Remove and rewind iteration
      roots.splice(i, 1);
      --i;
    }
  }
  return roots;
}

function assembleBreadcrumbs(subtree, currentBreadcrumb) {
  currentBreadcrumb.push({
    text: subtree.breadcrumbTitle,
    path: subtree.path == null ? null : subtree.path
  });
  if (!subtree.invisible && !subtree.noBreadcrumb) {
    const length = currentBreadcrumb.length;
    subtree.breadcrumb = currentBreadcrumb.map(({ text, path }, i) =>
      i === length - 1 ? { text, path: null } : { text, path }
    );
  }
  subtree.children.forEach(child =>
    assembleBreadcrumbs(child, [...currentBreadcrumb])
  );
}
