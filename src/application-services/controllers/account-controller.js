// TODO: unit test
import asyncHandler from "express-async-handler";
import { Account } from "../../domain/aggregates/account";
import { Transaction } from "../../domain/entities/transaction";

const AccountController = (app, accountRepository) => {
  return {
    register: () => {
      app.post(
        "/api/accounts",
        asyncHandler(async (request, response, next) => {
          const tenantId = request.user.tenant;
          if (request.body && tenantId != request.body.tenantId) {
            response.status(401).end();
            return;
          }
          let account;
          try {
            account = new Account(request.body);
          } catch (error) {
            console.error(error);
            response.status(400).end();
            return;
          }
          await accountRepository.create(account);
          response.status(201).end();
        })
      );
      app.post(
        "/api/accounts/:id/vested-contributions",
        asyncHandler(async (request, response, next) => {
          let contribution;
          try {
            contribution = new Transaction(request.body);
          } catch (error) {
            console.error(error);
            response.status(400).end();
            return;
          }
          const account = await accountRepository.getById(request.params.id);
          if (!account) {
            response.status(404).end();
          }
          if (request.user.tenant !== account.tenantId) {
            response.status(403).end();
            return;
          }
          account.makeVestedContribution(contribution);
          await accountRepository.update(account);
          response.status(200).end();
        })
      );
      app.post(
        "/api/accounts/:id/company-contributions",
        asyncHandler(async (request, response, next) => {
          let contribution;
          try {
            contribution = new Transaction(request.body);
          } catch (error) {
            console.error(error);
            response.status(400).end();
            return;
          }
          const account = await accountRepository.getById(request.params.id);
          if (!account) {
            response.status(404).end();
          }
          if (request.user.tenant !== account.tenantId) {
            response.status(403).end();
            return;
          }
          account.makeCompanyContribution(contribution);
          await accountRepository.update(account);
          response.status(200).end();
        })
      );
      app.post(
        "/api/accounts/:id/withdrawals",
        asyncHandler(async (request, response, next) => {
          let withdrawal;
          try {
            withdrawal = new Transaction(request.body);
          } catch (error) {
            console.error(error);
            response.status(400).end();
            return;
          }
          const account = await accountRepository.getById(request.params.id);
          if (!account) {
            response.status(404).end();
          }
          if (request.user.tenant !== account.tenantId) {
            response.status(403).end();
            return;
          }
          account.makeWithdrawal(withdrawal);
          await accountRepository.update(account);
          response.status(200).end();
        })
      );
      app.get(
        "/api/accounts",
        asyncHandler(async (request, response, next) => {
          const tenantId = request.user.tenant;
          const accounts = await accountRepository.getAccounts(tenantId);
          response.status(200).send(accounts);
        })
      );
    }
  };
};

export { AccountController };
