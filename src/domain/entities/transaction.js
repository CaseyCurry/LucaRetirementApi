// TODO: unit test
const Transaction = class {
  constructor({ date, amount }) {
    if (!date) {
      try {
        date = new Date(date);
      } catch (error) {
        throw new Error("The date must have a value and must be a date");
      }
    }
    if (!amount || typeof amount !== "number") {
      throw new Error("The amount must have a value and must be a number");
    }
    this.date = date;
    this.amount = amount;
  }
};

export { Transaction };
