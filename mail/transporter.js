const nodemailer = require("nodemailer");

module.exports = (sendto, templateName) => {
  const transporter = nodemailer.createTransport({
    service: "SendinBlue",
    auth: {
      user: process.env.SENDINBLUE_USER,
      pass: process.env.SENDINBLUE_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SENDINBLUE_USER,
    to: sendto,
    subject: "My Fate",
    html: templateName,
  };

  transporter.sendMail(mailOptions);
};
