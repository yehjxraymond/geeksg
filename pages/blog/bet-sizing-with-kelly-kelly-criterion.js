import React, { useState, useEffect } from "react";
import Blog from "../../components/layouts/Blog";
import Image from "../../components/snippets/Image";
import { max, mean, min, median } from "simple-statistics";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from "victory";

export const meta = {
  date: new Date("05 January 2020"),
  title: "Betting with Kelly - Kelly Criterion (Part 2/2)",
  slug: "bet-sizing-with-kelly-kelly-criterion",
  summary:
    "In a random corner of a casino, you found a spin-the-wheel game with great odds but a small chance of losing your bet. You know that you can compound the winnings and by betting incrementally allows your balance to grow exponentially. You could bet 100% of your balance each game but you are worried that landing on a 0x will zero you out. How will you bet to maximise your final balance (and maybe take the casino home)?"
};

const payout = [
  { odds: 0, weights: 1 / 6 },
  { odds: 1, weights: 1 / 6 },
  { odds: 2, weights: 1 / 2 },
  { odds: 3, weights: 1 / 6 }
];

const SimulationResultStatistics = ({ simulationResults }) => {
  if (simulationResults.length === 0) return null;
  const finalBalances = simulationResults.map(
    result => result[result.length - 1]
  );
  return (
    <>
      <h5>Final Balances</h5>
      <div className="d-flex justify-content-between flex-column flex-md-row">
        <div className="d-flex border flex-fill">
          <div className="p-2 bg-dark text-white">Max:</div>
          <div className="p-2">${max(finalBalances).toLocaleString()}</div>
        </div>
        <div className="d-flex border flex-fill">
          <div className="p-2 bg-dark text-white">Min:</div>
          <div className="p-2">${min(finalBalances).toLocaleString()}</div>
        </div>
        <div className="d-flex border flex-fill">
          <div className="p-2 bg-dark text-white">Mean:</div>
          <div className="p-2">${mean(finalBalances).toLocaleString()}</div>
        </div>
        <div className="d-flex border flex-fill">
          <div className="p-2 bg-dark text-white">Median:</div>
          <div className="p-2">${median(finalBalances).toLocaleString()}</div>
        </div>
      </div>
    </>
  );
};

const SimulationResultChart = ({ simulationResults }) => {
  if (simulationResults.length === 0) return null;

  let highestEndingBalanceLineIndex;
  let highestEndingBalanceLine;
  let lowestEndingBalanceLineIndex;
  let lowestEndingBalanceLine;

  simulationResults.forEach((result, i) => {
    const balance = result[result.length - 1];
    if (!highestEndingBalanceLineIndex) {
      highestEndingBalanceLineIndex = i;
      highestEndingBalanceLine = balance;
      lowestEndingBalanceLineIndex = i;
      lowestEndingBalanceLine = balance;
    } else {
      if (balance > highestEndingBalanceLine) {
        highestEndingBalanceLineIndex = i;
        highestEndingBalanceLine = balance;
      }
      if (balance < lowestEndingBalanceLine) {
        lowestEndingBalanceLineIndex = i;
        lowestEndingBalanceLine = balance;
      }
    }
  });

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      scale={{ x: "linear", y: "log" }}
    >
      <VictoryAxis
        dependentAxis
        tickFormat={tick => {
          const digits = Math.floor(Math.log10(Math.abs(tick)));
          switch (true) {
            case digits >= 12:
              return `${tick / 1000000000000}tril`;
            case digits >= 9:
              return `${tick / 1000000000}bil`;
            case digits >= 6:
              return `${tick / 1000000}mil`;
            case digits >= 3:
              return `${tick / 1000}k`;
            default:
              return tick;
          }
        }}
      />
      {simulationResults.map((result, key) => (
        <VictoryLine
          key={key}
          data={result.map((y, x) => ({ x, y }))}
          style={{
            data: {
              stroke:
                key === highestEndingBalanceLineIndex
                  ? "green"
                  : key === lowestEndingBalanceLineIndex
                  ? "red"
                  : undefined,
              strokeWidth:
                key === highestEndingBalanceLineIndex ||
                key === lowestEndingBalanceLineIndex
                  ? 1
                  : 0.5
            }
          }}
        />
      ))}
      <VictoryLine
        style={{
          data: {
            stroke: "#c43a31",
            strokeWidth: 2
          }
        }}
        data={new Array(simulationResults[0].length)
          .fill()
          .map((_y, x) => ({ x, y: 100 }))}
      />
    </VictoryChart>
  );
};

