/*const nodemailer = require("nodemailer");

const sendMail = async (to, subject, html, attachments) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    secure: true,
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${process.env.MAIL_USERNAME} ${process.env.MAIL_EMAIL}`,
    to,
    subject,
    html,
    attachments,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;*/

const nodemailer = require("nodemailer");

const sendMail = async (to, subject, html, attachments) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.nate.com',
    secure: true,
    auth: {
      user: 'hchc12345@nate.com',
      pass: 'MALE1205!',
    },
  });

  const mailOptions = {
    from: 'hchc12345@nate.com',
    to,
    subject,
    html,
    attachments,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;