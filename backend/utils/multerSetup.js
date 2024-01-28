const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to set up multer storage for logo uploads
function setupLogoStorage() {
  const uploadsPath = path.join(__dirname, '/../public/uploads/logo/');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: './public/uploads/logo/',
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname)
      );
    },
  });

  return multer({ storage: storage });
}

// Function to set up multer storage for email attachments
function setupEmailStorage() {
  const emailFilePath = path.join(__dirname, '/../public/uploads/email/');
  if (!fs.existsSync(emailFilePath)) {
    fs.mkdirSync(emailFilePath, { recursive: true });
  }

  const emailstorage = multer.diskStorage({
    destination: './public/uploads/email/',
    filename: function (req, file, cb) {
      const originalFileName = file.originalname;
      const fileExtension = path.extname(originalFileName);
      const newFileName = `emailattach_${Date.now()}${fileExtension}`;
      req.fileNames = req.fileNames || [];
      req.fileNames.push(newFileName);
      cb(null, newFileName);
    },
  });

  return multer({ storage: emailstorage });
}

module.exports = {
  setupLogoStorage,
  setupEmailStorage,
};
