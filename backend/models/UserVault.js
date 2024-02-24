const { Schema, model } = require("mongoose");

const userVaultSchema = new Schema({
  userId:{
    type: String,
    required: [true, 'user vault needs use id']
  },
    documentPassword: {
        type: String,
        default: 'aj8U@eWAWIPKXd4Ow8?ND!9u',
      },
      passwords:{
        type:Array,
      },
      backupPasswords:{
        type:Array,
      }
});

const UserVault = model("UserVault", userVaultSchema);


module.exports = UserVault;
