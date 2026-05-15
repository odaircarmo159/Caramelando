const service = require("./ongs.service");

async function createOng(req, res, next) {
  try {
    const result = await service.createOng(req.body);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOng,
};
