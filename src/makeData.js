import mortgageJs from "mortgage-js";

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const newPerson = (step) => {
  const total = 500000 + 10000 * step;
  let mortgageCalculator = mortgageJs.createMortgageCalculator();
  mortgageCalculator.totalPrice = total;
  mortgageCalculator.downPayment = total * 0.2;
  mortgageCalculator.interestRate = 0.0128;
  mortgageCalculator.months = 360;
  mortgageCalculator.taxRate = 0;
  mortgageCalculator.insuranceRate = 0.0013;
  mortgageCalculator.mortgageInsuranceRate = 0;
  mortgageCalculator.mortgageInsuranceEnabled = false;
  mortgageCalculator.mortgageInsuranceThreshold = 0.1;
  mortgageCalculator.additionalPrincipalPayment = 0;
  let payment = mortgageCalculator.calculatePayment();
  console.log(payment);
  return {
    price: formatter.format(total),
    down: formatter.format(mortgageCalculator.downPayment),
    mortgage: 1
  };
};

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newPerson(d)
      };
    });
  };

  return makeDataLevel();
}
