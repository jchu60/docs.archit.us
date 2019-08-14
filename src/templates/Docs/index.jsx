import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { graphql } from "gatsby";
import { isDefined } from "utility";

import Breadcrumb from "components/Breadcrumb";
import Layout from "components/Layout";
import Mdx from "components/Mdx";
import TableOfContents from "components/TableOfContents";

import "./style.scss";

export const pageQuery = graphql`
  query($id: String) {
    mdx(id: { eq: $id }) {
      body
      tableOfContents(maxDepth: 4)
    }
    markdownRemark(id: { eq: $id }) {
      html
      tableOfContents(maxDepth: 4)
    }
  }
`;

// TODO Edit on github, In this section
function DocsPageTemplate({
  data,
  pageContext: {
    isMdx,
    breadcrumb,
    title,
    shortTitle,
    isOrphan,
    navRoot,
    noTOC,
    noBreadcrumb,
    children
  }
}) {
  return (
    <Layout title={shortTitle} navRoot={navRoot}>
      <article
        className={classNames("container docs-root--content", {
          "with-toc": !noTOC
        })}
      >
        {!noBreadcrumb ? <Breadcrumb data={breadcrumb} /> : null}
        <h1>{title}</h1>
        {!isOrphan ? (
          <DocsContent
            contentRoot={isMdx ? data.mdx : data.markdownRemark}
            noTOC={noTOC}
            isMdx={isMdx}
          />
        ) : null}
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
    children: PropTypes.array
  }).isRequired
};

DocsPageTemplate.displayName = "DocsPageTemplate";

// ? ==============
// ? Sub-components
// ? ==============

function DocsContent({ isMdx, noTOC, contentRoot }) {
  const content = isMdx ? contentRoot.body : contentRoot.html;
  const tableOfContents = contentRoot.tableOfContents;
  return (
    <div
      className={classNames("docs-content--wrapper", {
        "with-toc": !noTOC
      })}
    >
      <div className="docs-content">
        {isMdx ? (
          <Mdx content={content} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </div>
      <div>{!noTOC ? <TableOfContents headers={tableOfContents} /> : null}</div>
    </div>
  );
}

DocsContent.propTypes = {
  isMdx: PropTypes.bool.isRequired,
  noTOC: PropTypes.bool.isRequired,
  contentRoot: PropTypes.shape({
    body: PropTypes.string,
    html: PropTypes.string,
    tableOfContents: PropTypes.shape({
      headers: PropTypes.shape({
        items: PropTypes.array
      })
    })
  })
};

DocsContent.displayName = "DocsContent";
