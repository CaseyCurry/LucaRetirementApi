import fetch from "node-fetch";
import { AccountStore } from "../../infrastructure/couchdb/stores/account-store";

const accountStore = AccountStore(fetch, process.env.DATABASE_URL);

const Datastores = {
  account: accountStore
};

export { Datastores };
