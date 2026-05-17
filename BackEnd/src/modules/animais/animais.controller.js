const service = require("./animais.service");

async function listAnimais(req, res, next) {
  try {
    const animais = await service.listAnimais(req.query);
    return res.json(animais);
  } catch (error) {
    next(error);
  }
}

async function getAnimalById(req, res, next) {
  try {
    const animal = await service.getAnimalById(req.params.id);
    return res.json(animal);
  } catch (error) {
    next(error);
  }
}

async function getCurrentOngAnimals(req, res, next) {
  try {
    const animais = await service.getCurrentOngAnimals(req.user.id);
    return res.json(animais);
  } catch (error) {
    next(error);
  }
}

async function getPlatformStats(req, res, next) {
  try {
    const stats = await service.getPlatformStats();
    return res.json(stats);
  } catch (error) {
    next(error);
  }
}

async function createAnimal(req, res, next) {
  try {
    const animal = await service.createAnimal(req.user.id, req.body);
    return res.status(201).json(animal);
  } catch (error) {
    next(error);
  }
}

async function updateAnimal(req, res, next) {
  try {
    const animal = await service.updateAnimal(req.user.id, req.params.id, req.body);
    return res.json(animal);
  } catch (error) {
    next(error);
  }
}

async function deleteAnimal(req, res, next) {
  try {
    await service.deleteAnimal(req.user.id, req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createAnimal,
  deleteAnimal,
  getAnimalById,
  getCurrentOngAnimals,
  getPlatformStats,
  listAnimais,
  updateAnimal,
};
