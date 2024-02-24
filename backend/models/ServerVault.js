const { Schema, model } = require("mongoose");

const serverVaultSchema = new Schema({
 masterKeySalt: { type: String, default: "$2b$10$PWvcThLfq1UOFMX720GiLe" },
 dualKeySalt: { type: String, default: "$2b$10$8mrbTvxDcVK4hTaAZHoEae" },
 fileSalt: { type: String, default: '$2b$10$qB7B3vNwjIUxSSXcAG2KOu' },
});

const ServerVault = model("ServerVault", serverVaultSchema);



module.exports = ServerVault;
