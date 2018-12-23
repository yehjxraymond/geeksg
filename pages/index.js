import Site from "../components/layouts/Site";
import post from "../components/posts";

const PostPreview = posts => (
  <div>
    {posts.map((p, i) => (
      <div key={i} className="mb-5">
        <div className="h2">{p.title}</div>
        <div className="my-3">{p.summary}</div>
        <div className="text-right">
          <a className="text-light" href={`/blog/${p.slug}`}>
            Read More
          </a>
        </div>
      </div>
    ))}
  </div>
);

const Index = () => (
  <Site>
    <div className="ui text container mt-5">
      {PostPreview(post)}
      {JSON.stringify(post)}
    </div>
  </Site>
);

export default Index;
