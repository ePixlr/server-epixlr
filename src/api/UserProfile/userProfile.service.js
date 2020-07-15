const UserProfile = require("./userProfile.model");
const UserAccount = require("../Auth/auth.model")
const HttpStatus = require("http-status-codes");
const moment = require("moment");
const minioClient = require("../../config/minio.config")
const currentTime = moment.utc().format("HH:mm:ss");
const currentDate = moment.utc().format("YYYY-MM-DD");

getMyProfile = async function (req, res) {
    const { userId: user } = req.headers.user;
    var profile = await UserProfile.findOne({
        user
    })
    var account = await UserAccount.findOne(profile.user).select({"userName":1, "email":1})
    if(profile){
        profile = profile.toObject();
        profile.userName = account.userName
        profile.email = account.email
        minioClient.presignedUrl('GET', process.env.MINIO_BUCKET, profile.avatar, 24*60*60, function(err, presignedUrl) {
            if (err) return console.log(err)
            profile.avatar = presignedUrl
            res.status(HttpStatus.OK).send(profile);
        })
    }
    else{
        res.status(HttpStatus.NOT_FOUND).send("User profile not found.")
    }
}

addUserProfile = async function (req, res) {
    const { userId: user } = req.headers.user;
    const userProfile = await UserProfile.findOne({
        user
    });
    if (userProfile !== null) {
        updateMyProfile(req, res, userProfile);
    } else {
        addNewMyProfile(req, res, user);
    }
};

addUserProfileAvatar = async function (req, res) {
    const { userId: user } = req.headers.user;
    var filePath = `userAvatars/${req.headers.user.userId}/avatar.${req.file.originalname.split(".")[1]}`
    minioClient.putObject(process.env.MINIO_BUCKET,filePath, req.file.buffer, async function(error, etag) {
        if(error) {
            return console.log(error);
        }
        
        var userProfile = await UserProfile.findOne({
            user
        });
        if(!userProfile){
            userProfile = new UserProfile({
                user,
                avatar: filePath
            });
        }
        else
            userProfile.avatar = filePath
            
        await userProfile
            .save()
            .then(async (response) => {
                res.status(HttpStatus.OK).send(response);
            })
            .catch((error) => {
                throw new Error(error);
            });
    });
    
};


updateMyProfile = async function (req, res, userProfile) {
    userProfile.updatedAt = new Date();
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
            const userAccount = await UserAccount.findOne(userProfile.user);
            userAccount.userName = req.body.userName;
            await userAccount.save().then(async (resp) => {
                res.status(HttpStatus.OK).send(response);
            })
        })
        .catch((error) => {
            throw new Error(error);
        });
};

addNewMyProfile = async function (req, res, user) {
    const userProfile = new UserProfile({
        user,
        avatar: req.body.avatar,
        company: req.body.company,
        billingAddress1: req.body.billingAddress1,
        billingAddress2: req.body.billingAddress2,
        billingCity: req.body.billingCity,
        billingState: req.body.billingState,
        billingZip: req.body.billingZip,
        billingCountry: req.body.billingCountry,
        createdDate: currentDate,
        createdTime: currentTime,
    });
    await userProfile
        .save()
        .then(async (response) => {
            res.status(HttpStatus.OK).send(response);
        })
        .catch((error) => {
            throw new Error(error);
        });
};

module.exports = { addUserProfile, getMyProfile, addUserProfileAvatar };
