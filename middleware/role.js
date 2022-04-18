const { handleHttpError } = require("../utils/handleError");

/**
 * Array con los roles permitidos
 * @param {*} roles
 * @returns
 */
const checkRole = (roles) => (req, res, next) => {
  try {
    const { user } = req;
    console.log({ user });
    const rolesByUser = user.role;
    
    const checkValueRole = roles.some((roleSingle) =>
      rolesByUser.includes(roleSingle)
    );

    if (!checkValueRole) {
      handleHttpError(res, "ERROR_USER_NOT_PERMISSIONS", 403);
      return;  
    }

    next();
  } catch (error) {
    handleHttpError(res, "ERROR_PERMISSIONS", 403);
  }
};

module.exports = { checkRole };
