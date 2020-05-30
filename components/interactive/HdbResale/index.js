import React, { useState } from "react";
import MLR from "ml-regression-multivariate-linear";
import axios from "axios";
import sample from "./sample.json";

const estimateLevel = (range) => {
  const [first, second] = range.split(" to ");
  return (Number(first) + Number(second)) / 2;
};

export const PastTransaction = ({ resaleData }) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = () => setCollapsed(!collapsed);
  const { lastTransactions } = resaleData;
  return (
    <div>
      <h3>
        Past Transactions
        <div className="d-inline small pointer" onClick={toggleCollapsed}>
          {collapsed ? " (show)" : " (hide)"}
        </div>
      </h3>
      {!collapsed && (
        <table className="text-center">
          <thead>
            <tr className="bg-dark text-white">
              <th className="py-2">Flat Type</th>
              <th className="py-2">Level</th>
              <th className="py-2">Floor Area (sqm)</th>
              <th className="py-2">Price</th>
              <th className="py-2">Transaction Date</th>
            </tr>
          </thead>
          <tbody>
            {lastTransactions.map((txn, key) => (
              <tr key={key}>
                <td>{txn.flatType}</td>
                <td>{txn.levelRange}</td>
                <td>{txn.floorArea}</td>
                <td>${txn.price.toLocaleString()}</td>
                <td>{txn.registrationDate}</td>
              </tr>
            ))}
            {(!lastTransactions || lastTransactions.length === 0) && (
              <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export const NearbyPastTransactions = ({ resaleData }) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  const { nearbyTransactions } = resaleData;
  return (
    <div>
      <h3>
        Nearby Past Transactions
        <div className="d-inline small pointer" onClick={toggleCollapsed}>
          {collapsed ? " (show)" : " (hide)"}
        </div>
      </h3>
      {!collapsed && (
        <table className="text-center">
          <thead>
            <tr className="bg-dark text-white">
              <th className="py-2">Block</th>
              <th className="py-2">Flat Type</th>
              <th className="py-2">Level</th>
              <th className="py-2">Floor Area (sqm)</th>
              <th className="py-2">Lease</th>
              <th className="py-2">Price</th>
              <th className="py-2">Transaction Date</th>
            </tr>
          </thead>
          <tbody>
            {nearbyTransactions.map((txn, key) => (
              <tr key={key}>
                <td>{txn.block}</td>
                <td>
                  {txn.flatType} ({txn.modelDescription})
                </td>
                <td>{txn.levelRange}</td>
                <td>{txn.floorArea}</td>
                <td>{txn.leaseCommencementDate}</td>
                <td>${txn.price.toLocaleString()}</td>
                <td>{txn.registrationDate}</td>
              </tr>
            ))}
            {(!nearbyTransactions || nearbyTransactions.length === 0) && (
              <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export const PastRentalRate = ({ resaleData }) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = () => setCollapsed(!collapsed);
  const { rentalRates } = resaleData;
  return (
    <div>
      <h3>
        Rental Rates
        <div className="d-inline small pointer" onClick={toggleCollapsed}>
          {collapsed ? " (show)" : " (hide)"}
        </div>
      </h3>
      {!collapsed && (
        <table className="text-center">
          <thead>
            <tr className="bg-dark text-white">
              <th className="py-2">Flat Type</th>
              <th className="py-2">Agreement Date</th>
              <th className="py-2">Rent</th>
            </tr>
          </thead>
          <tbody>
            {rentalRates.map((txn, key) => (
              <tr key={key}>
                <td>{txn.flatType}</td>
                <td>
                  {txn.month} {txn.year}
                </td>
                <td>${txn.rent.toLocaleString()}</td>
              </tr>
            ))}
            {(!rentalRates || rentalRates.length === 0) && (
              <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const InputField = ({
  title,
  tooltip,
  rgb = "136, 132, 216",
  value,
  onChange,
  col = "6",
}) => {
  return (
    <div className={`col-md-${col} my-2 text-center`}>
      <div className="p-2" style={{ backgroundColor: `rgba(${rgb}, 0.5)` }}>
        <h5>
          {title} {tooltip && <InfoTooltip>{tooltip}</InfoTooltip>}
        </h5>
      </div>
      <div style={{ backgroundColor: `rgba(${rgb}, 0.3)` }} className="py-3">
        <input
          className="no-outline-focus text-center"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            borderWidth: "0 0 2px 0",
            borderColor: "black",
            fontSize: "1.2em",
          }}
          onChange={(e) => onChange(e.target.value)}
          value={value}
        ></input>
      </div>
    </div>
  );
};

const ValueField = ({ title, value }) => {
  return (
    <div className="col text-center">
      <div
        className="p-2"
        style={{ backgroundColor: "rgba(130, 202, 157, 0.9)" }}
      >
        <h5>{title}</h5>
      </div>
      <div
        className="p-3"
        style={{ backgroundColor: "rgba(130, 202, 157, 0.7)" }}
      >
        <h4>{value}</h4>
      </div>
    </div>
  );
};

const TwoVariateRegression = ({ resaleData }) => {
  const leaseCommencementDate =
    resaleData.lastTransactions[0].leaseCommencementDate;
  const sampleFloorArea = resaleData.lastTransactions[0].floorArea;
  const eligibleTransactions = resaleData.nearbyTransactions.filter(
    (txn) => txn.leaseCommencementDate === leaseCommencementDate
  );
  const x = eligibleTransactions.map((txn) => [
    txn.floorArea,
    estimateLevel(txn.levelRange),
  ]);
  const y = eligibleTransactions.map((txn) => [txn.price]);
  const model = new MLR(x, y);
  const floorAreaCof = model.weights[0][0];
  const levelCof = model.weights[1][0];

  const [area, setArea] = useState(sampleFloorArea.toString());
  const [level, setLevel] = useState("1");
  const [estimate, setEstimate] = useState();
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => setShowInfo(!showInfo);

  const onEstimate = () => {
    const est = model.predict([Number(area), Number(level)])[0];
    setEstimate(est);
  };

  const onButtonClick = () => {
    if (estimate) {
      setEstimate();
    } else {
      onEstimate();
    }
  };

  return (
    <div>
      <h2>Estimate based on similar flats</h2>
      <p>
        This calculator provides an estimate based on information of nearby
        flats with the same lease commencement date.
      </p>
      <p>Simply enter the unit's level and unit size to get an estimate.</p>
      {!estimate && (
        <div className="row">
          <InputField title="Level" value={level} onChange={setLevel} />
          <InputField title="Area (sqm)" value={area} onChange={setArea} />
        </div>
      )}
      {estimate && (
        <div className="row mt-2 mb-2">
          <ValueField
            title="Estimate"
            value={`$${Math.floor(estimate).toLocaleString()}`}
          />
        </div>
      )}
      <button class="btn-block btn-dark p-3 pointer" onClick={onButtonClick}>
        {estimate ? "Try Again" : "Calculate"}
      </button>
      <div className="mt-2 pointer" onClick={toggleInfo}>
        <h6>{showInfo ? "Hide" : "Show"} More info</h6>
      </div>
      {showInfo && (
        <div>
          Based on the 2-variable linear regression model:
          <div>
            Every extra sqm cost extra{" "}
            <strong>${Math.floor(floorAreaCof).toLocaleString()}</strong>
          </div>
          <div>
            Every extra level cost extra{" "}
            <strong>${Math.floor(levelCof).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

const ThreeVariateRegression = ({ resaleData }) => {
  const sampleLeaseCommencementDate =
    resaleData.lastTransactions[0].leaseCommencementDate;
  const sampleFloorArea = resaleData.lastTransactions[0].floorArea;
  const eligibleTransactions = resaleData.nearbyTransactions;
  const x = eligibleTransactions.map((txn) => [
    txn.floorArea,
    estimateLevel(txn.levelRange),
    txn.leaseCommencementDate,
  ]);
  const y = eligibleTransactions.map((txn) => [txn.price]);
  const model = new MLR(x, y);
  const floorAreaCof = model.weights[0][0];
  const levelCof = model.weights[1][0];
  const leaseCof = model.weights[2][0];

  const [area, setArea] = useState(sampleFloorArea.toString());
  const [level, setLevel] = useState("1");
  const [leaseCommencement, setLeaseCommencement] = useState(
    sampleLeaseCommencementDate.toString()
  );
  const [estimate, setEstimate] = useState();
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => setShowInfo(!showInfo);

  const onEstimate = () => {
    const est = model.predict([
      Number(area),
      Number(level),
      Number(leaseCommencement),
    ])[0];
    setEstimate(est);
  };

  const onButtonClick = () => {
    if (estimate) {
      setEstimate();
    } else {
      onEstimate();
    }
  };
  return (
    <div>
      <h2>Estimate based on all nearby flats</h2>

      <p>
        This calculator provides an estimate based on information of all nearby
        flats. This assumes a linear depreciation of the units around the area.
      </p>
      <p>
        Simply enter the unit's level, unit size &amp; lease commencement date
        to get an estimate.
      </p>
      {!estimate && (
        <div className="row">
          <InputField title="Level" value={level} onChange={setLevel} col="4" />
          <InputField
            title="Area (sqm)"
            value={area}
            onChange={setArea}
            col="4"
          />
          <InputField
            title="Lease Commencement"
            value={leaseCommencement}
            onChange={setLeaseCommencement}
            col="4"
          />
        </div>
      )}
      {estimate && (
        <div className="row mt-2 mb-2">
          <ValueField
            title="Estimate"
            value={`$${Math.floor(estimate).toLocaleString()}`}
          />
        </div>
      )}
      <button class="btn-block btn-dark p-3 pointer" onClick={onButtonClick}>
        {estimate ? "Try Again" : "Calculate"}
      </button>
      <div className="mt-2 pointer" onClick={toggleInfo}>
        <h6>{showInfo ? "Hide" : "Show"} More info</h6>
      </div>
      {showInfo && (
        <div>
          Based on the 3-variable linear regression model:
          <div>
            Every extra sqm cost extra{" "}
            <strong>${Math.floor(floorAreaCof).toLocaleString()}</strong>
          </div>
          <div>
            Every extra level cost extra{" "}
            <strong>${Math.floor(levelCof).toLocaleString()}</strong>
          </div>
          <div>
            Every year of lease cost extra{" "}
            <strong>${Math.floor(leaseCof).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export const LinearRegressionModel = ({ resaleData }) => {
  return (
    <div>
      <TwoVariateRegression resaleData={resaleData} />
      <hr />
      <ThreeVariateRegression resaleData={resaleData} />
    </div>
  );
};

export const CalculatorContent = ({ resaleData }) => {
  return (
    <div>
      <LinearRegressionModel resaleData={resaleData} />
      <PastTransaction resaleData={resaleData} />
      <NearbyPastTransactions resaleData={resaleData} />
      <PastRentalRate resaleData={resaleData} />
    </div>
  );
};

export const HdbResaleCalculator = () => {
  const [postalCode, setPostalCode] = useState("");
  const [pendingData, setPendingData] = useState(false);
  const [resaleData, setResaleData] = useState(sample);

  const fetchData = async () => {
    if (pendingData) return;
    setPendingData(true);
    const { data } = await axios.get(
      `https://resale.geek.sg/info/${postalCode}`
    );
    setResaleData(data);
    setPendingData(false);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
      >
        <div className="row">
          <InputField
            title="Postal Code"
            value={postalCode}
            onChange={setPostalCode}
            col={12}
          />
        </div>
        <button class="btn-block btn-dark p-3 pointer" onClick={fetchData}>
          Fetch Data
        </button>
      </form>
      {resaleData && <CalculatorContent resaleData={resaleData} />}
    </div>
  );
};
