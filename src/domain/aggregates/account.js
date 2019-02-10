import { Transaction } from "../entities/transaction";

const Account = class {
  constructor({
    _rev,
    id,
    tenantId,
    brokerage,
    name,
    vestedPercentage,
    vestedContributions,
    companyContributions,
    withdrawals
  }) {
    // TODO: unit test
    if (!id || typeof id !== "string") {
      throw new Error("The id must have a value and must be a string");
    }
    if (!tenantId || typeof tenantId !== "string") {
      throw new Error("The tenantId must have a value and must be a string");
    }
    if (!brokerage || typeof brokerage !== "string") {
      throw new Error("The brokerage must have a value and must be a string");
    }
    if (!name || typeof name !== "string") {
      throw new Error("The name must have a value and must be a string");
    }
    if (!vestedPercentage || typeof vestedPercentage !== "number") {
      throw new Error(
        "The vestedPercentage must have a value and must be a number"
      );
    }
    if (!vestedContributions || !Array.isArray(vestedContributions)) {
      throw new Error("The vestedContributions must be an array");
    }
    if (!companyContributions || !Array.isArray(companyContributions)) {
      throw new Error("The companyContributions must be an array");
    }
    if (!withdrawals || !Array.isArray(withdrawals)) {
      throw new Error("The withdrawals must be an array");
    }
    this._rev = _rev;
    this.id = id;
    this.tenantId = tenantId;
    this.brokerage = brokerage;
    this.name = name;
    this.vestedPercentage = vestedPercentage;
    this.vestedContributions = vestedContributions.map(
      contribution => new Transaction(contribution)
    );
    this.companyContributions = companyContributions.map(
      contribution => new Transaction(contribution)
    );
    this.withdrawals = withdrawals.map(
      withdrawal => new Transaction(withdrawal)
    );
  }

  get balance() {
    const vestedContributions = this.vestedContributions.reduce(
      (x, y) => x + y.amount,
      0
    );
    const companyContributions = this.companyContributions.reduce(
      (x, y) => x + y.amount,
      0
    );
    const companyVestedContributions =
      (companyContributions * this.vestedPercentage) / 100;
    const withdrawals = this.withdrawals.reduce((x, y) => x + y.amount, 0);
    return vestedContributions + companyVestedContributions - withdrawals;
  }

  makeVestedContribution(contribution) {
    this.vestedContributions.push(contribution);
  }

  makeCompanyContribution(contribution) {
    this.companyContributions.push(contribution);
  }

  makeWithdrawal(withdrawal) {
    this.withdrawals.push(withdrawal);
  }

  toJSON() {
    return {
      ...this,
      balance: this.balance
    };
  }
};

export { Account };
