const userRoles = ['getUser', 'updateProfile', 'changePassword', 'uploadMedia', 'manageOwnPlaces'];
const adminRoles = [...userRoles, 'getCategories', 'manageCategories', 'managePlaces', 'approvePlaces'];
const moderatorRoles = [...userRoles, 'manageModeratorRequests', 'getCategories', 'approvePlaces'];
const superAdminRoles = [...adminRoles, 'manageUsers', 'getUsers', 'manageRestrictedWords', 'importDistricts', 'importWards', 'manageModeratorRequests'];

const allRoles = {
  user: userRoles,
  moderator: moderatorRoles,
  admin: adminRoles,
  superAdmin: superAdminRoles,
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
