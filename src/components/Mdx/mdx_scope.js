import React from "react";

import Icon from "components/Icon";
import Demo from "components/Demo";
import Link from "components/Link";
import Route from "components/Route";
import Alert from "components/Alert";
import Collapse from "components/Collapse";
import Container from "components/Container";
import createHeading from "components/Heading";
import ExternalSnippet from "components/ExternalSnippet";

const components = {
  // React short-codes
  Icon,
  Demo,
  Link,
  Route,
  Alert,
  Collapse,
  Container,
  ExternalSnippet,

  // Markdown components
  a: Link,
  h1: createHeading({ component: "h1" }),
  h2: createHeading({ component: "h2" }),
  h3: createHeading({ component: "h3" }),
  h4: createHeading({ component: "h4" }),
  h5: createHeading({ component: "h5" }),
  h6: createHeading({ component: "h6", rightLink: true }),
  table: props => (
    <div className="table-responsive-lg table-outer">
      <table {...props} className="table table-striped" />
    </div>
  )
};

export default components;
