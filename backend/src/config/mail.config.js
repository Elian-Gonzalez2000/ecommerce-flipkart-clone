const nodemailer = require("nodemailer");

const mail = {
  user: "eliancarlogm@gmail.com",
  pass: "ifgeyvrkdmeveyce",
};

let transporter = nodemailer.createTransport({
  service: "Gmail",
  // host: "mail.mhdeploy.com",
  // port: 2525,
  // tls: {
  //   rejectUnauthorized: false,
  // },
  // secure: false, // true for 465, false for other ports
  auth: {
    user: mail.user, // generated ethereal user
    pass: mail.pass, // generated ethereal password
  },
});

const sendEmail = async (email, subject, html) => {
  try {
    await transporter.sendMail({
      from: `eliancarlogm2@gmail.com`, // sender address
      to: email, // list of receivers
      subject, // Subject line
      text: "Pruebas del login con la app Flipkart Clone", // plain text body
      html, // html body
    });
  } catch (error) {
    console.log("Algo no va bien con el email", error);
  }
};

const getTemplate = (name, token) => {
  return `
        <head>
            <link rel="stylesheet" href="./style.css">
        </head>
        
        <div id="email___content">
            <img src="https://i.imgur.com/eboNR82.png" alt="">
            <h2>Hola ${name}</h2>
            <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
            <a
                href="http://localhost:3002/api/admin/confirm/${token}"
                target="_blank"
            >Confirmar Cuenta</a>
        </div>
      `;
};

const getTemplateUser = (name, token) => {
  return `
        <head>
            <link rel="stylesheet" href="./style.css">
        </head>
        
        <div id="email___content">
            <img src="https://i.imgur.com/eboNR82.png" alt="">
            <h2>Hola ${name}</h2>
            <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
            <a
                href="http://localhost:3002/api/user/confirm/${token}"
                target="_blank"
            >Confirmar Cuenta</a>
        </div>
      `;
};

module.exports = {
  sendEmail,
  getTemplate,
  getTemplateUser,
};
