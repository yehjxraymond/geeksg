import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Inaccuracies:
// CPF AGE by month
// Cannot transfer OA into SA after FRS is hit on SA

const zeroAccount = () => ({
  sa: 0,
  ma: 0,
  ra: 0,
  oa: 0
});

export const getFrs = year => {
  switch (year) {
    case 2017:
      return 166000;
    case 2018:
      return 171000;
    case 2019:
      return 176000;
    case 2020:
      return 181000;
    case 2021:
      return 186000;
    case 2022:
      return 192000;
    default:
      return Math.pow(1.03, year - 2022) * 192000;
  }
};

export const salaryContribution = (salary, age = 0) => {
  const eligibleSalary = Math.min(6000, salary);
  switch (true) {
    case age <= 35:
      return {
        oa: 0.23 * eligibleSalary,
        sa: 0.06 * eligibleSalary,
        ma: 0.08 * eligibleSalary
      };
    case age <= 45:
      return {
        oa: 0.21 * eligibleSalary,
        sa: 0.07 * eligibleSalary,
        ma: 0.09 * eligibleSalary
      };
    case age <= 50:
      return {
        oa: 0.19 * eligibleSalary,
        sa: 0.08 * eligibleSalary,
        ma: 0.1 * eligibleSalary
      };
    case age <= 55:
      return {
        oa: 0.15 * eligibleSalary,
        sa: 0.115 * eligibleSalary,
        ma: 0.105 * eligibleSalary
      };
    case age <= 60:
      return {
        oa: 0.12 * eligibleSalary,
        sa: 0.035 * eligibleSalary,
        ma: 0.105 * eligibleSalary
      };
    case age <= 65:
      return {
        oa: 0.035 * eligibleSalary,
        sa: 0.025 * eligibleSalary,
        ma: 0.105 * eligibleSalary
      };
    default:
      return {
        oa: 0.01 * eligibleSalary,
        sa: 0.01 * eligibleSalary,
        ma: 0.105 * eligibleSalary
      };
  }
};

export const calculateAccruedInterest = (cpf, age = 0) => {
  const oaInterest = 0.025 / 12;
  const maInterest = 0.04 / 12;
  const raInterest = 0.04 / 12;
  const saInterest = 0.04 / 12;

  const baseInterest = {
    oa: cpf.oa * oaInterest,
    sa: cpf.sa * saInterest,
    ra: cpf.ra * raInterest,
    ma: cpf.ma * maInterest
  };

  // Calculate additional 1%
  const onePct = 0.01 / 12;
  let budget = age >= 55 ? 90000 : 60000;
  const additionalInterest = zeroAccount();
  if (budget >= cpf.ra) {
    budget -= cpf.ra;
    additionalInterest.ra += cpf.ra * onePct;
  } else {
    additionalInterest.ra += budget * onePct;
    budget = 0;
  }

  if (budget >= cpf.oa) {
    const effectiveOa = Math.min(20000, cpf.oa);
    budget -= effectiveOa;
    additionalInterest.oa += effectiveOa * onePct;
  } else {
    const effectiveOa = Math.min(20000, budget);
    additionalInterest.oa += effectiveOa * onePct;
    budget = 0;
  }

  if (budget >= cpf.sa) {
    budget -= cpf.sa;
    additionalInterest.sa += cpf.sa * onePct;
  } else {
    additionalInterest.sa += budget * onePct;
    budget = 0;
  }

  if (budget >= cpf.ma) {
    budget -= cpf.ma;
    additionalInterest.ma += cpf.ma * onePct;
  } else {
    additionalInterest.ma += budget * onePct;
    budget = 0;
  }

  return sumAccount(baseInterest, additionalInterest);
};

export const sumAccount = (account, difference) => ({
  oa: account.oa + difference.oa || 0,
  sa: account.sa + difference.sa || 0,
  ma: account.ma + difference.ma || 0,
  ra: account.ra + difference.ra || 0
});