const StrategySimulator = () => {
  const [noSimulations, setNoSimulations] = useState("100");
  const [ratio, setRatio] = useState("10");
  const [noSpins, setNoSpins] = useState("20");
  const [simulationResults, setSimulationResults] = useState([]);

  const runSimulation = (ratio, spins) => {
    const balances = [100];
    for (let i = 0; i < spins; i++) {
      const currentBalance = balances[i];
      const bet = currentBalance * ratio;
      let rand = Math.random();
      let resultingOdds;
      for (let p of payout) {
        rand = rand - p.weights;
        if (rand <= 0) {
          resultingOdds = p.odds;
          break;
        }
      }
      const difference = resultingOdds * bet - bet;
      const nextBalance = currentBalance + difference;
      balances.push(nextBalance);
    }
    return balances;
  };

  const onRunSimulation = () => {
    const wealthRatio = Number(ratio) / 100;
    const spins = Number(noSpins);
    const simulations = Number(noSimulations);
    if (isNaN(wealthRatio)) {
      return alert("Ratio is not a number");
    }
    if (wealthRatio > 1) {
      return alert("Ratio cannot be greater than 100%");
    }
    if (wealthRatio < 0) {
      return alert("Ratio cannot be less than 0%");
    }

    if (isNaN(spins)) {
      return alert("No. spins is not a number");
    }
    if (spins < 0) {
      return alert("No. spins cannot be less than 0");
    }

    if (isNaN(simulations)) {
      return alert("No. simulations is not a number");
    }
    if (simulations < 0) {
      return alert("No. simulations cannot be less than 0");
    }
    if (simulations >= 5000) {
      return alert(
        "Good try stupid, you will hang your browser. Pick something less than 5000"
      );
    }

    const newSimulationResults = [];
    for (let i = 0; i < simulations; i++) {
      newSimulationResults.push(runSimulation(wealthRatio, spins));
    }
    setSimulationResults(newSimulationResults);
  };

  return (
    <div>
      <h3>Strategy Simulator</h3>
      <div className="border p-2">
        <div className="row m-0">
          <div className="col bg-dark text-white">
            Percentage of wealth to bet (%):
          </div>
          <div className="col">
            <input
              className="w-100"
              onChange={e => setRatio(e.target.value)}
              value={ratio}
            />
          </div>
        </div>
        <div className="row m-0">
          <div className="col bg-dark text-white">
            Number of spins per game:
          </div>
          <div className="col">
            <input
              className="w-100"
              onChange={e => setNoSpins(e.target.value)}
              value={noSpins}
            />
          </div>
        </div>
        <div className="row m-0">
          <div className="col bg-dark text-white">
            Number of simulations to run:
          </div>
          <div className="col">
            <input
              className="w-100"
              onChange={e => setNoSimulations(e.target.value)}
              value={noSimulations}
            />
          </div>
        </div>
        <div className="row m-3 d-flex flex-row-reverse">
          <button className="btn btn-success" onClick={onRunSimulation}>
            Run Simulation
          </button>
        </div>
        <SimulationResultStatistics simulationResults={simulationResults} />
        <SimulationResultChart simulationResults={simulationResults} />
      </div>
    </div>
  );
};

const Wheel = ({ bet, addValue, payout }) => {
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
        <div className="text-center">
          <div className="row bg-dark text-white m-0">
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
      <div className="mt-4">
        <button
          onClick={spin}
          className="btn btn-block btn-success"
          style={{ touchAction: "manipulation" }}
        >
          Spin
        </button>
      </div>
    </div>
  );
};

