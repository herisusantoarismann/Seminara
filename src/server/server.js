const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./router");
const helpers = require("./helpers");
const path = require("path");

const relpath = (...paths) => path.join(__dirname, "../../", ...paths);

module.exports = () => {
  const app = express();
  const instrouter = router.main();

  app.use(morgan("dev"));
  app.use(bodyParser.urlencoded({ limit: "8mb", extended: true }));
  app.use(bodyParser.json({ limit: "8mb" }));
  app.use(cookieParser());
  app.use(cors());

  app.use(express.static(relpath("build")));
  app.use(
    "/assets/uploads",
    express.static(relpath("src/webapp/assets/uploads"))
  );

  app.get("/", (req, res) =>
    res.sendFile(relpath("src/static-site", "index.html"))
  );
  app.get("/teams", express.static("src/static-site/teams.html"));

  app.get("/app/*", (req, res) =>
    res.sendFile(relpath("build", "webapp.html"))
  );

  app.use("/api", instrouter);

  app.use(helpers.pathNotFoundHandler());
  app.use(helpers.errorHandler());

  return app;
};
