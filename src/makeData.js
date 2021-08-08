import mortgageJs from "mortgage-js";
import numeral from "numeral";

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

const newPerson = (step, m, t, r) => {
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
  var mortgage = payment.paymentSchedule[0].totalPayment;
  var tax = parseFloat(t) / 12;
  var insurance = 20;
  var rental = parseFloat(r);
  var management = parseFloat(m);
  var cost = mortgage + management + tax + insurance;
  var cost_interest =
    payment.paymentSchedule[0].interestPayment + management + tax + insurance;
  var roi = ((rental - cost_interest) * 360) / mortgageCalculator.downPayment;

  //compound annual growth rate: https://www.investopedia.com/articles/basics/10/guide-to-calculating-roi.asp
  var cagr = numeral((1 + roi) ** (1 / 30) - 1).format("0.00%");
  console.log(management, cost);
  return {
    price: formatter.format(total),
    down: formatter.format(mortgageCalculator.downPayment),
    mortgage: formatter.format(mortgage),
    management: formatter.format(management),
    tax: formatter.format(tax),
    insurance: formatter.format(insurance),
    rental: formatter.format(rental),
    cash: formatter.format(rental - cost),
    profit: formatter.format(rental - cost_interest),
    roi: cagr
  };
};

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    const m = lens[1];
    const t = lens[2];
    const r = lens[3];

    return range(len).map((d) => {
      return {
        ...newPerson(d, m, t, r)
      };
    });
  };

  return makeDataLevel();
}
