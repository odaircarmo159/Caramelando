const service = require("./auth.service");

async function login(req, res, next) {
  try {
    const session = await service.login(req.body);
    return res.json(session);
  } catch (error) {
    next(error);
  }
}

async function getCurrentSession(req, res, next) {
  try {
    const session = await service.getCurrentSession(req.user.id);
    return res.json(session);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCurrentSession,
  login,
};