const Game = () => {
  const INITIAL_VALUE = 100;
  const INITIAL_BET = 10;
  const INITIAL_NO_GAMES = 20;
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
      <h2>The Game</h2>
      <div className="row m-4">
        <img
          style={{ margin: "auto" }}
          src="/static/blog/2019/12/bet-sizing/wheel2.png"
          className="w-50"
        />
      </div>
      <div className="row">
        <div className="col-md">
          <div className="row m-2">
            <h3>Balance: ${value}</h3>
          </div>
          <div className="row m-2">
            <div className="col bg-dark text-white">Games Left:</div>
            <div className="col" style={{ fontWeight: "bold" }}>
              {noGames > 0 ? (
                noGames
              ) : (
                <button onClick={resetGame} className="btn btn-danger">
                  No More Games - Reset
                </button>
              )}
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
            </div>
          </div>
          <div className="row m-2">
            <div className="d-flex justify-content-between mt-2 w-100">
              <button
                className="btn btn-primary"
                onClick={() => setBet(value * 0.1)}
              >
                10%
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setBet(value * 0.25)}
              >
                25%
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setBet(value * 0.5)}
              >
                50%
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setBet(value * 0.75)}
              >
                75%
              </button>
              <button className="btn btn-primary" onClick={() => setBet(value)}>
                Max
              </button>
            </div>
          </div>
        </div>
        <div className="col-md">
          <h4>Payouts for Given Bet</h4>
          <Wheel bet={bet} addValue={addValue} payout={payout} />
        </div>
      </div>
    </div>
  );
};

