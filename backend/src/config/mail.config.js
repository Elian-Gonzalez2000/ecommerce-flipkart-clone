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
    const transporterEmail = await transporter.sendMail({
      from: `eliancarlogm2@gmail.com`, // sender address
      to: email, // list of receivers
      subject, // Subject line
      text: "Confirmation instructions to your Flipkart account", // plain text body
      html, // html body
    });
    return transporterEmail;
  } catch (error) {
    console.log("Algo no va bien con el email", error);
    return error;
  }
};

const getTemplate = (name, token) => {
  return `
        <head>
            <link rel="stylesheet" href="./style.css">
        </head>
        
        <div id="email___content">
            <img src="https://raw.githubusercontent.com/Elian-Gonzalez2000/ecommerce-flipkart-clone/refs/heads/update-flipkart-clone/client/src/images/login-image.png" alt="">
            <h2>Welcome ${name}</h2>
            <p>You can confirm your account email through the link below: </p>
            <a
                href="http://localhost:3002/api/admin/confirm/${token}"
                target="_blank"
            >Confirm account</a>
        </div>
      `;
};

const getTemplateUser = (name, token, email) => {
  return `
        <head>
            <link rel="stylesheet" href="./style.css">
        </head>
        
        <div id="email___content">
            <img src="https://raw.githubusercontent.com/Elian-Gonzalez2000/ecommerce-flipkart-clone/refs/heads/update-flipkart-clone/client/src/images/login-image.png" alt="">
            <h2>Welcome ${name}</h2>
            <p>You can confirm your account email through the link below:</p>
            <a
                href="http://localhost:3002/api/user/confirm/${token}/${email}"
                target="_blank"
            >Confirm account</a>
        </div>
      `;
};

module.exports = {
  sendEmail,
  getTemplate,
  getTemplateUser,
};
