import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { graphql } from "gatsby";
import { isDefined } from "utility";

import Breadcrumb from "components/Breadcrumb";
import Layout from "components/Layout";
import Mdx from "components/Mdx";
import TableOfContents from "components/TableOfContents";
import Link from "components/Link";
import Icon from "components/Icon";

import "./style.scss";

export const pageQuery = graphql`
  query($id: String) {
    mdx(id: { eq: $id }) {
      body
      tableOfContents(maxDepth: 4)
    }
    site {
      siteMetadata {
        githubRoot
      }
    }
  }
`;

function DocsPageTemplate({
  data,
  pageContext: {
    breadcrumb,
    title,
    shortTitle,
    isOrphan,
    navRoot,
    noTOC,
    noBreadcrumb,
    originalPath,
    overview,
    children
  }
}) {
  const { githubRoot } = data.site.siteMetadata;
  const showOverview = (isOrphan || overview) && children.length > 0;
  const contentRoot = data.mdx;
  const showTOC = !noTOC && !isOrphan && isDefined(contentRoot);
  return (
    <Layout title={shortTitle} navRoot={navRoot}>
      <article
        className={classNames("container docs-root--content", {
          "with-toc": showTOC
        })}
      >
        {!noBreadcrumb ? <Breadcrumb data={breadcrumb} /> : null}
        <h1>{title}</h1>
        <ContentWrapper
          noTOC={!showTOC}
          tableOfContents={showTOC ? contentRoot.tableOfContents : null}
        >
          {!isOrphan && isDefined(contentRoot) && (
            <Mdx content={contentRoot.body} />
          )}
          {showOverview && (
            <>
              <h2>In this section</h2>
              <ul>
                {children.map(({ title, path, slug }) => (
                  <li key={slug}>
                    <Link href={path}>{title}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          {!isOrphan && (
            <>
              <hr />
              <Link href={`${githubRoot}/${originalPath}`}>
                <Icon name="pencil-alt" className="mr-2" />
                Edit this page on GitHub
              </Link>
            </>
          )}
        </ContentWrapper>
      </article>
    </Layout>
  );
}

export default DocsPageTemplate;

DocsPageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.shape({
    isMdx: PropTypes.boolean,
    breadcrumb: PropTypes.arrayOf(
      PropTypes.shape({ text: PropTypes.string, path: PropTypes.string })
    ),
    title: PropTypes.string,
    shortTitle: PropTypes.string,
    isOrphan: PropTypes.bool,
    navRoot: PropTypes.object,
    noTOC: PropTypes.bool,
    noBreadcrumb: PropTypes.bool,
    children: PropTypes.array,
    originalPath: PropTypes.string,
    overview: PropTypes.bool
  }).isRequired
};

DocsPageTemplate.displayName = "DocsPageTemplate";

// ? ==============
// ? Sub-components
// ? ==============

function ContentWrapper({ noTOC, children, tableOfContents }) {
  return (
    <div
      className={classNames("docs-content--wrapper", {
        "with-toc": !noTOC
      })}
    >
      <div className="docs-content">{children}</div>
      {!noTOC && !!tableOfContents && (
        <div>
          <TableOfContents headers={tableOfContents} />
        </div>
      )}
    </div>
  );
}

ContentWrapper.propTypes = {
  noTOC: PropTypes.bool.isRequired,
  tableOfContents: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired
};
