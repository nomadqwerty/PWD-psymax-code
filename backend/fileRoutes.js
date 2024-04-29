const express = require('express');
const {
storeFile,createFolder
} = require('./controllers/fileHandler');

const fileRouter = express.Router();

fileRouter.post('/file/store', storeFile);
fileRouter.post('/file/create', createFolder);


module.exports = fileRouter;
