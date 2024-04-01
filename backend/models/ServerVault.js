const { Schema, model } = require("mongoose");

const serverVaultSchema = new Schema({
  masterKeySalt: { type: String, default: "$2b$10$PWvcThLfq1UOFMX720GiLe" },
  dualKeySalt: { type: String, default: "$2b$10$8mrbTvxDcVK4hTaAZHoEae" },
  fileSalt: { type: String, default: "$2b$10$qB7B3vNwjIUxSSXcAG2KOu" },
  documentPassword: {
    type: String,
    default: "aj8U@eWAWIPKXd4Ow8?ND!9u",
  },
});

const ServerVault = model("ServerVault", serverVaultSchema);

ServerVault.find().then((res) => {
  if (res.length <= 0) {
    ServerVault.create({})
      .then((res) => {
        console.log("vault created");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

module.exports = ServerVault;
