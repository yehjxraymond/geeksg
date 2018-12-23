import PropTypes from "prop-types";
import Navbar from "./Navbar";

const Site = ({ children }) => (
  <div className="container narrow">
    <Navbar />
    {children}
  </div>
);

export default Site;

Site.propTypes = {
  children: PropTypes.node
};
