import nodemailer from 'nodemailer'

const ConfirmEmail = async (email, username, OTP) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS,
    },
  })
  const mailOptions = {
    from: `Shanmukeshwar ${process.env.SMTP_AUTH_USER}`,
    to: email,
    subject: 'Confirm your account',
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Shanmukeshwar</a>
      </div>
      <p style="font-size:1.1em">Hi ${username},</p>
      <p>Thank you for joining us. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
      <p style="font-size:0.9em;">Regards,<br />Shanmukeshwar</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Shanmukeshwar Inc</p>
        <p>Hitech city , Hyderabad</p>
        <p>India</p>
      </div>
    </div>
  </div>`,
  }
  await transporter.sendMail(mailOptions)
}

const ResetPassword = async (email, username, token) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS,
    },
  })
  const mailOptions = {
    from: `Shanmukeshwar ${process.env.SMTP_AUTH_USER}`,
    to: email,
    subject: 'Password reset request',
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Shanmukeshwar</a>
      </div>
      <p style="font-size:1.1em">Hi ${username},</p>
      <p>Thank you for being a valuable member of Shanmukeshwar. Use the following Link to reset your password. link is valid for 5 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;"><a style="color: #fff; text-decoration: none" href=${
        process.env.ORIGIN + '/resetpassword/?token=' + token
      }>Reset my password</a></h2>
      <p style="font-size:0.9em;">Regards,<br />Shanmukeshwar</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Shanmukeshwar Inc</p>
        <p>Hitech city , Hyderabad</p>
        <p>India</p>
      </div>
    </div>
  </div>`,
  }
  await transporter.sendMail(mailOptions)
}

const UpdateEmail = async (email, OTP) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS,
    },
  })
  const mailOptions = {
    from: `Shanmukeshwar ${process.env.SMTP_AUTH_USER}`,
    to: email,
    subject: 'Email update request',
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Shanmukeshwar</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for being a valuable member of Shanmukeshwar. Use the following OTP to update your email. OTP is valid for 5 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
      <p style="font-size:0.9em;">Regards,<br />Shanmukeshwar</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Shanmukeshwar Inc</p>
        <p>Hitech city , Hyderabad</p>
        <p>India</p>
      </div>
    </div>
  </div>`,
  }
  await transporter.sendMail(mailOptions)
}

const DeleteUser = async (email, username, OTP) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS,
    },
  })
  const mailOptions = {
    from: `Shanmukeshwar ${process.env.SMTP_AUTH_USER}`,
    to: email,
    subject: 'User delete request',
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Shanmukeshwar</a>
      </div>
      <p style="font-size:1.1em">Hi ${username},</p>
      <p>We are sorry to see you go. Use the following OTP to delete your account. OTP is valid for 5 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
      <p style="font-size:0.9em;">Regards,<br />Shanmukeshwar</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Shanmukeshwar Inc</p>
        <p>Hitech city , Hyderabad</p>
        <p>India</p>
      </div>
    </div>
  </div>`,
  }
  await transporter.sendMail(mailOptions)
}

export default { ConfirmEmail, DeleteUser, UpdateEmail, ResetPassword }