export const nextMonth = ({
  current,
  birthYear,
  year,
  month,
  salary,
  accruedInterest,
  stopWorkAge,
  topUp,
  transfer
}) => {
  let cpf = current;
  let currentAccruedInterest = accruedInterest;
  const currentAge = year - birthYear;

  // Currently december, credit interest in the following month and zero accrued interest
  if (month === 11) {
    cpf = sumAccount(cpf, currentAccruedInterest);
    currentAccruedInterest = zeroAccount();
  }

  if (month === 0 && cpf.sa < getFrs(year)) {
    // Credit cpf SA top up in Jan
    if (topUp) {
      let availableTopUpBudget = getFrs(year) - cpf.sa;
      const actualAmount = Math.min(availableTopUpBudget, topUp);
      cpf.sa += actualAmount;
      availableTopUpBudget -= actualAmount;
    }

    // Transfer cpf OA to SA in Jan
    if (transfer) {
      let availableTopUpBudget = getFrs(year) - cpf.sa;
      const actualAmount = Math.min(availableTopUpBudget, cpf.oa, transfer);
      cpf.sa += actualAmount;
      cpf.oa -= actualAmount;
    }
  }

  // Add salary if still working
  if (currentAge < stopWorkAge) {
    const currentSalaryContribution = salaryContribution(salary, currentAge);
    cpf = sumAccount(cpf, currentSalaryContribution);
  }
  // Add accrued interest
  const additionalInterest = calculateAccruedInterest(cpf, currentAge);
  currentAccruedInterest = sumAccount(
    currentAccruedInterest,
    additionalInterest
  );

  return {
    cpf,
    accruedInterest: currentAccruedInterest
  };
};

export const computeCpf = ({
  current,
  salary,
  topUp = 0,
  transfer = 0,
  stopWorkAge = 0,
  birthYear
}) => {
  const forecast = [];
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth(); // Starts with 0
  let ageThisYear = currentYear - birthYear;
  let accruedInterest = zeroAccount();

  forecast.push({
    ...current,
    year: currentYear,
    month: currentMonth,
    age: ageThisYear,
    accruedInterest: zeroAccount(),
    creditedInterest: zeroAccount()
  });

  while (ageThisYear <= 55) {
    const lastBalance = forecast[forecast.length - 1];
    ageThisYear = currentYear - birthYear;

    const nextState = nextMonth({
      current: lastBalance,
      birthYear,
      year: currentYear,
      month: currentMonth,
      salary,
      accruedInterest,
      topUp,
      transfer,
      stopWorkAge
    });

    currentMonth = (currentMonth + 1) % 12;
    currentYear = currentMonth == 0 ? currentYear + 1 : currentYear;

    forecast.push({
      ...nextState.cpf,
      accruedInterest: nextState.accruedInterest,
      creditedInterest: currentMonth == 0 ? accruedInterest : zeroAccount(),
      year: currentYear,
      month: currentMonth,
      age: ageThisYear
    });

    accruedInterest = nextState.accruedInterest;
  }
  return forecast;
};

