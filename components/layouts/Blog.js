import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import Site from "./Site";

const Blog = ({ children, meta }) => (
  <Site>
    <Head>
      {meta && meta.title ? (
        <title key="title">{`${meta.title} | GEEK.SG`}</title>
      ) : null}
      {meta && meta.summary ? (
        <meta name="description" content={meta.summary} />
      ) : null}
      {meta && meta.slug ? (
        <link rel="canonical" href={`https://geek.sg/blog/${meta.slug}/`} />
      ) : null}
    </Head>
    <div className="container">{children}</div>
  </Site>
);

export default Blog;

Blog.propTypes = {
  meta: PropTypes.object,
  children: PropTypes.node
};
