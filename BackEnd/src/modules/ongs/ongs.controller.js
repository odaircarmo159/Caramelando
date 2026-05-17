const service = require("./ongs.service");

async function createOng(req, res, next) {
  try {
    const result = await service.createOng(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function getCurrentOng(req, res, next) {
  try {
    const result = await service.getCurrentOng(req.user.id);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getOngById(req, res, next) {
  try {
    const result = await service.getOngById(req.params.id);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function updateCurrentOng(req, res, next) {
  try {
    const result = await service.updateCurrentOng(req.user.id, req.body);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOng,
  getCurrentOng,
  getOngById,
  updateCurrentOng,
};
