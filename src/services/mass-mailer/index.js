const cfgenv = require("../../config/env");
const mailgun = require("mailgun-js")({
  apiKey: cfgenv.massmailer.apiKey,
  domain: cfgenv.massmailer.domainName,
  host: cfgenv.massmailer.host,
});

module.exports.sendMassMail = async (params) => {
  const payload = {
    from: cfgenv.massmailer.sender,
    subject: params.subject,
    to: params.recipients.join(","),
    html: params.content,
  };
  await mailgun.messages().send(payload);
  await mailgun.lists;

  return true;
};
