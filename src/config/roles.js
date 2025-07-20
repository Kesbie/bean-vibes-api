const userRoles = ['getUser', 'updateProfile', 'changePassword', 'uploadMedia'];
const adminRoles = [...userRoles, 'getCategories', 'manageCategories'];
const superAdminRoles = [...adminRoles, 'manageUsers', 'getUsers', 'manageRestrictedWords', 'importDistricts', 'importWards'];

const allRoles = {
  user: userRoles,
  admin: adminRoles,
  superAdmin: superAdminRoles,
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
