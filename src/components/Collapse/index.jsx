import React, { useState, useCallback, cloneElement } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Icon from "components/Icon";

import "./style.scss";

function Collapse({ children, noUnwrap }) {
  const [open, setOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const onClickExpand = useCallback(() => {
    setOpen(!open);
    if (!hasMounted && !open) setHasMounted(true);
  }, [open, hasMounted]);

  const displayChildren = (
    <div
      className={classNames({ "d-none": !open })}
      children={
        open || hasMounted
          ? noUnwrap
            ? children
            : cloneElement(children.props.children)
          : null
      }
    />
  );

  return (
    <div className={classNames("docs-collapse", { open })}>
      <button className="docs-collapse--button" onClick={onClickExpand}>
        <h5>{open ? "Hide" : "Show"}</h5>
        <Icon name="chevron-right" />
      </button>
      {displayChildren}
    </div>
  );
}

export default Collapse;

Collapse.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  noUnwrap: PropTypes.bool
};

Collapse.defaultProps = {
  noUnwrap: false
};
