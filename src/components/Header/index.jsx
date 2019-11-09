import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import PropTypes from "prop-types";
import classNames from "classnames";
import useDarkMode from "use-dark-mode";

import Link from "components/Link";
import Icon from "components/Icon";
import { Navbar, Container, Nav } from "react-bootstrap";

import LogoSvg from "assets/logo.svg";
import "./style.scss";

function Header({ sticky, leftChildren, ...rest }) {
  const { links, rightLinks } = useStaticQuery(graphql`
    query HeaderLinks {
      file(name: { eq: "header" }, extension: { in: ["yaml", "yml"] }) {
        childDataYaml {
          links {
            ...Links
          }
          rightLinks {
            ...Links
          }
        }
      }
    }
  `).file.childDataYaml;

  // Dark/light theme selection
  const { value, toggle } = useDarkMode(false);

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
        <Brand className="mr-auto mr-md-3" />
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
          <Nav className="right-links">
            {rightLinks.map(({ href, ...rest }) => (
              <Link href={href} {...rest} key={href} partiallyActive={false} />
            ))}
            <span className="nav-divider"></span>
            <button className="dark-mode-button" onClick={toggle}>
              {!value && <Icon name="sun" />}
              {value && <Icon name="moon" />}
            </button>
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

const Brand = ({ className, ...rest }) => (
  <Link className={classNames("nav-link brand", className)} href="/" {...rest}>
    <LogoSvg />
  </Link>
);

Header.Brand = Brand;

Brand.displayName = "Header.Brand";
