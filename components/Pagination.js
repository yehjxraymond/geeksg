import React from "react";
import PropTypes from "prop-types";

const Pagination = ({ prev, next }) => (
  <div className="container d-flex justify-content-between">
    {prev ? (
      <div>
        <a href={prev} className="text-black text-light">
          &lt; Previous Page
        </a>
      </div>
    ) : (
      <div />
    )}
    {next ? (
      <div>
        <a href={next} className="text-black text-light">
          Next Page &gt;
        </a>
      </div>
    ) : null}
  </div>
);

export default Pagination;

Pagination.propTypes = {
  prev: PropTypes.string,
  next: PropTypes.string
};
