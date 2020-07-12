const UserProfileService = require("./userProfile.service");

getUserProfile = async function (req, res) {
    await UserProfileService.getUserProfile(req, res);
};

addUserProfile = async function (req, res) {
    await UserProfileService.addUserProfile(req, res);
}

addUserProfileAvatar = async function (req, res) {
    await UserProfileService.addUserProfileAvatar(req, res);
}

module.exports = { getUserProfile, addUserProfile, addUserProfileAvatar };
