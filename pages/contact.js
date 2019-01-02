import React from "react";
import Site from "../components/layouts/Site";

const netlify = { "data-netlify": "true" };

const Contact = () => (
  <Site>
    <h1>Contact Me</h1>
    <form name="contact" method="POST" {...netlify}>
      <input type="hidden" name="form-name" value="contact" />
      <div className="form-group">
        <label>Name:</label>
        <input type="text" name="name" className="form-control" />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" name="email" className="form-control" />
      </div>
      <div className="form-group">
        <label>Message:</label>
        <textarea className="form-control" name="message" rows="3" />
      </div>
      <div className="text-right">
        <button type="submit" className="btn">
          Submit
        </button>
      </div>
    </form>
  </Site>
);

export default Contact;
