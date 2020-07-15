const User = require("./auth.model");
const UserSubscription = require("../Subscription/userSubscription.model")
const SubscriptionPlan = require("../Subscription/subscriptionPlan.model")
const Token = require("./token.model");
const mailJetClient = require("../../config/mailjet.config")
const bcrypt = require("bcryptjs");
let HttpStatus = require("http-status-codes");
const { getToken } = require("../../utils/generateToken");
const { hashedPassword } = require("../../utils/hashPassword");
const { validateUser } = require("../../utils/validation/validate");

createPassword = async function (req, res) {
  const token = await Token.findOne({ token: req.body.token });
  if(!token){
    return res.status(400).send("The token is invalid or has expired.")
  }
  await Token.deleteOne({token: req.body.token})
  var newPassword = await hashedPassword(req.body.newPassword);
  var account = await User.findOne({_id: req.body.userId})

  account.password = newPassword
  account.save().then(async (resp) => {
    res.status(HttpStatus.OK).send();
  })
}

changePassword = async function (req, res) {
  var newPassword = await hashedPassword(req.body.newPassword);
  const { userId  } = req.headers.user;
  var account = await User.findOne({_id: userId})

  account.password = newPassword
  account.save().then(async (resp) => {
    res.status(HttpStatus.OK).send();
  })
}

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
          error: "Unable to login",
        });
      }
      if (!user.isVerified) {
        return res.send({
          status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
          verified: false,
          user: user._id,
          error:
            "Your account is not verified. Please verify your account first",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.send({
          status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
          error: "Unable to login",
        });
      }
      return res.send({
        status: HttpStatus.OK,
        verified: true,
        user: { userName: user.userName, role:user.role },
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
    
    if(token.type == Token.tokenType.EMAIL_CONFIRMATION){
      verifyEmailConfirmationToken(req, res, token)
    }
    else if(token.type == Token.tokenType.USER_INVITATION){
      verifyUserInvitationToken(req, res, token)
    }
    else{
      res.status(400).json({ message: "We were unable to find a valid token. Your token may have expired.", status: "failed" });
    }

    
  } catch (error) {
    res.status(500).json({ message: error.message, status: "failed" });
  }
}

verifyUserInvitationToken = async function (req, res, token){
  User.findOne({ _id: token.userId }, (err, user) => {
    if (!user)
      return res
        .status(400)
        .json({ message: "We were unable to find a user for this token." });

    user.status = User.statusType.ACTIVE
    user.isVerified = true;
    user.save(function (err) {
      if (err)
        return res.status(500).json({ message: err.message, status: "500" });

      res.status(200).send({id: user._id});
    });
  });
}

verifyEmailConfirmationToken = async function (req, res, token) {
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
}

async function sendVerificationEmail(user, req, res) {
  try {
    const token = user.generateVerificationToken(user._id);
    await token.save();

    let link = "http://" + req.headers.host + "/api/auth/verify/" + token.token;
    mailJetClient
      .post("send", {'version': 'v3.1'})
      .request({
          "Messages":[{
              "From": {
                  "Email": "noreply@epixlr.com",
                  "Name": "ePixilier"
              },
              "To": [{
                  "Email": user.email,
                  "Name": user.userName
              }],
              "Subject": "Verify your email address!",
              "HTMLPart": `<p>Hi ${user.userName}<p><br><p>Please click here: ${link} to verify your account.</p>
                <br><p>If you did not request this, please ignore this email.</p>`
          }]
      }).then((result) => {
        console.log("Email Confirmation email sent to " + user.email);
        res.status(200).json({
          message: "A verification email has been sent to " + user.email + ".",
        });
      }).catch((error) => {
        console.log(error)
        res.status(500).json({
          error: error
        })
      });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "last catch" });
  }
}

resendVerificationEmail = async (req, res) => {
  try {
    const userId = req.body.user._id;
    const user = User.findById(userId).then((response) => {
      if (response) sendVerificationEmail(response, req, res);
      else {
        return res.status(400).json({ error: "User not found" });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "User not found" });
  }
};



module.exports = { signin, signup, verify, userExist, resendVerificationEmail, changePassword, createPassword };
