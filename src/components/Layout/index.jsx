import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Header from "components/Header";
import Footer from "components/Footer";
import SideNav from "components/SideNav";
import Icon from "components/Icon";
import SEO from "components/SEO";

import "scss/main.scss";
import "./style.scss";

function Layout({
  title,
  children,
  headerProps,
  footerProps,
  footer,
  navRoot,
  noDrawer
}) {
  // Nav drawer logic
  const [showDrawer, setShowDrawer] = useState(false);
  const expandClick = useCallback(() => setShowDrawer(!showDrawer), [
    showDrawer
  ]);
  const closeDrawer = useCallback(() => setShowDrawer(false));

  return (
    <>
      <SEO title={title} />
      <Header {...headerProps} />
      <div className={classNames("docs-root", { "show-drawer": showDrawer })}>
        {noDrawer ? null : (
          <div className="docs-root--nav">
            <SideNav navRoot={navRoot} />
          </div>
        )}
        <div className="drawer-expand">
          <button className="drawer-expand--button" onClick={expandClick}>
            {showDrawer ? <Icon name="times" /> : <Icon name="bars" />}
          </button>
        </div>
        <button className="docs-root--overlay-button" onClick={closeDrawer} />
        <main className="docs-root--main">
          <div children={children} />
          <Footer {...footerProps} />
          {footer}
        </main>
      </div>
    </>
  );
}

export default Layout;

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  headerProps: PropTypes.object,
  footerProps: PropTypes.object,
  title: PropTypes.string,
  footer: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  navRoot: PropTypes.object,
  noDrawer: PropTypes.bool
};

Layout.defaultProps = {
  headerProps: {},
  footerProps: {},
  noDrawer: false
};

Layout.displayName = "Layout";
