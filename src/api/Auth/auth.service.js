const User = require("./auth.model");
const Token = require("./token.model");
const mailJetClient = require("../../config/mailjet.config")
const bcrypt = require("bcryptjs");
let HttpStatus = require("http-status-codes");
const { getToken } = require("../../utils/generateToken");
const { hashedPassword } = require("../../utils/hashPassword");
const { validateUser } = require("../../utils/validation/validate");
var nodemailer = require("nodemailer");

signup = async function (req, res) {
  let { userName, email, password } = req.body || {};
  const { error, status } = validateUser({ userName, email, password });

  if (status === false) {
    return res.send({
      status: HttpStatus.PRECONDITION_REQUIRED,
      error,
    });
  }

  if (await userExist(email)) {
    return res.send({
      status: HttpStatus.CONFLICT,
      error: `Email ${email} already registered try another email`,
    });
  }

  password = await hashedPassword(password);
  const user = new User({
    userName,
    email,
    password,
  });

  await user
    .save()
    .then(async (response) => {
      if (response) await sendVerificationEmail(response, req, res);
    })
    .catch((error) => {
      throw new Error(error);
    });
};

signin = async function (req, res) {
  let { email, password } = req.body || {};
  const { error, status } = validateUser({ userName: "null", email, password });

  if (status === false) {
    return res.send({
      status: HttpStatus.PRECONDITION_REQUIRED,
      error,
    });
  }

  await User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        return res.send({
          status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
          error: "Email or password is wrong.",
        });
      }
      if (!user.isVerified) {
        return res.send({
          status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
          verified: false,
          error:
            "Your account is not verified. Please verify your account first",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.send({
          status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
          error: "Email or password is wrong.",
        });
      }

      return res.send({
        status: HttpStatus.OK,
        verified: true,
        user: user.userName,
        expireIn: 3600,
        error: null,
        token: await getToken(user._id, user.userName, user.role),
      });
    })
    .catch((error) => {
      throw new Error(error);
    });
};

userExist = async function (email) {
  const userExist = await User.find({ email });
  if (userExist.length > 0) return true;
  else return false;
};

async function verify(req, res) {
  if (!req.params.token)
    return res
      .status(400)
      .json({ message: "We were unable to find a user for this token." });

  try {
    const token = await Token.findOne({ token: req.params.token });

    if (!token)
      return res.status(400).json({
        message:
          "We were unable to find a valid token. Your token may have expired.",
      });

    User.findOne({ _id: token.userId }, (err, user) => {
      if (!user)
        return res
          .status(400)
          .json({ message: "We were unable to find a user for this token." });

      if (user.isVerified) {
        return res.status(200).send("The account has already been verified.");
      }
      // Verify and save the user
      user.isVerified = true;
      user.save(function (err) {
        if (err)
          return res.status(500).json({ message: err.message, status: "500" });

        res.status(200).send("The account has been verified. Please log in.");
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "failed" });
  }
}

async function sendVerificationEmail(user, req, res) {
  try {
    const token = user.generateVerificationToken(user._id);
    await token.save();

    let link = "http://" + req.headers.host + "/api/auth/verify/" + token.token;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "",
        pass: "",
      },
    });

    var mailOptions = {
      from: "kbztest01@gmail.com",
      to: user.email,
      subject: "Sending Email using Node.js[nodemailer]",
      text: `<p>Hi ${user.userName}<p><br><p>Please click here: ${link} to verify your account.</p>
        <br><p>If you did not request this, please ignore this email.</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error.message, "erererererer");
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({
          message: "A verification email has been sent to " + user.email + ".",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "last catch" });
  }
}



module.exports = { signin, signup, verify, userExist };
