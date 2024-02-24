const express = require("express");
const {
 getServerVault
} = require("./controllers/vault");

const vaultRouter = express.Router();

vaultRouter.get("/vault/server",getServerVault );

module.exports = vaultRouter;