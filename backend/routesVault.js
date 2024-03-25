const express = require('express');
const {
  getServerVault,
  getUserVault,
  createUserVault,
  updateUserVault,
  updateMainVault,
  getStatus,
  updateArchiveVault
} = require('./controllers/vault');

const vaultRouter = express.Router();

vaultRouter.get('/vault/server', getServerVault);
vaultRouter.get('/vault/user/:userId', getUserVault);
vaultRouter.post('/vault/user', createUserVault);
vaultRouter.post('/vault/user/update', updateUserVault);
vaultRouter.post('/vault/user/update/main', updateMainVault);
vaultRouter.post('/vault/user/update/archive', updateArchiveVault);
vaultRouter.get('/vault/user/status', getStatus)

module.exports = vaultRouter;
