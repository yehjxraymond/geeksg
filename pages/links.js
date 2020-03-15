import React from "react";

const links = [
  {
    text: "CPF Forecast Calculator",
    link: "https://geek.sg/tools/cpf-forecast"
  },
  {
    text: "Bet Sizing with Kelly Criterion",
    link: "https:///geek.sg/blog/bet-sizing-with-kelly-kelly-criterion"
  },
  {
    text: "Compounding Interest & Risk of Ruins",
    link: "https://geek.sg/blog/bet-sizing-with-kelly-risk-ruins"
  },
  {
    text: "Getting Started with Internet Marketing",
    link: "http://bit.ly/hpd-marketing"
  }
];

const Button = ({ text, link }) => (
  <a href={link}>
    <div className="btn btn-dark btn-block my-3">{text}</div>
  </a>
);

const Index = () => {
  return (
    <div className="container narrow">
      <div className="mt-4 text-center">
        <img
          className="rounded-circle"
          style={{ margin: "auto" }}
          src="/static/images/raymond-yeh.jpg"
        ></img>
      </div>
      <div
        className="my-2 text-center pointer"
        style={{ fontWeight: "bold" }}
      >
        <a style={{color: "grey"}} href="https://geek.sg/about">@yehjxraymond</a>
      </div>
      <hr />
      {links.map(({ link, text }, index) => (
        <Button key={index} link={link} text={text} />
      ))}
    </div>
  );
};

Index.getInitialProps = ({ query }) => ({ query });

export default Index;
