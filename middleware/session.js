const { usersModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");
const { verifyToken } = require("../utils/handleJwt");


const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      handleHttpError(res, "ERROR_NOT_TOKEN", 401);
      return;
    }

    const token = req.headers.authorization.split(' ').pop();
    const dataToken = await verifyToken(token);

    if (!dataToken._id) {
      handleHttpError(res, "ERROR_TOKEN_ID", 401);
      return;
    }

    const user = await usersModel.findById(dataToken._id);
    req.user = user;

    next();

  } catch (error) {
    handleHttpError(res, "ERROR_NOT_SESSION", 401);
  }
};

module.exports = { authMiddleware };
