import React, { useState, useEffect } from "react";
import Blog from "../../components/layouts/Blog";
import Image from "../../components/snippets/Image";

export const meta = {
  date: new Date("24 December 2019"),
  title: "Bet Sizing with Kelly - Risk of Ruins (Interactive Post)",
  slug: "bet-sizing-with-kelly-risk-ruins",
  summary:
    "Let's play roulette. There are 3 wheels of different payouts. Some wheels are riskier than others. You have a starting balance of $100 and may play 20 games. In each game, you may choose the size of your bet. Your goal is to have the most amount of money at the end of 20 games. How well do you think you will do?"
};

const INITIAL_VALUE = 100;
const INITIAL_BET = 10;
const INITIAL_NO_GAMES = 20;

const Wheel = ({ bet, addValue, payout, label, img }) => {
  const spin = () => {
    let rand = Math.random();
    let resultingOdds;
    for (let p of payout) {
      rand = rand - p.weights;
      if (rand <= 0) {
        resultingOdds = p.odds;
        break;
      }
    }
    addValue(resultingOdds * bet - bet);
  };
  return (
    <div className="bg-white p-2 m-2 d-flex flex-column justify-content-between">
      <div>
        <h4 className="p-2">{label}</h4>
        <img src={img} className="w-100" />
        <div className="text-center p-4">
          If you bet ${bet}...
          <div className="row bg-dark text-white">
            <div className="col-6">Payout</div>
            <div className="col-6">Chance</div>
          </div>
          {payout.map((p, i) => (
            <div className="row" key={i}>
              <div className="col-6">{`$${(p.odds * bet).toFixed(2)}`}</div>
              <div className="col-6">{`${(p.weights * 100).toFixed(2)}%`}</div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={spin}
        className="btn btn-block btn-dark"
        style={{ touchAction: "manipulation" }}
      >
        Spin
      </button>
    </div>
  );
};

const Content = () => {
  const [value, setValue] = useState(INITIAL_VALUE);
  const [bet, setBet] = useState(INITIAL_BET);
  const [noGames, setNoGames] = useState(INITIAL_NO_GAMES);
  const [history, setHistory] = useState([]);
  const [width, setWidth] = useState(null);
  if (process.browser) {
    useEffect(() => setWidth(document.children[0].clientWidth), [
      document.children[0].clientWidth
    ]);
  }
  const resetGame = () => {
    setValue(INITIAL_VALUE);
    setBet(INITIAL_BET);
    setNoGames(INITIAL_NO_GAMES);
    setHistory([]);
  };
  const addValue = diff => {
    if (noGames > 0) {
      if (width <= 600)
        alert(
          `Payout: ${bet + diff}; Balance: ${diff >= 0 ? `+${diff}` : diff}`
        );
      setHistory([diff, ...history]);
      setValue(value + diff);
      setNoGames(noGames - 1);
    } else {
      alert("No more games left");
    }
  };

  const payout1 = [
    {
      odds: 1,
      weights: 1 / 2
    },
    {
      odds: 2,
      weights: 1 / 2
    }
  ];

  const payout2 = [
    { odds: 0, weights: 1 / 6 },
    { odds: 1, weights: 1 / 6 },
    { odds: 2, weights: 1 / 2 },
    { odds: 3, weights: 1 / 6 }
  ];

  const payout3 = [
    { odds: 0.5, weights: 1 / 2 },
    { odds: 3, weights: 1 / 2 }
  ];

  const onInputChange = e => {
    try {
      const newBet = Number(e.target.value);
      if (newBet > value) throw new Error("Bet cannot be greater than balance");
      if (newBet < 0) throw new Error("Bet cannot be negative");
      if (isNaN(newBet)) throw new Error("Bet is not a number");
      setBet(newBet);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h1>Bet Sizing with Kelly - Risk of Ruins (Interactive Post)</h1>
      <p>
        Let's play roulette. There are 3 wheels of different payouts. Some
        wheels are riskier than others. You have a starting balance of $100 and
        may play 20 spins. Before each spins, you may choose{" "}
        <strong> the size of your bet</strong> and{" "}
        <strong>the wheel to spin</strong>. Your goal is to have the most amount
        of money at the end of 20 games.
      </p>
      <p>
        The numbers on the wheel represent the payout per dollar bet. You may
        adjust your bet size in the input field below. Once you are happy with
        your bet size click on "Spin" on the corresponding wheel.
      </p>
      <p>
        Go ahead and play the game below. But before you do, answer the
        following questions:
      </p>
      <p>How well do you think you will do?</p>
      <p>Which will be your favourite wheel?</p>
      <h2>The Game</h2>
      <Image
        width="100"
        src="/static/blog/2019/12/bet-sizing/bet-sizing-with-kelly-risk-ruins.png"
        alt="Bet sizing with Kelly"
        hidden={true}
      />
      
      <div>
        <div className="row m-2">
          <div className="col bg-dark text-white">Games Left:</div>
          <div className="col" style={{ fontWeight: "bold" }}>
            {noGames > 0 ? (
              noGames
            ) : (
              <button onClick={resetGame} className="btn btn-dark">
                No More Games - Reset
              </button>
            )}
          </div>
        </div>
        <div className="row m-2">
          <div className="col bg-dark text-white">Balance:</div>
          <div className="col" style={{ fontWeight: "bold" }}>
            ${value}
          </div>
        </div>
        <div className="row m-2">
          <div className="col bg-dark text-white">History:</div>
          <div className="col" style={{ fontWeight: "bold" }}>
            {history.map((diff, i) => (
              <div
                className="bg-dark text-white d-inline-block p-1 m-1"
                key={i}
              >
                {diff > 0 ? `+${diff}` : diff}
              </div>
            ))}
          </div>
        </div>
        <div className="row m-2">
          <div className="col bg-dark text-white">Bet:</div>
          <div className="col pt-2">
            <input
              type="number"
              value={bet}
              onChange={onInputChange}
              style={{ width: "100%" }}
            />
            <div className="d-flex justify-content-between mt-2">
              <button
                className="btn btn-dark"
                onClick={() => setBet(value * 0.1)}
              >
                10%
              </button>
              <button
                className="btn btn-dark"
                onClick={() => setBet(value * 0.25)}
              >
                25%
              </button>
              <button
                className="btn btn-dark"
                onClick={() => setBet(value * 0.5)}
              >
                50%
              </button>
              <button
                className="btn btn-dark"
                onClick={() => setBet(value * 0.75)}
              >
                75%
              </button>
              <button className="btn btn-dark" onClick={() => setBet(value)}>
                Max
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-sm-flex justify-content-between">
        <Wheel
          bet={bet}
          addValue={addValue}
          payout={payout1}
          label="Wheel 1"
          img="/static/blog/2019/12/bet-sizing/wheel1.png"
        />
        <Wheel
          bet={bet}
          addValue={addValue}
          payout={payout2}
          label="Wheel 2"
          img="/static/blog/2019/12/bet-sizing/wheel2.png"
        />
        <Wheel
          bet={bet}
          addValue={addValue}
          payout={payout3}
          label="Wheel 3"
          img="/static/blog/2019/12/bet-sizing/wheel3.png"
        />
      </div>

      <h2>Playing like a pro</h2>
      <p>
        How well have you done on your first round? Do you think you can do
        better? If so, try your hands at it again until you are happy with your
        results.
      </p>
      <p>
        If you have played it right, your average (or expected) balance at the
        end of the 20 games should be <strong>$96,400</strong>.
      </p>
      <p>
        If you are not in that range and would like to figure out how to reach
        that balance at the end of the game, scroll up to the game before you
        read on to the spoiler.
      </p>

      <h2>Rolling your winnings</h2>
      <p>
        The simplest way to play this game is to roll your winnings. Amongst the
        3 wheels, wheels 1 and 3 are the wheels that have no{" "}
        <a href="https://en.wikipedia.org/wiki/Risk_of_ruin">risk of ruins</a>.
        That means there is exactly 0 probability that you will lose all your
        bet playing these two wheels.
      </p>
      <p>
        This gets even more interesting with wheel 1 as you will never lose
        money on it. The minimum winning you get from spinning the wheel is the
        bet itself. That means it will be safe to bet your entire balance on
        wheel 1 each time.
      </p>
      <p>
        By betting your entire balance on wheel 1 each time, you have a 50%
        chance of doubling your balance, and a 50% chance of not winning (or
        losing) anything. On an average of 20 spins, you will likely get 10
        chance of doubling your balance - your initial balance will be
        multiplied 2 ^ 10 = 1,024 times!
      </p>

      <h2>Bring in the maths</h2>
      <p>
        You might have picked out that one could do the same with wheel 3 as
        well. So how do we compare the performance of the wheel given that our
        strategy is to always bet the entire balance?
      </p>
      <p>
        The strategy is to calculate the{" "}
        <a href="https://en.wikipedia.org/wiki/Geometric_mean">
          geometric mean
        </a>{" "}
        of the three wheels. To calculate the geometric mean, we simply take the
        nth root of the product of n numbers.
      </p>
      <p>For example for wheel 1, the geometric mean is: </p>
      <p className="text-center">
        <img src="/static/blog/2019/12/bet-sizing/root.gif"></img>
      </p>
      <p>
        Wait, that's a different formula than what we were taught in school?
      </p>
      <p>Indeed.</p>
      <p>
        The other formula is more accurately named arithmetic mean and is not so
        useful to calculate compounding effects. Check out{" "}
        <a href="https://www.investopedia.com/ask/answers/06/geometricmean.asp">
          this article
        </a>{" "}
        for a short discussion on the difference.
      </p>

      <h2>Expected returns on the wheels</h2>
      <p>
        Now that we can calculate the geometric means, let's take a look at the
        expected returns on the wheels after 20 spins.
      </p>
      <p>To do that, simply raise the geometric mean to the 20th power!</p>
      <p>
        For example, the expected returns for wheel 1 will be 1.41 ^ 20 = 964.68
      </p>
      <p>
        For your convenience, below is the table of the results for the wheels:
      </p>
      <table className="text-center">
        <thead>
          <tr>
            <th>Wheel</th>
            <th>Arithmetic mean</th>
            <th>Geometric mean</th>
            <th>Expected return (after 20 spins)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#1</td>
            <td>1.50</td>
            <td>1.41</td>
            <td>964.68 * 100 = $96,468</td>
          </tr>
          <tr>
            <td>#2</td>
            <td>1.67</td>
            <td>0.00</td>
            <td>0.00 * 100 = $0.00</td>
          </tr>
          <tr>
            <td>#3</td>
            <td>1.75</td>
            <td>1.22</td>
            <td>53.36 * 100 = $5,336</td>
          </tr>
        </tbody>
      </table>
      <p>We can point out two observations from here:</p>
      <ul>
        <li>
          Once there is a chance of losing the entire bet, the geometric mean
          and expected returns becomes zero.
        </li>
        <li>
          A small difference in geometric mean (1.41 vs 1.22) results in a huge
          difference in return after 20 spins.
        </li>
      </ul>

      <h2>Lessons learned</h2>
      <p>Why are we playing this game? </p>
      <p>
        Each of these wheels represents different investable assets, and each
        spin at the wheel is simply the returns for a period of time your money
        stayed on that asset.
      </p>
      <p>
        The purpose of this game is for me to illustrate a few concepts in
        investments in general:
      </p>
      <ul>
        <li>Compounding interest is real!</li>
        <li>
          Risk management is as important as picking the best-performing assets
        </li>
      </ul>

      <p>
        Of course, the numbers on the wheels are exaggerated and some
        assumptions like zero risk of ruins are not realistic when companies
        goes into bankruptcy all the time.
      </p>
      <p>And that brings me to...</p>

      <h2>What if there is a risk of ruins</h2>

      <Image
        width="75"
        src="/static/blog/2019/12/bet-sizing/leverage.png"
        alt="Bet sizing with Kelly"
        caption="Bet sizing with Kelly"
      />

      <p>
        Bet sizing (or risk management) strategy also exists for games with risk
        of ruins. Stay tuned for the next interactive blog post where we remove
        wheels without 0 payouts and learn about Kelly Criterion!
      </p>

      <p>
        <small>
          Ps. If you find this interactive post helpful in helping you learn
          more about personal finance, please share it with your friends!
        </small>
      </p>
    </div>
  );
};

const Page = () => <Blog meta={meta}>{Content()}</Blog>;
export default Page;
