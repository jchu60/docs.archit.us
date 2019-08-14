import React from "react";
import classNames from "classnames";

import Icon from "components/Icon";

import "./style.scss";

function createHeading({ component: Component, rightLink = false }) {
  const heading = ({ children, id, ...rest }) => {
    const link = (
      <a
        className={classNames("heading-link", `heading-${Component}`, {
          right: rightLink
        })}
        href={`#${id}`}
      >
        <Icon name="link" />
      </a>
    );
    return (
      <div className="anchor-wrapper">
        <a className="anchor" name={id}>
          {" "}
        </a>
        <Component {...rest}>
          {children}
          {link}
        </Component>
      </div>
    );
  };
  heading.displayName = `Heading-${Component}`;
  return heading;
}

export default createHeading;
