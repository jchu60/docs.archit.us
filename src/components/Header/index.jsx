import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import PropTypes from "prop-types";

import { Navbar, Container, Nav } from "react-bootstrap";
import Link from "components/Link";

import LogoSvg from "assets/logo.svg";
import "./style.scss";

function Header({ sticky, leftChildren, ...rest }) {
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
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {links.map(({ href, ...rest }) => (
              <Nav.Link
                as={Link}
                href={href}
                {...rest}
                key={href}
                partiallyActive={false}
              />
            ))}
          </Nav>
        </Navbar.Collapse>
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
