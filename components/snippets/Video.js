import React from "react";
import PropTypes from "prop-types";

export const Youtube = ({ url }) => (
  <div className="embed-responsive embed-responsive-16by9 my-5">
    <iframe
      className="embed-responsive-item"
      src={`https://www.youtube-nocookie.com/embed/${url}`}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
);

Youtube.propTypes = {
  url: PropTypes.string
};

export default Youtube;
