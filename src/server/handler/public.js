const express = require("express");
const passport = require("passport");
const passportjwt = require("passport-jwt");
const utils = require("./utils");
const handlerAdmin = require("./handler/admin");
const cfgenv = require("../config/env");
const handlerPublic = require("./handler/public");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/webapp/assets/uploads/");
  },
  filename: function (req, file, cb) {
    const nameProof =
      req.body.agency.replace(/\s/g, "") + req.body.name.replace(/\s/g, "");
    cb(null, nameProof + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(new Error("Good"), true);
  } else {
    cb(new Error("message"), false);
  }
};
const upload = multer({ storage: storage });

const main = () => {
  setupAuthStrategy();

  const router = express.Router();
  const hadmin = handlerAdmin({});
  const hpublic = handlerPublic({});
  const wrap = utils.asyncHandler;
  const validateAuth = passport.authenticate("jwt", {
    session: false,
  });

  router.get("/", (req, res) => res.json({ status: "ok" }));
  router.post("/admin/login", wrap(hadmin.AuthV1));

  // ADMIN FUNCTIONS
  router.post("/admin/sendmassmail", validateAuth, wrap(hadmin.SendMassMailV1));

  // CRUD DATA SEMINAR
  router.post("/seminars/", validateAuth, wrap(hadmin.RegisterSeminarV1));
  router.get("/seminars/:page", validateAuth, wrap(hadmin.ShowAllSeminarsV1));
  router.post(
    "/seminars/search/:page",
    validateAuth,
    wrap(hadmin.FilterSeminarV1)
  );
  router.get("/seminars/done/:page", validateAuth, wrap(hadmin.DoneSeminarV1));
  router.get(
    "/seminars/count/done",
    validateAuth,
    wrap(hadmin.CountDoneSeminarV1)
  );
  router.get(
    "/seminars/today/:page",
    validateAuth,
    wrap(hadmin.TodaySeminarV1)
  );
  router.get(
    "/seminars/count/today",
    validateAuth,
    wrap(hadmin.CountTodaySeminarV1)
  );
  router.get(
    "/seminars/upcoming/:page",
    validateAuth,
    wrap(hadmin.UpcomingSeminarV1)
  );
  router.get("/seminars/month/:page", validateAuth, wrap(hadmin.ThisMonthV1));
  router.get(
    "/seminars/count/upcoming",
    validateAuth,
    wrap(hadmin.CountUpcomingSeminarV1)
  );
  router.get(
    "/seminars/count/month",
    validateAuth,
    wrap(hadmin.CountThisMonthSeminarV1)
  );
  router.get("/seminars/detail/:id", validateAuth, wrap(hadmin.ShowSeminarV1));
  router.put("/seminars/:id", validateAuth, wrap(hadmin.UpdateSeminarV1));
  router.delete("/seminars/:id", validateAuth, wrap(hadmin.DeleteSeminarV1));
  router.get("/public/seminars/detail/:id", wrap(hpublic.ShowSeminarV1));

  // CRUD DATA PESERTA
  router.post(
    "/public/seminar/:idseminar/participants",
    upload.single("proof"),
    wrap(hpublic.RegisterSeminarParticipantsV1)
  );
  router.get(
    "/public/seminars/:idseminar/participants/:id",
    wrap(hpublic.ShowParticipantV1)
  );
  router.get(
    "/seminars/:idseminar/free/participants",
    wrap(hadmin.ShowParticipantFreeV1)
  );
  router.get(
    "/seminars/:idseminar/pay/participants",
    wrap(hadmin.ShowParticipantPayV1)
  );
  router.post(
    "/seminar/:idseminar/participants",
    upload.single("proof"),
    validateAuth,
    wrap(hadmin.CreateParticipantsV1)
  );
  router.get(
    "/seminar/:idseminar/participants/:page",
    validateAuth,
    wrap(hadmin.ShowAllParticipantsV1)
  );
  router.get("/seminar/count/participants", wrap(hadmin.CountParticipantsV1));
  router.get(
    "/seminar/:idseminar/participants/:id",
    validateAuth,
    wrap(hadmin.ShowParticipantV1)
  );
  router.put(
    "/seminar/:idseminar/participants/:id",
    validateAuth,
    wrap(hadmin.UpdateParticipantV1)
  );
  router.put(
    "/seminar/:idseminar/verified/participants/:id",
    validateAuth,
    wrap(hadmin.VerifiedParticipantV1)
  );
  router.delete(
    "/seminar/:idseminar/participants/:id",
    validateAuth,
    wrap(hadmin.DeleteParticipantV1)
  );

  return router;
};

function setupAuthStrategy() {
  const [username] = cfgenv.server.authCred.split(":");

  const opts = {
    jwtFromRequest: passportjwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: cfgenv.server.authSecret,
  };

  passport.use(
    new passportjwt.Strategy(opts, function (jwt_payload, done) {
      if (jwt_payload.username !== username) return done(null, false);
      return done(null, jwt_payload);
    })
  );
}

module.exports = {
  main: main,
};
