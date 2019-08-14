import React from "react";
import PropTypes from "prop-types";
import { splitFragments } from "utility";

import "./style.scss";

const regex = /{[^{}]+}/g;

function Route({ method, path, auth }) {
  const formattedPath = splitFragments(path, regex).map(fragment => (
    <span
      className={regex.test(fragment) ? "route--path__param" : undefined}
      key={fragment}
    >
      {fragment}
    </span>
  ));
  return (
    <h4 className="route">
      <code>
        <span className="route--method">{method}</span>
        <span className="route--path">{formattedPath}</span>
      </code>
      {auth ? (
        <span className="route--auth">Requires authentication</span>
      ) : null}
    </h4>
  );
}

export default Route;

Route.propTypes = {
  method: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  auth: PropTypes.bool
};

Route.defaultProps = {
  auth: false
};

Route.displayName = "Route";
