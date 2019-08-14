import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useLocation } from "utility";
import classNames from "classnames";

import Link from "components/Link";
import Icon from "components/Icon";

import "./style.scss";

function SideNav({ navRoot }) {
  function generateNav(node) {
    return node.children.length > 0 ? (
      <CollapsibleNavLink href={node.path} label={node.navTitle}>
        <ul>{node.children.map(generateNav)}</ul>
      </CollapsibleNavLink>
    ) : (
      <li key={node.slug}>
        <Link
          className="side-nav--link no-children"
          href={node.path}
          children={node.navTitle}
          partiallyActive={false}
        />
      </li>
    );
  }

  return (
    <div className="side-nav">
      <h5>{navRoot.navTitle}</h5>
      <ul>{navRoot.children.map(generateNav)}</ul>
    </div>
  );
}

export default SideNav;

SideNav.propTypes = {
  navRoot: PropTypes.object
};

SideNav.displayName = "SideNav";

// ? =================
// ? Helper components
// ? =================

function CollapsibleNavLink({ href, label, children }) {
  const { location } = useLocation();
  const isPartiallyActive = location.pathname.startsWith(href);
  const [open, setOpen] = useState(isPartiallyActive);
  const onClick = useCallback(() => setOpen(!open), [open]);
  return (
    <li
      key={label}
      className={classNames({
        "partially-active": isPartiallyActive
      })}
    >
      <div className="side-nav--expander-outer">
        <Link
          className="side-nav--link with-children"
          href={href}
          partiallyActive={false}
        >
          <span>{label}</span>
        </Link>
        <button
          className={classNames("side-nav--expander", { open })}
          onClick={onClick}
        >
          <Icon name="chevron-right" />
        </button>
      </div>
      {open ? children : null}
    </li>
  );
}

CollapsibleNavLink.propTypes = {
  href: PropTypes.string,
  isMasquerade: PropTypes.bool,
  label: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

CollapsibleNavLink.displayName = "CollapsibleNavLink";
