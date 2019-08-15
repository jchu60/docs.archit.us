import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import { Row, Col, Card } from "react-bootstrap";
import Icon from "components/Icon";
import Link from "components/Link";

import "./style.scss";

function Footer() {
  return (
    <div className="footer">
      <div className="footer--inner">
        <Row>
          <Col sm={12} lg={6}>
            <FooterPanel header="About" className="about">
              <p>
                Architus is a multipurpose Discord bot empowering both admins
                and server members with the tools to have a more streamlined and
                enjoyable experience.
              </p>
            </FooterPanel>
          </Col>
          <Col sm={6} lg={3}>
            <FooterPanel header="Links">
              <Link href="https://status.archit.us/">Status</Link>
              <Link href="/">Docs</Link>
            </FooterPanel>
          </Col>
          <Col sm={6} lg={3}>
            <FooterPanel header="Connect">
              <Link href="https://github.com/architus">
                <Icon name="github" className="icon" />
                Github
              </Link>
              <Link href="https://discord.gg/svrRrSe">
                <Icon name="discord" className="icon" />
                Discord Server
              </Link>
            </FooterPanel>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Footer;

Footer.displayName = "Footer";

const FooterPanel = ({ children, header, className }) => (
  <div className={classNames("footer--panel", className)}>
    <h3>{header}</h3>
    <hr />
    <div>{children}</div>
  </div>
);

FooterPanel.propTypes = {
  header: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  className: PropTypes.string
};

FooterPanel.displayName = "FooterPanel";
