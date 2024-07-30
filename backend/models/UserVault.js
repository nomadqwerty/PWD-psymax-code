const { Schema, model } = require("mongoose");

const userVaultSchema = new Schema({
  userId: {
    type: String,
    required: [true, "Which User does the vault belong to?"],
  },
  type: {
    type: String,
    required: [true, "vault needs a type"],
    enum: ["update", "main", "archive"],
  },
  isEncrypted: {
    type: Boolean,
    required: [true, "indicate if vault is encrypted"],
  },
  passwords: {
    type: Buffer,
  },
});

const UserVault = model("UserVault", userVaultSchema);

module.exports = UserVault;