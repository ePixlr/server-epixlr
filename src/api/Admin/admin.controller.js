const AdminService = require("./admin.service");

getMyUsers = async function (req, res) {
    await AdminService.getMyUsers(req, res);
};

inviteUser = async function (req, res) {
    await AdminService.inviteUser(req, res)
}

getUserProfile = async function (req, res) {
    await AdminService.getUserProfile(req, res);
};

updateUserProfile = async function (req, res) {
    await AdminService.updateUserProfile(req, res);
};

deleteUser = async function (req, res) {
    await AdminService.deleteUser(req, res);
}

module.exports = { getMyUsers, inviteUser, getUserProfile, updateUserProfile, deleteUser };
