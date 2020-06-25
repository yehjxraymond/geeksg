import React, { useState } from "react";
import { groth as snarkJs } from "snarkjs";
import deepMap from "deep-map";

import verificationKey from "./verification_key.json";

const bigIntMapper = (val) => {
  if (typeof val === "string" && /^\d+$/.test(val)) {
    return BigInt(val);
  } else {
    return val;
  }
};
const bigInt = (obj) => deepMap(obj, bigIntMapper);

const sampleProof = {
  pi_a: [
    "4443085374655181924122479655921421583260394909381342657008900704177847166364",
    "16637105873193059852532598284125196146626946621478643547911842935234244307526",
    "1",
  ],
  pi_b: [
    [
      "12672911778120161155788739741697071429057149515408646709085993715370651046220",
      "21030896523735877042877524172273514613104540280062550800317631805961238542440",
    ],
    [
      "21424728878517479027195276080492871087760262388154182099701127354844389591972",
      "14913488319816586975844648185742179262639578640932648959869026578803566421431",
    ],
    ["1", "0"],
  ],
  pi_c: [
    "21819093038308445564158536784620558351875529068440613635968660411231676479248",
    "20497094117467789903098164940264624366722755254050336673524237706881382591035",
    "1",
  ],
  protocol: "groth",
};

const samplePublicSignals = [
  "1",
  "20687928115026053699926515049138692070100647654038300385721779911896219193902",
  "11072087695851230221153980887306278529192602579917930578016623940159289561376",
  "2020",
  "21",
];

export const ZkpDemo = () => {
  const [proof, setProof] = useState(JSON.stringify(sampleProof));
  const [hash1, setHash1] = useState(samplePublicSignals[1]);
  const [hash2, setHash2] = useState(samplePublicSignals[2]);
  const [currentYear, setCurrentYear] = useState(samplePublicSignals[3]);
  const [legalAge, setLegalAge] = useState(samplePublicSignals[4]);
  const [isProved, setIsProved] = useState(false);
  const [verificationKeyString, setVerificationKeyString] = useState(
    JSON.stringify(verificationKey)
  );
  const [showVerificationKey, setShowVerificationKey] = useState(false);

  const handleProve = () => {
    const publicSignal = [1, hash1, hash2, currentYear, legalAge];
    const isValid = snarkJs.isValid(
      bigInt(JSON.parse(verificationKeyString)),
      bigInt(JSON.parse(proof)),
      publicSignal
    );
    setIsProved(isValid);
  };

  return (
    <>
      <div></div>
      <h2>Public Inputs</h2>
      <div className="bg-white p-2 m-2">
        <label>Hash (part 1)</label>
        <input
          className="w-100"
          value={hash1}
          onChange={(e) => setHash1(e.target.value)}
        />
      </div>
      <div className="bg-white p-2 m-2">
        <label>Hash (part 2)</label>
        <input
          className="w-100"
          value={hash2}
          onChange={(e) => setHash2(e.target.value)}
        />
      </div>
      <div className="bg-white p-2 m-2">
        <label>Current Year</label>
        <input
          className="w-100"
          value={currentYear}
          onChange={(e) => setCurrentYear(e.target.value)}
        />
      </div>
      <div className="bg-white p-2 m-2">
        <label>Current Year</label>
        <input
          className="w-100"
          value={legalAge}
          onChange={(e) => setLegalAge(e.target.value)}
        />
      </div>

      <h2>Proof</h2>
      <div className="bg-white p-2 m-2">
        <textarea
          className="w-100"
          rows="15"
          value={proof}
          onChange={(e) => setProof(e.target.value)}
        />
      </div>

      <h2>Verification</h2>
      <div className="p-2 m-2">
        <div>
          Is Above {legalAge}: {JSON.stringify(isProved)}
        </div>
        <button onClick={handleProve}>Check Age</button>
      </div>

      <small onClick={() => setShowVerificationKey(!showVerificationKey)}>
        Verification Key
      </small>
      {showVerificationKey && (
        <div>
          <textarea
            className="w-100"
            rows="15"
            value={verificationKeyString}
            onChange={(e) => setVerificationKeyString(e.target.value)}
          />
        </div>
      )}
    </>
  );
};
