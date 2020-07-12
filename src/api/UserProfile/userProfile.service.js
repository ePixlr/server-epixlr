const UserProfile = require("./userProfile.model");
const HttpStatus = require("http-status-codes");
const moment = require("moment");
const minioClient = require("../../config/minio.config")
const currentTime = moment.utc().format("HH:mm:ss");
const currentDate = moment.utc().format("YYYY-MM-DD");

getUserProfile = async function (req, res) {
    const { userId: user } = req.headers.user;
    var profile = await UserProfile.findOne({
        user
    })
    if(profile){
        profile = profile.toObject();
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
    console.log(req.file)
    const userProfile = await UserProfile.findOne({
        user
    });
    if (userProfile !== null) {
        updateUserProfile(req, res, userProfile);
    } else {
        addNewUserProfile(req, res, user);
    }
};

addUserProfileAvatar = async function (req, res) {
    const { userId: user } = req.headers.user;
    var filePath = `userAvatars/${req.headers.user.userId}/avatar.${req.file.originalname.split(".")[1]}`
    minioClient.putObject(process.env.MINIO_BUCKET,filePath, req.file.buffer, async function(error, etag) {
        if(error) {
            return console.log(error);
        }
        console.log(etag);
        
        const userProfile = await UserProfile.findOne({
            user
        });
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


updateUserProfile = async function (req, res, userProfile) {
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
};

addNewUserProfile = async function (req, res, user) {
    const userProfile = new UserProfile({
        user,
        name: req.body.name,
        email: req.body.email,
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

module.exports = { addUserProfile, getUserProfile, addUserProfileAvatar };
