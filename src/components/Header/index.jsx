import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import PropTypes from "prop-types";
import classNames from "classnames";

import { Navbar, Container } from "react-bootstrap";
import Link from "components/Link";

import LogoSvg from "assets/logo.svg";
import "./style.scss";

function Header({ sticky, children, leftChildren, ...rest }) {
  const links = useStaticQuery(graphql`
    query HeaderLinks {
      file(name: { eq: "header" }, extension: { in: ["yaml", "yml"] }) {
        childDataYaml {
          links {
            ...Links
          }
        }
      }
    }
  `).file.childDataYaml.links;
  return (
    <Navbar
      bg="primary"
      expand="md"
      variant="dark"
      collapseOnSelect
      sticky={sticky ? "top" : null}
      {...rest}
    >
      <Container fluid>
        {leftChildren}
        <Brand />
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            {links.map(({ href, className, ...rest }) => (
              <Link
                key={href}
                className={classNames(className, "nav-link")}
                {...rest}
              />
            ))}
          </li>
        </ul>
        <div className="header-children">{children}</div>
      </Container>
    </Navbar>
  );
}

export default Header;

Header.displayName = "Header";

Header.propTypes = {
  leftChildren: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  sticky: PropTypes.bool
};

Header.defaultProps = {
  sticky: true
};

const Brand = props => (
  <Link className="nav-link brand" href="/" {...props}>
    <LogoSvg />
  </Link>
);

Header.Brand = Brand;

Brand.displayName = "Header.Brand";
