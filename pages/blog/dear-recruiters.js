import React, { useState } from "react";
import Blog from "../../components/layouts/Blog";

export const meta = {
  date: new Date("07 July 2019"),
  title: "Dear Recruiters",
  slug: "dear-recruiters",
  summary:
    "I've received numerous job invitations but realised most of these jobs do not meet my expectations. Rather than reviewing each one manually, I'm automating the process by writing this so I can focus my attention to those jobs that I can give my 101% efforts to without wasting a trip down your office."
};

// {withPerspective()}

const Content = () => {
  const [isRecruiter, setRecruiter] = useState(true);
  const togglePerspective = () => {
    setRecruiter(!isRecruiter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const withPerspective = (toRecruiter, toJobSeeker) =>
    isRecruiter ? toRecruiter : toJobSeeker;
  return (
    <div>
      <h1>
        Dear{" "}
        {withPerspective("Recruiters/Future Employers", "Future Colleagues")}
      </h1>
      <p>
        I'm writing this post to help you find out if{" "}
        {withPerspective("your job", "a role in my team")} is right for{" "}
        {withPerspective("me", "you")}.
      </p>
      <p>
        {withPerspective("I've", "You've probably")} received numerous job
        invitations but that realised most of these jobs do not meet
        {withPerspective(" my", " your")} expectations. Rather than
        {withPerspective(
          " reviewing each one manually",
          " inviting you in for a chat to tell you more about my team"
        )}
        , I'm automating the process by writing this so{" "}
        {withPerspective("I", "you")} can focus {withPerspective("my", "your")}{" "}
        attention to the jobs that {withPerspective("I", "you")} can give{" "}
        {withPerspective("my", "your")} 101% efforts, without wasting a trip
        down to {withPerspective("your", "our")} office.
      </p>
      <p>
        {withPerspective("I", "You")} have high expectations for{" "}
        {withPerspective("my", "your")} employer - just as{" "}
        {withPerspective("you", "we")} have for {withPerspective("me", "you")}.
        So these are what {withPerspective("I", "you can")} expect from{" "}
        {withPerspective("you", "us")}:
      </p>
      {/* Paragraph 1 */}
      <h2>1. {withPerspective("You", "We")} solve big problems</h2>
      <p>
        {withPerspective("I", "We")} believe in making an impact in what{" "}
        {withPerspective("I", "we")} do
        {withPerspective(
          " - or I would have stuck around building websites for SMEs.",
          "."
        )}{" "}
        {withPerspective("I", "We")} want to know that{" "}
        {withPerspective("my", "our")} work helps make the lives of people
        better - to{" "}
        <a href="https://www.macworld.com/article/1162827/steve-jobs-making-a-dent-in-the-universe.html">
          put a small dent in the universe
        </a>
        .
      </p>
      <p>In my {withPerspective("current ", "")}team, we:</p>
      <ul>
        <li>combat identity fraud through my work on verifiable claims</li>
        <li>
          automate document processing and facilitating electronic asset
          transfer for Singapore's multi-billion dollar trade industry
        </li>
        <li>
          and, protect the privacy of foreign workers through user-controlled
          data sharing schemes{" "}
        </li>
      </ul>
      {/* Paragraph 1 */}
      <h2>
        2. {withPerspective("You", "We")} focus on solving problems instead of
        building products
      </h2>
      <p>
        {withPerspective("If you are asking ", "We do not ask ")}
        how {withPerspective("I", "you")} can help{" "}
        {withPerspective("you", "us")} "build an AI/Blockchain/Chatbot"
        {withPerspective(", we are probably misaligned", "")}.{" "}
        {withPerspective("I'm", "We're")} interested in solving problems, not
        just building products. {withPerspective("I", "We")} believe that the
        best solution to a problem is more than just a tech product, it is
        usually a cocktail of{" "}
        <a href="https://www.groupmap.com/map-templates/pest-analysis/">
          political, environmental, societal and technological
        </a>{" "}
        changes. The precursor of which, is a deep understanding of the problem.
      </p>
      <p>
        My team primarily deals with blockchain technology. However, we do not
        aim to "dispense" the technology as the panacea to all problems. We have
        the autonomy to decide on how we engage businesses or problem owners to
        design a solution for their problem. Often, we find synergy in our
        expertise in the technology and our partner's expertise in their problem
        space. Aside from building the product, our work as partners involves
        user studies, industry outreach &amp; partnership and policy changes.
        All of which are essential to ensuring the success of the solution.
      </p>
      <h2>3. {withPerspective("You", "We")} are not afraid to fail</h2>
      <p>
        {withPerspective("I need", "We have")} a culture in which it is{" "}
        <a href="https://www.linkedin.com/pulse/work-principle-3-create-culture-which-okay-make-mistakes-ray-dalio/">
          okay to make mistakes, yet unacceptable not to learn from them
        </a>
        . {withPerspective("Not", "We understand that not")} designing rooms for
        employees to make mistakes and or fail is a deadly flaw in the
        organisation design. It is as immature a thought as believing that{" "}
        {withPerspective("your ", "our ")}
        softwares can be bug-free. {withPerspective(
          "The best teams",
          "We"
        )}{" "}
        have processes to approach these problems, solving them iteratively and
        guardrails to prevent everyone from making the same mistakes.
      </p>
      <p>
        {withPerspective(
          "My current role involves navigating",
          "My team navigates"
        )}{" "}
        uncertain and rough terrain. Working at the bleeding edge involves
        conducting tons of tech spikes and experiments, charging ahead to build
        a solution with nothing but an abstract concept, and in the process,
        break things. We do not allow perfect to become the enemy of good.{" "}
        {withPerspective("My", "Our")} guiding principle is to not make the same
        mistake twice - to fail better and fall forward each time.
      </p>
      <h2>
        4. {withPerspective("You", "We")} respect individual strengths and
        diversity
      </h2>
      <p>
        {withPerspective("I am me", "You are you")}. There is no one else like{" "}
        {withPerspective("me", "you")}. And {withPerspective("I", "you")} cannot
        fill in the role of someone else perfectly.{" "}
        {withPerspective("I expect your company", "You can expect us")} to
        understand that {withPerspective("I", "you")} have{" "}
        {withPerspective("my ", "your ")}
        strengths and weaknesses, and that{" "}
        <a href="https://fourminutebooks.com/strengthsfinder-2-0-summary/">
          doubling down on {withPerspective("my", "your")} strengths is the only
          way {withPerspective("I", "you")} can add the most value to{" "}
          {withPerspective("your organisation", "the team")}
        </a>
      </p>
      <p>
        The diversity in my team allow us to play to our strengths. Each of us
        is good at different things.{" "}
        {withPerspective(
          "I shine at breaking down complex problems into smaller digestible pieces, and I can put my team on track to help them focus on what to work on next. ",
          ""
        )}
        In my team, we respect that people likes to work of different things.
        That's why everyone owns a part of the project that resonates with them
        and that they can best contribute to.
      </p>

      <h2>5. {withPerspective("You", "We")} are radically open-minded</h2>
      <p>
        {withPerspective("You", "We")} don't need {withPerspective("me", "you")}{" "}
        if {withPerspective("you", "we")} think that{" "}
        {withPerspective("you", "we")}'ve got it all figured out and all{" "}
        {withPerspective("I", "you")} need is to do is to toe the line. I would
        like to think that experts in {withPerspective("your", "my")}{" "}
        organisation have been hired so that they can tell{" "}
        {withPerspective("you", "me")} what to do. Not the other way around.{" "}
        {withPerspective("To do that, your organisation needs to", "We")}{" "}
        recognise that{" "}
        <a href="https://www.inc.com/carmine-gallo/a-self-made-billionaire-reveals-the-1-mental-hurdl.html">
          decision making is a two-step process: First take in all the relevant
          information, then decide
        </a>
        .
      </p>
      <p>
        Working with complex problems means that we cannot possibly know all the
        information beforehand and we cannot allow the uncertainty to cripple
        our decision making capabilities. My team is empowered to make decisions
        with the latest available information, allowing us to continuously
        deliver. We are encouraged to bring in more information and perspectives
        to the problem to make sure that we are working in the right direction
        and if it is not, steer the development as necessary.
      </p>
      <h2>6. {withPerspective("You", "We")} compensate fairly</h2>
      <p>
        {withPerspective("I", "You can")} expect{" "}
        {withPerspective("your", "the")} company to pay{" "}
        {withPerspective("north of ", "")}fair and have performance metrics tied
        to compensation. Of course, {withPerspective("I", "you")} will be
        reasonable to consider the entire package consisting of working
        arrangements, learning &amp; growth opportunities, and additional
        benefits. It's an added bonus {withPerspective("if your ", "that the ")}
        organisation focuses on making the pie bigger, rather than on how to
        slice it so that {withPerspective("myself", "you")} or someone else gets
        the bigger piece.
      </p>
      <p>
        In my company, we tie compensation strongly to individual performance
        yet careful enough not to create an environment of unhealthy
        competition. The icing on the cake is the liberal funding and support
        for trainings and conferences.
      </p>
      <h2>Finally...</h2>
      <p>
        Now that I've laid out{" "}
        {withPerspective("these expectations", "what you can expect")}
        {withPerspective(
          <>
            <a href="/contact"> drop me a note</a> if your company meets my
            expectations.
          </>,
          ", if you think we meet your expectations, check out the roles available in my team:"
        )}{" "}
        {withPerspective(
          "This is what my current job offers and I expect no less of my future employer.",
          ""
        )}
      </p>
      {!isRecruiter && (
        <div
          style={{ backgroundColor: "rgba(68,68,68,0.1)" }}
          className="p-4 mb-2"
        >
          <h3>Frontend Developer</h3>
          <h4>Requirements:</h4>
          <p>
            <ul>
              <li>
                Experienced with modern JS frontend framework. (We use react.js)
              </li>
              <li>Friendly and collaborative personality.</li>
              <li>
                Any experience with Blockchain Distributed Applications (DApp)
                development is a plus.
              </li>
            </ul>
          </p>
          <p>
            <a href="/contact">Contact me</a> if you fit the profile.
          </p>
          <p>
            <small>
              P.s. Showing us your most kickass work or side project will
              probably get us more excited than a thousand pages resume.
            </small>
          </p>
        </div>
      )}
      <p>
        {withPerspective(
          "If you were an experienced developer, wouldn't you expect the same? Now, read this as a job invitation:",
          "If you were my recruiter, I would expect the same as well. Now read this as a open letter to recruiters:"
        )}
      </p>
      {withPerspective(
        <button
          className="btn btn-outline-secondary btn-lg btn-block"
          onClick={togglePerspective}
        >
          Read as a job seeker
        </button>,
        <button
          className="btn btn-outline-secondary btn-lg btn-block"
          onClick={togglePerspective}
        >
          Read as a recruiter
        </button>
      )}

      <hr />
      <h5>Footnote</h5>
      <small>
        <p className="my-2">
          This article was written to help recruiters understand that developers
          are neither nameless or faceless. Every decent developer has
          expectations. So stop approaching us with messages that goes like "Hi,
          another headhunter here. I have a position for X. Good budget.". You
          will not find decent developer that way.
        </p>
        <p className="my-2">
          The above accounts are based on my personal experience in my
          workplace. Is that environment for everyone? No.
        </p>
        <p className="my-2">
          In writing this article, I have referenced many work of Ray Dalio's
          Principles and Tom Rath's StrengthFinder. I highly recommend these two
          books for managers.
        </p>
        <p className="my-2">
          Yes, you may approach me for job offers if you meet the above
          expectations. I never close doors on opportunities.
        </p>
        <p className="my-2">
          Yes, I'm hiring for my team. We are working on super cool blockchain
          projects related to data privacy, provenance and tokenisation (for
          asset transfer).
        </p>
      </small>
    </div>
  );
};

export default () => <Blog meta={meta}>{Content()}</Blog>;
