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

const CPF_CONTRIBUTION_CEILING = 102000;

export const zeroAccount = () => ({
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

export const uncappedSalaryContribution = (eligibleSalary, age) => {
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

export const salaryContribution = (salary, age = 0) => {
  const eligibleSalary = Math.min(6000, salary);
  return uncappedSalaryContribution(eligibleSalary, age);
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
  transfer,
  bonusByMonths,
  salaryInflationPerYear
}) => {
  let cpf = current;
  let currentAccruedInterest = accruedInterest;
  const currentAge = year - birthYear;
  const currentFrs = getFrs(year);

  // Credit all bonus in December.
  // If this is a variable, we have to consider the limit to be exercised throughout the year.
  const bonusCreditMonth = 11;

  // Currently december, credit interest in the following month and zero accrued interest
  if (month === 11) {
    cpf = sumAccount(cpf, currentAccruedInterest);
    currentAccruedInterest = zeroAccount();
  }

  if (month === 0 && cpf.sa < currentFrs) {
    // Credit cpf SA top up in Jan
    if (topUp) {
      let availableTopUpBudget = currentFrs - cpf.sa;
      const actualAmount = Math.min(availableTopUpBudget, topUp);
      cpf.sa += actualAmount;
      availableTopUpBudget -= actualAmount;
    }

    // Transfer cpf OA to SA in Jan
    if (transfer) {
      const availableTopUpBudget = currentFrs - cpf.sa;
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

  // Credit additional wages in december
  if (month === bonusCreditMonth) {
    const bonus = bonusByMonths * salary;
    const bonusCeiling = Math.max(CPF_CONTRIBUTION_CEILING - 12 * salary, 0);
    const contributionByBonus = Math.min(bonus, bonusCeiling);
    const bonusContribution = uncappedSalaryContribution(
      contributionByBonus,
      currentAge
    );
    cpf = sumAccount(cpf, bonusContribution);
  }

  // Add accrued interest
  const additionalInterest = calculateAccruedInterest(cpf, currentAge);
  currentAccruedInterest = sumAccount(
    currentAccruedInterest,
    additionalInterest
  );

  // Salary inflation
  const nextSalary =
    month === 11 ? (salaryInflationPerYear / 100 + 1) * salary : salary;

  return {
    cpf,
    age: currentAge,
    accruedInterest: currentAccruedInterest,
    salary: nextSalary,
    currentFrs
  };
};

export const computeCpf = ({
  current,
  salary,
  topUp = 0,
  transfer = 0,
  stopWorkAge = 0,
  bonusByMonths = 0,
  salaryInflationPerYear = 0,
  birthYear
}) => {
  const forecast = [];
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth(); // Starts with 0
  let ageThisYear = currentYear - birthYear;
  let accruedInterest = zeroAccount();
  let currentSalary = salary;

  forecast.push({
    ...current,
    year: currentYear,
    month: currentMonth,
    age: ageThisYear,
    accruedInterest: zeroAccount(),
    creditedInterest: zeroAccount(),
    currentFrs: getFrs(currentYear),
    salary
  });

  while (ageThisYear <= 55) {
    const lastBalance = forecast[forecast.length - 1];
    ageThisYear = currentYear - birthYear;

    const nextState = nextMonth({
      current: lastBalance,
      birthYear,
      year: currentYear,
      month: currentMonth,
      salary: currentSalary,
      accruedInterest,
      topUp,
      transfer,
      stopWorkAge,
      bonusByMonths,
      salaryInflationPerYear
    });

    currentMonth = (currentMonth + 1) % 12;
    currentYear = currentMonth == 0 ? currentYear + 1 : currentYear;

    forecast.push({
      ...nextState.cpf,
      currentFrs: nextState.currentFrs,
      salary: nextState.salary,
      age: nextState.age,
      accruedInterest: nextState.accruedInterest,
      creditedInterest: currentMonth == 0 ? accruedInterest : zeroAccount(),
      year: currentYear,
      month: currentMonth
    });

    accruedInterest = nextState.accruedInterest;
    currentSalary = nextState.salary;
  }
  return forecast;
};

const formatNumber = num =>
  isNaN(num) ? "NA" : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const InfoTooltip = ({ children }) => (
  <i
    data-toggle="tooltip"
    data-placement="top"
    data-html="true"
    title={children}
    className="fas fa-info-circle"
  ></i>
);

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

export const frsColor = (sum, frs) => {
  switch (true) {
    case sum >= 1.5 * frs:
      return "rgba(130, 202, 157, 0.9)";
    case sum >= frs:
      return "rgba(130, 202, 157, 0.5)";
    case sum >= 0.5 * frs:
      return "rgba(130, 202, 157, 0.3)";
    default:
      return "rgba(130, 202, 157, 0)";
  }
};

export const CpfTable = ({ computedResult }) => {
  if (!computedResult) return null;
  const brsAge = computedResult.find(
    val => val.oa + val.sa >= val.currentFrs * 0.5
  );
  const frsAge = computedResult.find(val => val.oa + val.sa >= val.currentFrs);
  const ersAge = computedResult.find(
    val => val.oa + val.sa >= val.currentFrs * 1.5
  );
  return (
    <>
      <div className="row my-4">
        <div className="col text-center">
          <h3>Key OA + SA Milestones:</h3>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-md-4">
          <div
            className="p-2"
            style={{ backgroundColor: "rgba(130, 202, 157, 0.4)" }}
          >
            <h5>
              Age Achieving BRS{" "}
              <InfoTooltip>
                Based on estimated 0.5 * FRS inflated at 3% per year.
              </InfoTooltip>
            </h5>
          </div>
          <div
            className="p-3"
            style={{ backgroundColor: "rgba(130, 202, 157, 0.3)" }}
          >
            <h4>{brsAge ? brsAge.age : "Not Achieved Before 55"}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="p-2"
            style={{ backgroundColor: "rgba(130, 202, 157, 0.6)" }}
          >
            <h5>
              Age Achieving FRS{" "}
              <InfoTooltip>
                Based on estimated FRS inflated at 3% per year.
              </InfoTooltip>
            </h5>
          </div>
          <div
            className="p-3"
            style={{ backgroundColor: "rgba(130, 202, 157, 0.5)" }}
          >
            <h4>{frsAge ? frsAge.age : "Not Achieved Before 55"}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="p-2"
            style={{ backgroundColor: "rgba(130, 202, 157, 1)" }}
          >
            <h5>
              Age Achieving ERS{" "}
              <InfoTooltip>
                Based on estimated 1.5 * FRS inflated at 3% per year.
              </InfoTooltip>
            </h5>
          </div>
          <div
            className="p-3"
            style={{ backgroundColor: "rgba(130, 202, 157, 0.9)" }}
          >
            <h4>{ersAge ? ersAge.age : "Not Achieved Before 55"}</h4>
          </div>
        </div>
      </div>
      <div className="d-none d-md-block">
        <div className="row my-4">
          <div className="col text-center">
            <h3>Balances At Year Ends:</h3>
          </div>
        </div>
        <table className="text-center">
          <thead>
            <tr className="bg-dark text-white">
              <th className="py-2">Age</th>
              <th className="py-2">Salary</th>
              <th className="py-2">OA</th>
              <th className="py-2">SA</th>
              <th className="py-2">MA</th>
              <th className="py-2">Total</th>
              <th className="py-2">
                Interest{" "}
                <InfoTooltip>
                  Number shown has already been credited into the individual
                  accounts. Value is shown to showcase the effect of compounding
                  interest rates on the balances.
                </InfoTooltip>
              </th>
              <th className="py-2">
                FRS{" "}
                <InfoTooltip>
                  Estimated based on 3% increment per year
                </InfoTooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {computedResult.map((cpf, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: frsColor(cpf.oa + cpf.sa, cpf.currentFrs)
                }}
              >
                <td>{cpf.age}</td>
                <td>{formatNumber(cpf.salary)}</td>
                <td>{formatNumber(cpf.oa)}</td>
                <td>{formatNumber(cpf.sa)}</td>
                <td>{formatNumber(cpf.ma)}</td>
                <td>{formatNumber(cpf.total)}</td>
                <td>
                  {computedResult[index + 1]
                    ? formatNumber(
                        computedResult[index + 1].creditedInterest.oa +
                          computedResult[index + 1].creditedInterest.sa +
                          computedResult[index + 1].creditedInterest.ma
                      )
                    : "-NIL-"}
                </td>
                <td>{formatNumber(cpf.currentFrs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const Disclaimer = ({ show, toggle }) => {
  return (
    <>
      <h6 className="mt-4">
        Calculator Disclaimers{" "}
        <div className="d-inline text-light pointer" onClick={toggle}>
          ({show ? "hide" : "show"})
        </div>
      </h6>
      {show && (
        <div>
          <p>
            This CPF calculator is not endorsed by CPF or any other entities and
            is created only for educational and financial planning purposes.
          </p>
          <p>
            The product is not intended as financial advice or as an offer or
            recommendation of securities or other financial products.
          </p>
          <p>
            While attempts has been made to reflect the forecast correctly
            according to the parameters the calculator may fail to forecast the
            actual amount accurately for multiple reasons.
          </p>
          <p>In addition, there are few assumptions made:</p>
          <ul>
            <li>CPF SA top up and transfers are made only in January.</li>
            <li>Bonus for the year is credited only in December.</li>
            <li>CPF FRS will inflate at a constant rate of 3% per year.</li>
          </ul>
          <p>Finally, there are few known limitations to the product:</p>
          <ul>
            <li>
              Simplified calculation of age by using birth year instead of full
              birth date
            </li>
            <li>Missing accrued interest for months prior to current month</li>
          </ul>
          <p>
            If you noticed any inaccuracies or errors, please{" "}
            <a href="/contact">contact me</a>.
          </p>
        </div>
      )}
    </>
  );
};

export const CpfCalculator = () => {
  const [birthYear, setBirthYear] = useState("1990");
  const [stopWorkAge, setStopWorkAge] = useState("55");
  const [salary, setSalary] = useState("3000");
  const [oa, setOa] = useState("23000");
  const [sa, setSa] = useState("6000");
  const [ma, setMa] = useState("8000");
  const [salaryInflationPerYear, setSalaryInflationPerYear] = useState("2.5");
  const [bonusByMonths, setBonusByMonths] = useState("1");
  const [showAdvanceSettings, setShowAdvanceSettings] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const [topUp, setTopUp] = useState("0");
  const [transfer, setTransfer] = useState("0");

  const [computedResult, setComputedResult] = useState();

  const toggleAdvancesSettings = () =>
    setShowAdvanceSettings(!showAdvanceSettings);
  const toggleShowDisclaimer = () => {
    setShowDisclaimer(!showDisclaimer);
  };

  const calculate = () => {
    const result = computeCpf({
      current: {
        oa: Number(oa),
        ma: Number(ma),
        sa: Number(sa),
        ra: 0
      },
      salary: Number(salary),
      stopWorkAge: Number(stopWorkAge),
      birthYear: Number(birthYear),
      topUp: Number(topUp),
      transfer: Number(transfer),
      bonusByMonths: Number(bonusByMonths),
      salaryInflationPerYear: Number(salaryInflationPerYear)
    })
      .filter(item => item.month == 0)
      .map(cpf => ({ ...cpf, total: cpf.oa + cpf.ma + cpf.ra + cpf.sa }));
    setComputedResult(result);
  };

  return (
    <div className="my-4">
      <h4>Basic Information</h4>
      <div className="row text-center">
        <div className="col-md-4 my-2">
          <div
            className="p-2"
            style={{ backgroundColor: "rgba(52, 73, 94, 0.5)" }}
          >
            <h5>
              Year of Birth <InfoTooltip>For calculating age</InfoTooltip>
            </h5>
          </div>
          <div
            style={{ backgroundColor: "rgba(52, 73, 94, 0.3)" }}
            className="py-3"
          >
            <input
              className="no-outline-focus text-center"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                borderWidth: "0 0 2px 0",
                borderColor: "black",
                fontSize: "1.2em"
              }}
              onChange={e => setBirthYear(e.target.value)}
              value={birthYear}
            ></input>
          </div>
        </div>
        <div className="col-md-4 my-2">
          <div
            className="p-2"
            style={{ backgroundColor: "rgba(52, 73, 94, 0.5)" }}
          >
            <h5>
              Current Salary{" "}
              <InfoTooltip>Gross wage without bonuses.</InfoTooltip>
            </h5>
          </div>
          <div
            style={{ backgroundColor: "rgba(52, 73, 94, 0.3)" }}
            className="py-3"
          >
            <input
              className="no-outline-focus text-center"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                borderWidth: "0 0 2px 0",
                borderColor: "black",
                fontSize: "1.2em"
              }}
              onChange={e => setSalary(e.target.value)}
              value={salary}
            ></input>
          </div>
        </div>
        <div className="col-md-4 my-2">
          <div
            className="p-2"
            style={{ backgroundColor: "rgba(52, 73, 94, 0.5)" }}
          >
            <h5>
              Intended Retirement Age{" "}
              <InfoTooltip>
                At this age, you will be having no salary contribution.
              </InfoTooltip>
            </h5>
          </div>
          <div
            style={{ backgroundColor: "rgba(52, 73, 94, 0.3)" }}
            className="py-3"
          >
            <input
              className="no-outline-focus text-center"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                borderWidth: "0 0 2px 0",
                borderColor: "black",
                fontSize: "1.2em"
              }}
              onChange={e => setStopWorkAge(e.target.value)}
              value={stopWorkAge}
            ></input>
          </div>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-md-4 my-2">
          <div
            className="p-2"
            style={{ backgroundColor: "rgba(136, 132, 216, 0.9)" }}
          >
            <h5>Current OA Balance</h5>
          </div>
          <div
            style={{ backgroundColor: "rgba(136, 132, 216, 0.7)" }}
            className="py-3"
          >
            <input
              className="no-outline-focus text-center"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                borderWidth: "0 0 2px 0",
                borderColor: "black",
                fontSize: "1.2em"
              }}
              onChange={e => setOa(e.target.value)}
              value={oa}
            ></input>
          </div>
        </div>
        <div className="col-md-4 my-2">
          <div
            className="p-2"
            style={{ backgroundColor: "rgba(130, 202, 157, 0.9)" }}
          >
            <h5>Current SA Balance</h5>
          </div>
          <div
            style={{ backgroundColor: "rgba(130, 202, 157, 0.7)" }}
            className="py-3"
          >
            <input
              className="no-outline-focus text-center"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                borderWidth: "0 0 2px 0",
                borderColor: "black",
                fontSize: "1.2em"
              }}
              onChange={e => setSa(e.target.value)}
              value={sa}
            ></input>
          </div>
        </div>
        <div className="col-md-4 my-2">
          <div
            className="p-2"
            style={{ backgroundColor: "rgba(255, 198, 88, 0.9)" }}
          >
            <h5>Current MA Balance</h5>
          </div>
          <div
            style={{ backgroundColor: "rgba(255, 198, 88, 0.7)" }}
            className="py-3"
          >
            <input
              className="no-outline-focus text-center"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                borderWidth: "0 0 2px 0",
                borderColor: "black",
                fontSize: "1.2em"
              }}
              onChange={e => setMa(e.target.value)}
              value={ma}
            ></input>
          </div>
        </div>
      </div>

      <h4 className="mt-4">
        Additional Information{" "}
        <div
          onClick={toggleAdvancesSettings}
          className="d-inline text-light pointer"
        >
          ({showAdvanceSettings ? "hide" : "show"})
        </div>
      </h4>

      {showAdvanceSettings && (
        <div className="row text-center">
          <div className="col-md-4 my-2">
            <div
              className="p-2"
              style={{ backgroundColor: "rgba(52, 73, 94, 0.5)" }}
            >
              <h5>
                Bonus (months){" "}
                <InfoTooltip>
                  Bonus will be credited in December. Generally includes
                  performance, 13th month and corporate bonus.
                </InfoTooltip>
              </h5>
            </div>
            <div
              style={{ backgroundColor: "rgba(52, 73, 94, 0.3)" }}
              className="py-3"
            >
              <input
                className="no-outline-focus text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  fontSize: "1.2em"
                }}
                onChange={e => setBonusByMonths(e.target.value)}
                value={bonusByMonths}
              ></input>
            </div>
          </div>
          <div className="col-md-4 my-2">
            <div
              className="p-2"
              style={{ backgroundColor: "rgba(52, 73, 94, 0.5)" }}
            >
              <h5>
                Annual Salary Increment (%){" "}
                <InfoTooltip>
                  Estimated salary increment. Salary will be incremented in
                  January each year.
                </InfoTooltip>
              </h5>
            </div>
            <div
              style={{ backgroundColor: "rgba(52, 73, 94, 0.3)" }}
              className="py-3"
            >
              <input
                className="no-outline-focus text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  fontSize: "1.2em"
                }}
                onChange={e => setSalaryInflationPerYear(e.target.value)}
                value={salaryInflationPerYear}
              ></input>
            </div>
          </div>
        </div>
      )}

      {showAdvanceSettings && (
        <div className="row text-center">
          <div className="col-md-4 my-2">
            <div
              className="p-2"
              style={{ backgroundColor: "rgba(52, 73, 94, 0.5)" }}
            >
              <h5>
                SA Cash Top Up{" "}
                <InfoTooltip>
                  CPF top up to SA account is assumed to be performed in January
                  each year
                </InfoTooltip>
              </h5>
            </div>
            <div
              style={{ backgroundColor: "rgba(52, 73, 94, 0.3)" }}
              className="py-3"
            >
              <input
                className="no-outline-focus text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  fontSize: "1.2em"
                }}
                onChange={e => setTopUp(e.target.value)}
                value={topUp}
              ></input>
            </div>
          </div>
          <div className="col-md-4 my-2">
            <div
              className="p-2"
              style={{ backgroundColor: "rgba(52, 73, 94, 0.5)" }}
            >
              <h5>
                OA to SA Transfer{" "}
                <InfoTooltip>
                  Transfer from CPF OA to SA account is assumed to be performed
                  in January each year
                </InfoTooltip>
              </h5>
            </div>
            <div
              style={{ backgroundColor: "rgba(52, 73, 94, 0.3)" }}
              className="py-3"
            >
              <input
                className="no-outline-focus text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  fontSize: "1.2em"
                }}
                onChange={e => setTransfer(e.target.value)}
                value={transfer}
              ></input>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button className="btn-block btn-dark p-3" onClick={calculate}>
          Calculate
        </button>
      </div>

      <CpfSummary computedResult={computedResult} />
      <CpfForecastChart computedResult={computedResult} />
      <CpfTable computedResult={computedResult} />

      {computedResult && (
        <div className="my-3">
          <h4>Opt-in Financial Status Insights</h4>
          <p>
            Would you like to know more about how well you perform amongst your
            peers financially?
          </p>
          <p>
            Fill in the survey below to partake in an anonymous salary and
            financial status survey to be the first to receive a summarized
            report once sufficient data has been received.
          </p>
          <p>
            The goal of the survey is to provide you with anonymous information
            of peers in your industry to allow you to make better decisions with
            regards to your employment (and salary negotiation).
          </p>
          <p>
            The button below links to a pre-filled google form which you may
            amend the data before submitting.
          </p>
          <a
            target="_blank"
            href={`https://docs.google.com/forms/d/e/1FAIpQLSdTmZw7nvZ0P62fWfeAYzPNTEAaTWp-MqWjorq366z2ob0Z1w/viewform?usp=pp_url&entry.2046795091=${birthYear}&entry.8961092=${salary}&entry.1628574712=${stopWorkAge}&entry.1364818236=${oa}&entry.291718066=${sa}&entry.209991329=${ma}&entry.1407674642=${bonusByMonths}&entry.2123969228=${salaryInflationPerYear}`}
          >
            <div className="btn btn-dark">Go to survey</div>
          </a>
        </div>
      )}

      {computedResult && (
        <Disclaimer show={showDisclaimer} toggle={toggleShowDisclaimer} />
      )}

      <hr />
    </div>
  );
};
