const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_KEY);

module.exports = (sendto, templateName) => {
  resend.emails.send({
    from: process.env.RESEND_USER,
    to: sendto,
    subject: "MyFates",
    html: templateName,
  });
};
