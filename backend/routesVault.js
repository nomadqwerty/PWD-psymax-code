const express = require("express");
const {
 getServerVault, getUserVault
} = require("./controllers/vault");

const vaultRouter = express.Router();

vaultRouter.get("/vault/server",getServerVault );
vaultRouter.get("/vault/user/:userId", getUserVault);

module.exports = vaultRouter;