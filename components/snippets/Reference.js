import PropTypes from "prop-types";

export const Reference = ({ text, src }) => (
  <div style={{ textAlign: "right" }}>
    <a href={src} className="text-muted">
      {text}
    </a>
  </div>
);

Reference.propTypes = {
  src: PropTypes.string,
  text: PropTypes.string
};

export default Reference;
