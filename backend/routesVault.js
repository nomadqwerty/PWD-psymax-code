const express = require("express");
const {
 getServerVault, getUserVault,createUserVault,updateUserVault
} = require("./controllers/vault");

const vaultRouter = express.Router();

vaultRouter.get("/vault/server",getServerVault );
vaultRouter.get("/vault/user/:userId", getUserVault);
vaultRouter.post("/vault/user", createUserVault);
vaultRouter.post("/vault/user/update", updateUserVault);

module.exports = vaultRouter;