const Content = () => {
  return (
    <div>
      <h1>Betting with Kelly - Kelly Criterion (Interactive Post)</h1>
      <p>In a random corner of a casino, you found a spin-the-wheel game.</p>
      <p>
        The wheel seemed to be rigged to your favor - with 1 in 6 chance to
        triple your bet, 1 in 2 chance to double your bet, 1 in 6 chance to get
        back what you've bet and only 1 in 6 chance to lose what you've bet. The
        game master tells you that the casino had made way too much money last
        year and has created this game to give back.
      </p>
      <p>
        Everyone in line get <strong>20 spins</strong> at the game. You start
        with <strong>$100</strong> and can{" "}
        <strong>bet any amount for each spin</strong>.
      </p>
      <p>
        If you have read{" "}
        <a href="/blog/bet-sizing-with-kelly-risk-ruins">the previous post</a>,
        you might know that you can compound the winnings and bet incrementally
        allows your balance to grow exponentially. You could bet 100% of your
        balance each game but you are worried that landing on a 0x will zero you
        out.
      </p>
      <p>
        How will you bet to maximise your final balance (and maybe take the
        casino home)?
      </p>
      <p>Play the game below to test out your strategy:</p>
      <Image
        width="100"
        src="/static/blog/2020/1/5/overview.png"
        alt="Bet sizing with Kelly"
        hidden={true}
      />
      <Game />
      <p>
        By this time you may have figured that the way to maximise the earnings
        is to bet a ratio of your total balance for each spin. But what ratio
        will that be?
      </p>
      <p>
        Too high, you risk losing too much of your principle when you hit the
        zero.
      </p>
      <p>
        Too little, you are not exactly compounding your winnings. After all,
        you only gets 20 spins.
      </p>
      <p>
        To help you play many games at once, I've included a simulator below.
        For a start, you may tinker with the{" "}
        <strong>Percentage of wealth to bet</strong> to simulate how much you
        will walk away with by betting a fixed percentage of your balance.
      </p>
      <p>
        Keep a lookout on the <strong>median</strong> balance as that will be
        the number you most likely walk away with. Also, keep a lookout of the
        distribution of results above and below the red line which denotes the
        starting balance.
      </p>
      <p>Go ahead and play with the simulator, try a few ratios!</p>
      <StrategySimulator />
      <p>
        At this point, you probably tried simulating with a few ratios
        (including 100% I suppose). You would have realised the perfect ratio is
        between the range from 55% to 75%.
      </p>
      <p>
        What you've done is a{" "}
        <a href="https://en.wikipedia.org/wiki/Monte_Carlo_method">
          Monte Carlo method
        </a>{" "}
        to figure the best ratio!
      </p>
      <p>
        However,{" "}
        <a href="https://en.wikipedia.org/wiki/John_Larry_Kelly_Jr.">
          John Larry Kelly Jr.
        </a>{" "}
        has a formula for bet sizing that leads almost surely to higher wealth
        compared to any other strategy in the long run known as the{" "}
        <a href="https://en.wikipedia.org/wiki/Kelly_criterion">
          Kelly Criterion
        </a>
        .
      </p>
      <h2>Kelly Criterion</h2>
      <p>The formula is simple:</p>
      <div className="text-center">
        <img src="/static/blog/2020/1/5/kelly-simplified.svg" />
      </div>
      <p>or</p>
      <div className="text-center">
        <img src="/static/blog/2020/1/5/kelly-criterion-formula.svg" />
      </div>
      <p>where:</p>
      <ul>
        <li>
          f* is the fraction of the current bankroll to wager, i.e. how much to
          bet
        </li>
        <li>b is the net odds received on the wager ("b to 1")</li>
        <li>p is the probability of winning</li>
        <li>q is the probability of losing, which is 1-p</li>
      </ul>
      <p>
        In the case of this game, the probability of winning a bet (
        <strong>p</strong>) is 5/6 and that of losing (<strong>q</strong>) is
        1/6. The only problem is calculating <strong>b</strong>.
      </p>
      <p>
        If we assume the compounding effect on the long term, we can take the
        geometric mean of the odds (given that we landed on a non-zero):
      </p>
      <div className="text-center">
        <img src="/static/blog/2020/1/5/geometric-mean.gif" />
      </div>
      <p>
        which roughly equals to 1.888. Since b is the net odds,{" "}
        <strong>b</strong> = <strong>0.888</strong>.
      </p>
      <p>
        With all the numbers, you can calculate that <strong>f*</strong> roughly
        equals to <strong>0.6456</strong> or <strong>64.56%</strong>.
      </p>
      <p>
        Now try going back to the simulator with 64.56%. You will likely notice
        that by using the Kelly ratio:
      </p>
      <ul>
        <li>the median balance is the highest</li>
        <li>
          there is the least number of scenarios that end up with less cash than
          it started with
        </li>
      </ul>
      <p>
        Try out the simulator with a larger number of spins per game, maybe 50,
        and you will notice that you will almost always make money with that
        ratio.
      </p>
      <h2>Application of Kelly Criterion</h2>
      <p>
        Naturally, this post is not about a fictitious casino that is dumb
        enough to offer you a game that could potentially bankrupt them.
      </p>
      <p>
        This post is to help you manage the risk of a financial asset by
        adjusting the amount invested in a single asset. Other than determining
        what fraction to wealth to allocate to an asset to limit your risk,
        Kelly Criterion can also be used to determine how much to leverage
        (since the ratio can be greater than 1).
      </p>
      <p>
        Remember that it's not just all "High risk, high returns". You will need
        to adjust your portfolio allocation accordingly to the returns and risks
        involved.
      </p>
      <p>
        If you are interested to learn more about risk management with Kelly,
        here are some areas to read up on:
      </p>
      <ul>
        <li>Kelly Criterion for multiple games</li>
        <li>Fractional Kelly</li>
        <li>Leveraging with Kelly</li>
      </ul>
      <p>
        If you like to read a book, I will highly recommend "Fortune's Formula"
        for a start.
      </p>
      <p>
        <small>
          Ps. If you find this interactive post helpful in helping you learn
          more about finance, please share it with your friends!
        </small>
      </p>
    </div>
  );
};

const Page = () => <Blog meta={meta}>{Content()}</Blog>;
export default Page;
