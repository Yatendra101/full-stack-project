import React from "react";
import "../../CSS/Home.css";

const Footer = () => {
  return (
    <div>
      <footer className="fixed-bottom bg-white p-2">
        <p> © 2023 WSA. All Rights Reserved.</p>
        <ul className="footerlist">
          {/* li*4 => 4 list*/}
          <li>Privacy</li>
          <li>Terms</li>
          <li>Sitemap</li>
          <li>Comapany details</li>
        </ul>

        <p>English(IN) ₹ INR</p>
      </footer>
    </div>
  );
};

export default Footer;
