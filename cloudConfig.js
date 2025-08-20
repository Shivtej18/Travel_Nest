const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ //connect backend with cloud acc.
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});// cloud_name, api_key, api_secrete: are defaulte variable cannot rename them

//storage defination:
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'TravelNest_DEV',
    format: async (req, file) => 'jpg', // supports promises as well
    public_id: (req, file) => 'computed-filename-using-request',
  },
}); 

module.exports = {
    cloudinary,
    storage
};