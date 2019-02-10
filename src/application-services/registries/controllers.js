import { AccountController } from "../controllers/account-controller";
import { Repositories } from "./repositories";

const Controllers = app => {
  const accountController = AccountController(app, Repositories.account);
  return {
    account: accountController
  };
};

export { Controllers };
