const User = require("../Auth/auth.model");
const AuthUser = require("../Auth/auth.model");
const UserProfile = require("../UserProfile/userProfile.model")
const AuthService = require("../Auth/auth.service")
const Subscription = require("../Subscription/subscriptionPlan.model")
const UserSubscription = require("../Subscription/userSubscription.model")
const HttpStatus = require("http-status-codes");
const moment = require("moment");
const currentTime = moment.utc().format("HH:mm:ss");
const currentDate = moment.utc().format("YYYY-MM-DD");
const { v4: uuidv4 } = require('uuid');
const mailJetClient = require("../../config/mailjet.config")
const { hashedPassword } = require("../../utils/hashPassword");
const minioClient = require("../../config/minio.config");

deleteUser = async function (req, res) {
  var userId = req.params.userId
  await UserProfile.deleteOne({"user":userId})
  await AuthUser.deleteOne({"_id": userId})
  getMyUsers(req,res)
}

getMyUsers = async function (req, res) {
    const { userId } = req.headers.user;
    var users = await AuthUser.find({
        'addedBy':userId
    })
    var myAccount = await AuthUser.findOne({"_id":userId})
    var response = []
    users.unshift(myAccount)
    for (var user of users) { 
        user = user.toObject();
        delete user["password"]
        user.profile = await findUserProfile(user._id)
        if(user.profile.avatar)
          user.profile.avatar = await minioClient.presignedUrl('GET', process.env.MINIO_BUCKET, user.profile.avatar, 24*60*60) 
        response.push(user)
    }
    response[0].subscription = await UserSubscription.findOne({"user":userId})
    response[0].subscription = response[0].subscription.toObject()
    response[0].subscription.plan = await Subscription.findOne({"planId":response[0].subscription.planId})
    response[0].role = "ACCOUNT OWNER"
    res.status(HttpStatus.OK).send(response)
}

getUserProfile = async function (req, res) {
    var userId = req.params.userId
    var profile = await findUserProfile(userId)
    var account = await AuthUser.findOne(profile.user).select({"userName":1, "email":1})
    profile = profile.toObject();
    profile.userName = account.userName
    profile.email = account.email
    profile.avatar = await minioClient.presignedUrl('GET', process.env.MINIO_BUCKET, profile.avatar, 24*60*60) 
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
      status: AuthUser.statusType.PENDING,
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
              "TemplateID": 1571819,
              "TemplateLanguage": true,
              "Subject": "You've been invited to join ePixilr!",
              "Variables": {
                "firstname": "\"]]</title><!--[if !mso]><!-- --><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><!--<![endif]--><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><style type=\"text/css",
                "invite_link": link,
                "userName": userAccount.userName,
                "inviteeUserName": myAccount.userName
              }
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

module.exports = { getMyUsers, inviteUser, getUserProfile, updateUserProfile, deleteUser };
