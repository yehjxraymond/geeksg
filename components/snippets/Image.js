import PropTypes from "prop-types";

const Caption = caption => <div className="h6 my-2">{caption}</div>;

const Citation = (cite, citeSrc) => {
  if (!cite && !citeSrc) return null;
  return citeSrc ? (
    <div style={{ fontSize: "0.8rem" }}>
      <a className="text-light" href={citeSrc}>
        Image from {cite || citeSrc}
      </a>
    </div>
  ) : (
    <div className="text-light">Image from {cite}</div>
  );
};

export const Image = ({
  src,
  width = 100,
  caption,
  cite,
  citeSrc,
  href,
  alt,
  hidden
}) => (
  <div className="text-center m-4" style={hidden && { display: "none" }}>
    <div>
      {href ? (
        <a href={href}>
          <img
            src={src}
            className={`w-100 w-xl-${width} w-lg-${width}`}
            alt={alt || caption}
          />
        </a>
      ) : (
        <img
          src={src}
          className={`w-100 w-xl-${width} w-lg-${width}`}
          alt={alt || caption}
        />
      )}
    </div>
    {Citation(cite, citeSrc)}
    {Caption(caption)}
  </div>
);

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  href: PropTypes.string,
  width: PropTypes.string,
  caption: PropTypes.string,
  cite: PropTypes.string,
  citeSrc: PropTypes.string
};

export default Image;
