const express = require('express');
const {
storeFile
} = require('./controllers/fileHandler');

const fileRouter = express.Router();

fileRouter.post('/file/store', storeFile);


module.exports = fileRouter;
