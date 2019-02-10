// TODO: unit test
import { Account } from "../../../domain/aggregates/account";

const extendAccount = account => {
  return Object.assign({}, account, {
    _id: account.id
  });
};

const AccountRepository = datastore => {
  return {
    create: async account => {
      const extendedAccount = extendAccount(account);
      return datastore.http(datastore.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extendedAccount)
      });
    },
    update: account => {
      const extendedAccount = extendAccount(account);
      return datastore.http(`${datastore.url}${account.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extendedAccount)
      });
    },
    getById: id => {
      const url = `${datastore.url}${id}`;
      return datastore
        .http(url)
        .then(response => response.json())
        .then(body => new Account(body));
    },
    getAccounts: tenantId => {
      let url = `${
        datastore.url
      }_design/doc/_view/tenant-accounts?include_docs=true&key="${tenantId}"`;
      return datastore
        .http(url)
        .then(response => response.json())
        .then(body => {
          return body.rows.map(row => new Account(row.doc));
        });
    }
  };
};

export { AccountRepository };