const formatNumber = num =>
  num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const CpfForecastChart = ({ computedResult }) => {
  if (!computedResult) return null;
  return (
    <>
      <div className="row my-4">
        <div className="col text-center">
          <h3>CPF Balance Forecast:</h3>
        </div>
      </div>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <AreaChart
            data={computedResult}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 40
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" />
            <YAxis />
            <Tooltip formatter={formatNumber} />
            <Area
              name="Ordinary"
              type="monotone"
              dataKey="oa"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              name="Special"
              type="monotone"
              dataKey="sa"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
            <Area
              name="Medical"
              type="monotone"
              dataKey="ma"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
            />
            <Area
              name="Total"
              type="monotone"
              dataKey="total"
              stackId="2"
              strokeOpacity={0}
              fillOpacity={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

const CpfSummary = ({ computedResult }) => {
  if (!computedResult) return null;
  const finalAmount = computedResult[computedResult.length - 1];
  return (
    <>
      <div className="row my-4">
        <div className="col text-center">
          <h3>Balances at age 55:</h3>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-md-3">
          <div
            className="p-2"
            style={{ backgroundColor: "rgba(136, 132, 216, 0.9)" }}
          >
            <h5>OA</h5>
          </div>
          <div
            className="p-3"
            style={{ backgroundColor: "rgba(136, 132, 216, 0.7)" }}
          >
            <h4>{formatNumber(finalAmount.oa)}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="p-2"
            style={{ backgroundColor: "rgba(130, 202, 157, 0.9)" }}
          >
            <h5>SA</h5>
          </div>
          <div
            className="p-3"
            style={{ backgroundColor: "rgba(130, 202, 157, 0.7)" }}
          >
            <h4>{formatNumber(finalAmount.sa)}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="p-2"
            style={{ backgroundColor: "rgba(255, 198, 88, 0.9)" }}
          >
            <h5>MA</h5>
          </div>
          <div
            className="p-3"
            style={{ backgroundColor: "rgba(255, 198, 88, 0.7)" }}
          >
            <h4>{formatNumber(finalAmount.ma)}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="p-2"
            style={{ backgroundColor: "rgba(52, 73, 94, 0.5)" }}
          >
            <h5>Total</h5>
          </div>
          <div
            className="p-3"
            style={{ backgroundColor: "rgba(52, 73, 94, 0.3)" }}
          >
            <h4>{formatNumber(finalAmount.total)}</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export const CpfCalculator = () => {
  const [birthYear, setBirthYear] = useState("1990");
  const [stopWorkAge, setStopWorkAge] = useState("40");
  const [salary, setSalary] = useState("3000");
  const [oa, setOa] = useState("0");
  const [ma, setMa] = useState("0");
  const [sa, setSa] = useState("0");
  const [ra, setRa] = useState("0");

  const [topUp, setTopUp] = useState("0");
  const [transfer, setTransfer] = useState("0");

  const [computedResult, setComputedResult] = useState();

  const calculate = () => {
    const result = computeCpf({
      current: {
        oa: Number(oa),
        ma: Number(ma),
        sa: Number(sa),
        ra: Number(ra)
      },
      salary: Number(salary),
      stopWorkAge: Number(stopWorkAge),
      birthYear: Number(birthYear),
      topUp: Number(topUp),
      transfer: Number(transfer)
    })
      .filter(item => item.month == 0)
      .map(cpf => ({ ...cpf, total: cpf.oa + cpf.ma + cpf.ra + cpf.sa }));
    setComputedResult(result);
  };

  return (
    <div>
      <div>
        <div>Year Born</div>
        <div>
          <input
            onChange={e => setBirthYear(e.target.value)}
            value={birthYear}
          ></input>
        </div>
      </div>

      <div>
        <div>Salary</div>
        <div>
          <input
            onChange={e => setSalary(e.target.value)}
            value={salary}
          ></input>
        </div>
      </div>

      <div>
        <div>CPF OA</div>
        <div>
          <input onChange={e => setOa(e.target.value)} value={oa}></input>
        </div>
      </div>

      <div>
        <div>CPF SA</div>
        <div>
          <input onChange={e => setSa(e.target.value)} value={sa}></input>
        </div>
      </div>

      <div>
        <div>CPF MA</div>
        <div>
          <input onChange={e => setMa(e.target.value)} value={ma}></input>
        </div>
      </div>

      <div>
        <div>Age to stop working</div>
        <div>
          <input
            onChange={e => setStopWorkAge(e.target.value)}
            value={stopWorkAge}
          ></input>
        </div>
      </div>

      <div>
        <div>CPF SA Top Up in Jan</div>
        <div>
          <input onChange={e => setTopUp(e.target.value)} value={topUp}></input>
        </div>
      </div>

      <div>
        <div>CPA Transfer from OA to SA in Jan</div>
        <div>
          <input
            onChange={e => setTransfer(e.target.value)}
            value={transfer}
          ></input>
        </div>
      </div>

      <div>
        <button onClick={calculate}>Calculate</button>
      </div>

      <CpfForecastChart computedResult={computedResult} />
      <CpfSummary computedResult={computedResult} />
    </div>
  );
};
