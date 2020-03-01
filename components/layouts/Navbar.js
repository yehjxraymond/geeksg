import React from "react";

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top mb-4">
    <a href="/" style={{ color: "black" }}>
      <i className="far fa-bookmark huge" />
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" href="/">
            Home
          </a>
        </li>
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            About
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <a className="dropdown-item" href="/about">
              Overview
            </a>
            <a className="dropdown-item" href="/about/projects">
              Projects
            </a>
            <a className="dropdown-item" href="/about/academic">
              Academic
            </a>
            <a className="dropdown-item" href="/about/work-experience">
              Work Experience
            </a>
            <a className="dropdown-item" href="/about/speaking">
              Speaking
            </a>
            <a className="dropdown-item" href="/about/media">
              Media
            </a>
          </div>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/contact">
            Contact
          </a>
        </li>
      </ul>
    </div>
  </nav>
);

/*
<li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            About
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <a className="dropdown-item" href="#">
              Action
            </a>
            <a className="dropdown-item" href="#">
              Another action
            </a>
            <div className="dropdown-divider" />
            <a className="dropdown-item" href="#">
              Something else here
            </a>
          </div>
        </li>
*/

export default Navbar;
