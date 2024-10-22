import React from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { BsFacebook, BsTwitterX, BsYoutube } from "react-icons/bs";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-information">
          <div className="footer-about">
            <h4>ABOUT</h4>
            <span>
              <Link to="/">Contact Us</Link>
            </span>
            <span>
              <Link to="/">About Us</Link>
            </span>
            <span>
              <Link to="/">Careers</Link>
            </span>
            <span>
              <Link to="/">Flipkart Stories</Link>
            </span>
            <span>
              <Link to="/">Press</Link>
            </span>
            <span>
              <Link to="/">Corporate Information</Link>
            </span>
          </div>
          <div className="footer-group-companies">
            <h4>GROUP COMPANIES</h4>
            <span>
              <Link to="/">Myntra</Link>
            </span>
            <span>
              <Link to="/">Cleartrip</Link>
            </span>
            <span>
              <Link to="/">Shopsy</Link>
            </span>
          </div>
          <div className="footer-help">
            <h4>HELP</h4>
            <span>
              <Link to="/">Payments</Link>
            </span>
            <span>
              <Link to="/">Shipping</Link>
            </span>
            <span>
              <Link to="/">Cancellation & Returns</Link>
            </span>
            <span>
              <Link to="/">FAQ</Link>
            </span>
            <span>
              <Link to="/">Report Infringement</Link>
            </span>
          </div>
          <div className="footer-policy">
            <h4>CONSUMER POLICY</h4>
            <span>
              <Link to="/">Cancellation & Returns</Link>
            </span>
            <span>
              <Link to="/">Terms of Use</Link>
            </span>
            <span>
              <Link to="/">Security</Link>
            </span>
            <span>
              <Link to="/">Privacy</Link>
            </span>
            <span>
              <Link to="/">Sitemap</Link>
            </span>
            <span>
              <Link to="/">Grievance Redressal</Link>
            </span>
            <span>
              <Link to="/">EPR Compliance</Link>
            </span>
          </div>
          <div className="footer-mail-socials">
            <div className="footer-mail-us">
              <h4>Mail Us:</h4>
              <p>Flipkart Internet Private Limited,</p>
              <p>Buildings Alyssa, Begonia &</p>
              <p>Clove Embassy Tech Village,</p>
              <p>Outer Ring Road, Devarabeesanahalli Village,</p>
              <p>Bengaluru, 560103,</p>
              <p>Karnataka, India</p>
            </div>
            <div className="footer-social">
              <h4>Social</h4>
              <span>
                <BsFacebook />
              </span>
              <span>
                <BsTwitterX />
              </span>
              <span>
                <BsYoutube />
              </span>
            </div>
          </div>
          <div className="footer-office-address">
            <h4>Registered Office Address:</h4>
            <p>Flipkart Internet Private Limited,</p>
            <p>Buildings Alyssa, Begonia &</p>
            <p>Clove Embassy Tech Village,</p>
            <p>Outer Ring Road, Devarabeesanahalli Village,</p>
            <p>Bengaluru, 560103,</p>
            <p>Karnataka, India</p>
            <p>CIN : U51109KA2012PTC066107</p>
            <p>Telephone: 044-45614700 / 044-67415800</p>
          </div>
        </div>
        <div></div>
      </footer>
    </>
  );
};

export default Footer;
