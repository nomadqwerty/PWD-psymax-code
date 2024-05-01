const express = require('express');
const {
storeFile,createFolder, getFileDetails
} = require('./controllers/fileHandler');

const fileRouter = express.Router();

fileRouter.post('/file/store', storeFile);
fileRouter.post('/file/create', createFolder);
fileRouter.post('/file/download', getFileDetails);


module.exports = fileRouter;
