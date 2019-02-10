import express from "express";
import helmet from "helmet";
import cors from "cors";
import jwt from "express-jwt";
import "./console-overrides";
import { Datastores } from "./application-services/registries/datastores";
import { Controllers } from "./application-services/registries/controllers";

const configureDatastores = () => {
  const promises = Object.keys(Datastores).map(store => {
    console.debug(`building the ${store} datastore`);
    return Datastores[store].build();
  });
  return Promise.all(promises);
};

configureDatastores()
  .then(() => {
    const app = express();
    configureApi(app, () => {
      configureControllers(app);
    });
  })
  .catch(error => console.error(error));

const configureControllers = app => {
  const configure = controllers => {
    Object.keys(controllers).forEach(controller => {
      console.debug(`registering the ${controller} controller`);
      controllers[controller].register();
    });
  };
  const controllers = Controllers(app);
  configure(controllers);
};

const configureApi = (app, registerRoutes) => {
  app.use(helmet());
  app.use(express.json());
  app.use(
    cors({
      origin: "*"
    })
  );
  // TODO: replace secret
  app.use(jwt({ secret: "secret" }).unless({ path: ["/"] }));

  // add a route for health checking the api
  app.get("/", (request, response) => {
    response.end();
  });

  registerRoutes();

  // this must be the last thing added to app or errors will not go through it
  app.use((error, request, response, next) => {
    if (error.name === "UnauthorizedError") {
      response.status(401).end();
    } else {
      console.error(error.stack);
      response.status(500).end();
    }
  });

  const port = process.env.PORT || 8085;
  app.listen(port, () => {
    console.log(
      `${process.env.npm_package_name} is ready at port ${port}, captain!`
    );
  });
};
