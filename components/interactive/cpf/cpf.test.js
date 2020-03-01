import { computeCpf, calculateAccruedInterest, getFrs } from "./index";

describe("getFrs", () => {
  it("should be correct for years defined", () => {
    expect(getFrs(2022)).toBe(192000);
  });

  it("should be correct for estimates", () => {
    expect(getFrs(2023)).toBe(197760);
    expect(getFrs(2024)).toBe(203692.8);
  });
});

// it("works", () => {
//   console.log(
//     calculateAccruedInterest({
//       oa: 10000,
//       sa: 10000,
//       ma: 10000,
//       ra: 0
//     })
//   );
// });

// it("works", () => {
//   const current = {
//     oa: 45761.54,
//     sa: 38685.89,
//     ma: 28588.76,
//     ra: 0
//   };
//   const birthYear = 1992;
//   const year = 2020;
//   const month = 2; // Mar
//   const salary = 6700;
//   const accruedInterest = {
//     oa: 0,
//     sa: 0,
//     ma: 0,
//     ra: 0
//   };

//   console.log(
//     nextMonth({
//       current,
//       birthYear,
//       year,
//       month,
//       salary,
//       accruedInterest
//     })
//   );
// });

// it("works", () => {
//   console.log(salaryContribution(6700, 28));
// });

// it("works", () => {
//   const current = {
//     oa: 45761.54,
//     sa: 38685.89,
//     ma: 28588.76,
//     ra: 0
//   };
//   const salary = 6700;
//   const birthYear = 1992;
//   const results = computeCpf({ current, salary, birthYear });
//   console.log(results);
// });

/*
References

Calculation
- Current balance
- Contribution (from salary)
- Contribution (volunteer top-up or transfer)
- Interest

*RA is created at age 55, savings up to FRS is transferred. May opt in to ERS

Base interest
OA - 2.5%
SA - 4%
MA - 4%
RA - 4%

Additional interest (60k) - 1%
RA
OA - up to $20k
SA
MA

Additional interest (30k) - 1%




https://www.ifa.sg/cpf-interest/
*/
