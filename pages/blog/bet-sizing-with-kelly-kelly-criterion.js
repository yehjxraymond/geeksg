import React, { useState, useEffect } from "react";
import Blog from "../../components/layouts/Blog";
import Image from "../../components/snippets/Image";
import { orderBy } from "lodash";
import { max, mean, min, median, quantile } from "simple-statistics";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from "victory";

export const meta = {
  date: new Date("24 December 2019"),
  title: "Bet Sizing with Kelly - Risk of Ruins (Interactive Post)",
  slug: "bet-sizing-with-kelly-risk-ruins",
  summary:
    "Let's play roulette. There are 3 wheels of different payouts. Some wheels are riskier than others. You have a starting balance of $100 and may play 20 games. In each game, you may choose the size of your bet. Your goal is to have the most amount of money at the end of 20 games. How well do you think you will do?"
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
      <div className="d-flex justify-content-between">
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
  const [ratio, setRatio] = useState("60");
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
            Percentage of wealth to bet:
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
          <button className="btn btn-dark" onClick={onRunSimulation}>
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
    <>
      <Game />
      <StrategySimulator />
    </>
  );
};

const Page = () => <Blog meta={meta}>{Content()}</Blog>;
export default Page;
