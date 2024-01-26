const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_KEY);

module.exports = (sendto, templateName) => {
  resend.emails.send({
    from: "MyFates <noreply@mhshuvoalways.xyz>",
    to: sendto,
    subject: "MyFates",
    html: templateName,
  });
};
