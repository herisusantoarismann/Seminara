const { normalize } = require("./utils");

module.exports = {
  appname: normalize(process.env.APP_NAME),
  server: {
    authSecret: normalize(process.env.API_AUTH_SECRET),
    authCred: normalize(process.env.API_AUTH_CREDENTIAL),
    connect: normalize(process.env.API_DATABASE),
    port: normalize(process.env.API_PORT),
  },
  // massmailer: {
  //   apiKey: normalize(process.env.MASSMAILER_MAILGUN_API_KEY),
  //   domainName: normalize(process.env.MASSMAILER_MAILGUN_DOMAIN_NAME),
  //   sender: normalize(process.env.MASSMAILER_MAILGUN_SENDER),
  //   host: normalize(process.env.MASSMAILER_MAILGUN_HOST),
  // },
};
