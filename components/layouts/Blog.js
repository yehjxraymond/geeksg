import PropTypes from "prop-types";
import Site from "./Site";

const Blog = ({ children }) => (
  <Site>
    <div className="container">{children}</div>
  </Site>
);

export default Blog;

Blog.propTypes = {
  children: PropTypes.node
};
