import PropTypes from "prop-types";

const Blog = ({ children }) => (
  <div style={{ backgroundColor: "green" }}>{children}</div>
);

export default Blog;

Blog.propTypes = {
  children: PropTypes.node
};
