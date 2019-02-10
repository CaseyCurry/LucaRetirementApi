import { expect } from "chai";
import { Account } from "./account";
import { Transaction } from "../entities/transaction";

describe("account suite", () => {
  describe("when an account is created", () => {
    let account;

    beforeEach(() => {
      account = new Account({
        _rev: "123",
        id: "456",
        tenantId: "789",
        brokerage: "Fidelity",
        name: "Sunrise Sheet Metal",
        vestedPercentage: 50,
        vestedContributions: [
          new Transaction({
            date: new Date(),
            amount: 5
          }),
          new Transaction({
            date: new Date(),
            amount: 4
          })
        ],
        companyContributions: [
          new Transaction({
            date: new Date(),
            amount: 8
          })
        ],
        withdrawals: [
          new Transaction({
            date: new Date(),
            amount: 1
          })
        ]
      });
    });

    it("should calculate the balance", () => {
      expect(account.balance).to.equal(12);
    });
  });
});
