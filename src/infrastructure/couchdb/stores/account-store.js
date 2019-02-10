import buildStore from "./build-store";

const AccountStore = (http, baseUrl) => {
  const url = `${baseUrl}retirement%2Faccounts/`;
  return {
    url,
    http,
    build: () => {
      const views = {
        views: {
          "tenant-accounts": {
            map: "function (doc) {\n  emit(doc.tenantId, null);\n}"
          }
        },
        language: "javascript"
      };
      return buildStore(http, url, views);
    }
  };
};

export { AccountStore };
