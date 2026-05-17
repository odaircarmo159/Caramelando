const path = require("path");

const supabase = require("../../config/supabase");
const AppError = require("../../utils/AppError");

const ANIMAL_BUCKET = process.env.SUPABASE_ANIMAL_BUCKET || "animal-fotos";

function getExtension(fileName, contentType) {
  const fileExtension = path.extname(fileName || "").replace(".", "").toLowerCase();

  if (fileExtension) {
    return fileExtension;
  }

  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/gif") return "gif";
  return "jpg";
}

async function uploadAnimalImage(fileBuffer, options = {}) {
  if (!fileBuffer || !fileBuffer.length) {
    throw new AppError("Nenhuma imagem foi enviada.", 400);
  }

  if (!options.contentType || !options.contentType.startsWith("image/")) {
    throw new AppError("Envie um arquivo de imagem valido.", 400);
  }

  const extension = getExtension(options.fileName, options.contentType);
  const filePath = `animals/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(ANIMAL_BUCKET)
    .upload(filePath, fileBuffer, {
      contentType: options.contentType,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(ANIMAL_BUCKET).getPublicUrl(filePath);

  return {
    bucket: ANIMAL_BUCKET,
    path: filePath,
    publicUrl: data.publicUrl,
  };
}

module.exports = {
  uploadAnimalImage,
};
