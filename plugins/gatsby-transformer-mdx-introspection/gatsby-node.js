const mdx = require("@mdx-js/mdx");
const babelParser = require("@babel/parser");
const jsxAstUtils = require("./src/jsx-ast-utils");
const reduceJsxAst = require("./src/reduce-jsx-ast");

exports.sourceNodes = ({ actions }) => {
  actions.createTypes(`
    type ComponentInMdx implements Node @dontInfer {
      component: String!
      attributes: [Attribute!]
    }

    type Attribute {
      name: String!
      value: String
    }
  `);
};

exports.onCreateNode = (
  { node, actions, createNodeId, createContentDigest },
  options
) => {
  if (node.internal.type === "Mdx") {
    introspectMdx({
      node,
      createNodeId,
      createContentDigest,
      actions,
      options
    });
  }
};

function introspectMdx({
  node,
  createNodeId,
  createContentDigest,
  actions,
  options
}) {
  mdx(node.rawBody)
    .then(jsx => {
      const ast = babelParser.parse(jsx, {
        sourceType: "module",
        plugins: ["jsx"]
      });
      console.log(JSON.stringify(jsx));
      console.log();
      const contentRoot = jsxAstUtils.findContentRoot(ast);
      const reducedForest = reduceJsxAst(contentRoot, jsx, options);
      console.log(JSON.stringify(reducedForest));
      console.log();

      // Coalesce all simple component trees into a list of their non-ignored nodes
      const componentNodes = reducedForest.reduce(
        (accum, tree) => [...accum, ...getAllComponentNodes(tree)],
        []
      );

      // componentNodes.forEach((componentNode, index) => {
      //   if (!componentNode.hasGatsbyNode) return;
      //   createComponentInMdxNode({
      //     node,
      //     createNodeId,
      //     createContentDigest,
      //     actions,
      //     componentNode,
      //     original: node.body, // use to extract raw JSX from compiled MDX
      //     index // the exact same JSX could be on one page twice, use a counter to differentiate
      //   });
      // });
    })
    .catch(error => console.log(error));
}

function getAllComponentNodes(reducedTree) {
  let children = [];

  function traverse(node) {
    if (node.hasGatsbyNode) {
      children.push(node);
    }

    for (const child of node.children) {
      traverse(child);
    }
  }

  traverse(reducedTree);
  return children;
}

function createComponentInMdxNode({
  node,
  createNodeId,
  createContentDigest,
  actions,
  componentNode,
  index
}) {
  const { createNode, createParentChildLink } = actions;
  const componentInMdxNode = {
    ...componentNode,
    id: createNodeId(
      `$${node.id}.${componentNode.tag}.${index} >>> COMPONENT_IN_MDX`
    ),
    parent: node.id,
    children: [],
    internal: {
      contentDigest: createContentDigest(componentNode),
      type: "ComponentInMdx"
    }
  };

  createNode(componentInMdxNode);
  createParentChildLink({ parent: node, child: componentInMdxNode });
}
