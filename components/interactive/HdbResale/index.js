import React, { useState } from "react";
import MLR from "ml-regression-multivariate-linear";
import axios from "axios";

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

  const onEstimate = () => {
    const est = model.predict([Number(area), Number(level)])[0];
    setEstimate(est);
  };

  return (
    <div>
      <div>Based on flats with same lease commencement year</div>
      <div>Every extra sqm: ${Math.floor(floorAreaCof).toLocaleString()}</div>
      <div>Every extra level: ${Math.floor(levelCof).toLocaleString()}</div>
      <div>Level:</div>
      <input value={level} onChange={(e) => setLevel(e.target.value)}></input>
      <div>Area (sqm):</div>
      <input value={area} onChange={(e) => setArea(e.target.value)}></input>
      <div>
        <button onClick={onEstimate}>Estimate</button>
      </div>
      {estimate && (
        <div>Estimated Value: ${Math.floor(estimate).toLocaleString()}</div>
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

  const onEstimate = () => {
    const est = model.predict([
      Number(area),
      Number(level),
      Number(leaseCommencement),
    ])[0];
    setEstimate(est);
  };

  return (
    <div>
      <div>Based on flats around the area</div>
      <div>Every extra sqm: ${Math.floor(floorAreaCof).toLocaleString()}</div>
      <div>Every extra level: ${Math.floor(levelCof).toLocaleString()}</div>
      <div>
        Every extra year of lease: ${Math.floor(leaseCof).toLocaleString()}
      </div>
      <div>Level:</div>
      <input value={level} onChange={(e) => setLevel(e.target.value)}></input>
      <div>Area (sqm):</div>
      <input value={area} onChange={(e) => setArea(e.target.value)}></input>
      <div>Lease Commencement Date:</div>
      <input
        value={leaseCommencement}
        onChange={(e) => setLeaseCommencement(e.target.value)}
      ></input>
      <div>
        <button onClick={onEstimate}>Estimate</button>
      </div>
      {estimate && (
        <div>Estimated Value: ${Math.floor(estimate).toLocaleString()}</div>
      )}
    </div>
  );
};

export const LinearRegressionModel = ({ resaleData }) => {
  return (
    <div>
      <h2>Two-Variable Regression Model</h2>
      <TwoVariateRegression resaleData={resaleData} />
      <hr />
      <h2>Three-Variable Regression Model</h2>
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
  const [resaleData, setResaleData] = useState();

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
        <input
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        ></input>
        <button onClick={fetchData}>Fetch Data</button>
      </form>
      {resaleData && <CalculatorContent resaleData={resaleData} />}
    </div>
  );
};
