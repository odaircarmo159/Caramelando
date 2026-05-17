const service = require("./uploads.service");

async function uploadAnimalImage(req, res, next) {
  try {
    const result = await service.uploadAnimalImage(req.body, {
      contentType: req.headers["content-type"],
      fileName: req.headers["x-file-name"],
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadAnimalImage,
};
