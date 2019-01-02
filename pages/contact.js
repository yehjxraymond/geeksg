import React from "react";
import Site from "../components/layouts/Site";

const Contact = () => (
  <Site>
    <h1>Contact Me</h1>
    <form name="contact" netlify>
      <div className="form-group">
        <label>Name:</label>
        <input type="text" className="form-control" />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input type="email" className="form-control" />
      </div>
      <div className="form-group">
        <label>Message:</label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
        />
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
