const service = require("./usuarios.service");

async function createUsuario(req, res, next) {
  try {
    const profile = await service.createUsuario(req.body);
    return res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
}

async function getCurrentUsuario(req, res, next) {
  try {
    const profile = await service.getCurrentUsuario(req.user.id);
    return res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function updateCurrentUsuario(req, res, next) {
  try {
    const profile = await service.updateCurrentUsuario(req.user.id, req.body);
    return res.json(profile);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUsuario,
  getCurrentUsuario,
  updateCurrentUsuario,
};
