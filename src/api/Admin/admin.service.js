const User = require("../Auth/auth.model");
const AuthUser = require("../Auth/auth.model");
const UserProfile = require("../UserProfile/userProfile.model")
const AuthService = require("../Auth/auth.service")
const HttpStatus = require("http-status-codes");
const moment = require("moment");
const currentTime = moment.utc().format("HH:mm:ss");
const currentDate = moment.utc().format("YYYY-MM-DD");
const { v4: uuidv4 } = require('uuid');
const mailJetClient = require("../../config/mailjet.config")
const { hashedPassword } = require("../../utils/hashPassword");

getMyUsers = async function (req, res) {
    const { userId } = req.headers.user;
    var users = await AuthUser.find({
        addedBy: userId
    })
    var response = []
    for (var user of users) { 
        user = user.toObject();
        delete user["password"]
        user["profile"] = await findUserProfile(user._id)
        response.push(user)
    }
    res.status(HttpStatus.OK).send(response)
}

getUserProfile = async function (req, res) {
    var userId = req.params.userId
    var profile = await findUserProfile(userId)
    res.status(HttpStatus.OK).send(profile)
}

updateUserProfile = async function (req, res) {
    console.log("here222")
    var userId = req.params.userId
    if(!userId)
      return res.status(400).send()
    var userProfile = await findUserProfile(userId)
    userProfile.updatedAt = new Date();
    userProfile.name = req.body.name;
    userProfile.email = req.body.email;
    userProfile.avatar = req.body.avatar;
    userProfile.company = req.body.company;
    userProfile.billingAddress1 = req.body.billingAddress1;
    userProfile.billingAddress2 = req.body.billingAddress2
    userProfile.billingCity = req.body.billingCity;
    userProfile.billingState = req.body.billingState;
    userProfile.billingZip = req.body.billingZip;
    userProfile.billingCountry = req.body.billingCountry;
    await userProfile
        .save()
        .then(async (response) => {
            res.status(HttpStatus.OK).send(response);
        })
        .catch((error) => {
            throw new Error(error);
        });
}

findUserProfile = async function(userId){
    var userProfile = await UserProfile.findOne({
        user: userId
    })
    return userProfile
}

inviteUser = async function (req, res) {
    var email = req.body.email
    var userName = req.body.name
    const { userId: user } = req.headers.user;
    if (await AuthService.userExist(email)) {
        return res.status(HttpStatus.CONFLICT).send({
            status: HttpStatus.CONFLICT,
            message:`User with email ${email} is already registered.`
        });
    }
  
    password = await hashedPassword(uuidv4());
    const userAccount = new User({
      userName,
      email,
      password,
      status: AuthUser.statusType.ACTIVE,
      role: req.body.role,
      addedBy: user
    });
  
    await userAccount
      .save()
      .then(async (userAccountResp) => {
        if (userAccountResp) {
          const userProfile = new UserProfile({
            user: userAccountResp._id,
            createdDate: currentDate,
            createdTime: currentTime,
          });
          await userProfile
          .save()
          .then(async (response) => {
              
              const myAccount = await User.findOne({
                  _id: user
              })
              await sendInvitationEmail(userAccount, myAccount, req, res);
          })
          .catch((error) => {
              throw new Error(error);
          });
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
}


async function sendInvitationEmail(userAccount, myAccount, req, res) {
    try {
      const token = userAccount.generateInvitationToken(userAccount._id);
      await token.save();
  
      let link = process.env.CLIENT_URL + "/account/create/" + token.token;
      mailJetClient
      .post("send", {'version': 'v3.1'})
      .request({
          "Messages":[{
              "From": {
                  "Email": "noreply@epixlr.com",
                  "Name": "ePixilier"
              },
              "To": [{
                  "Email": userAccount.email,
                  "Name": userAccount.userName
              }],
              "Subject": "You've been invited to join ePixilier!",
              "HTMLPart": `<p>Hi ${userAccount.userName}, <p><br><p>You've been invited by ${myAccount.userName} to create an account 
                          at ePixilier: Please click <a href=${link}>here</a> to create your account.</p><br>`
          }]
      }).then((result) => {
          console.log("Invitation email sent to " + userAccount.email);
          res.status(200).json({
            message: "An invitation email has been sent to " + userAccount.email + ".",
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

module.exports = { getMyUsers, inviteUser, getUserProfile, updateUserProfile };
