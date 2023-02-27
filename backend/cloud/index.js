const cloudinary = require("cloudinary").v2;

cloudinary.config({
  // cloud_name: process.env.CLOUD_NAME,
  // api_key: process.env.CLOUD_API_KEY,
  // api_secret: process.env.CLOUD_API_SECRET,
  // secure: true,
  cloud_name: "duyhs3pvt",
  api_key: "169891745459678",
  api_secret: "H4ONj-lDEkLDwjzF-U_LrRWJS88",
  secure: true,
});

module.exports = cloudinary;
