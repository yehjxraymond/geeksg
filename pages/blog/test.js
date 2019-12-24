import React, { useState } from "react";
import Blog from "../../components/layouts/Blog";

export const meta = {
  date: new Date("07 July 2019"),
  title: "Dear Recruiters",
  slug: "dear-recruiters",
  summary:
    "I've received numerous job invitations but realised most of these jobs do not meet my expectations. Rather than reviewing each one manually, I'm automating the process by writing this so I can focus my attention to those jobs that I can give my 101% efforts to without wasting a trip down your office."
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
      <button onClick={spin} className="btn btn-block btn-dark">
        Spin
      </button>
    </div>
  );
};

const Content = () => {
  const [value, setValue] = useState(INITIAL_VALUE);
  const [bet, setBet] = useState(INITIAL_BET);
  const [noGames, setNoGames] = useState(INITIAL_NO_GAMES);
  const resetGame = () => {
    setValue(INITIAL_VALUE);
    setBet(INITIAL_BET);
    setNoGames(INITIAL_NO_GAMES);
  };
  const addValue = diff => {
    if (noGames > 0) {
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
      <h1>Bet Sizing with Kelly</h1>
      <p>
        Let's play roulette. There are 3 wheels of different payout. Some wheels
        are more risky than others. You have a starting balance of $100 and may
        play 20 games. In each game, you may choose the size of you bet. Your
        goal is to have the most amount of money at the end of 20 games. How
        well do you think you will do?
      </p>
      <p>Go ahead and play the game below.</p>
      <p>
        The numbers on the wheel represents the payout per dollar bet. You may
        adjust you bet size in the input field below. Once you are happy with
        your bet size click on "Spin" on the corresponding wheel.
      </p>
      <h2>The Game</h2>
      <div className="d-flex justify-content-between">
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
          <div className="col bg-dark text-white">Bet:</div>
          <div className="col">
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

      <h2>Playing like a pro</h2>
      <p>
        How well have you done on your first round? Do you think you can do
        better? If so, try your hands at it again until you are happy with your
        results.
      </p>
      <p></p>
    </div>
  );
};

const Page = () => <Blog meta={meta}>{Content()}</Blog>;
export default Page;
