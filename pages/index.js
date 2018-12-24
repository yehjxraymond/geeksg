import React from "react";
import { get, slice } from "lodash";
import Site from "../components/layouts/Site";
import post from "../components/posts";
import Pagination from "../components/Pagination";

const POST_IN_PAGE = 5;

const PostPreview = posts => (
  <div>
    {posts.map((p, i) => (
      <div key={i} className="mb-5">
        <a href={`/blog/${p.slug}`}>
          <div className="h2 text-black no-decoration">{p.title}</div>
        </a>
        <div className="mb-2">{p.summary}</div>
        <div className="text-right">
          <a className="text-light" href={`/blog/${p.slug}`}>
            Read More
          </a>
        </div>
      </div>
    ))}
  </div>
);

const Index = props => {
  const page = get(props, "query.page", 0);
  const postToRender = slice(
    post,
    page * POST_IN_PAGE,
    (page + 1) * POST_IN_PAGE
  );
  const prev = page - 1 >= 0 ? `/page/${page - 1}` : undefined;
  const next =
    (page + 1) * POST_IN_PAGE < post.length ? `/page/${page + 1}` : undefined;
  return (
    <Site>
      <div className="container mb-5">{PostPreview(postToRender)}</div>
      <Pagination prev={prev} next={next} />
    </Site>
  );
};

Index.getInitialProps = ({ query }) => ({ query });

export default Index;
