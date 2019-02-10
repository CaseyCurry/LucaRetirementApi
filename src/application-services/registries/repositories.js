import { Datastores } from "./datastores";
import { AccountRepository } from "../../infrastructure/couchdb/repositories/account-repository";

const accountRepository = AccountRepository(Datastores.account);

const Repositories = {
  account: accountRepository
};

export { Repositories };
