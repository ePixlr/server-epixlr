const UserProfileService = require("./userProfile.service");

getMyProfile = async function (req, res) {
    await UserProfileService.getMyProfile(req, res);
};

addUserProfile = async function (req, res) {
    await UserProfileService.addUserProfile(req, res);
}

addUserProfileAvatar = async function (req, res) {
    await UserProfileService.addUserProfileAvatar(req, res);
}

module.exports = { getMyProfile, addUserProfile, addUserProfileAvatar };
