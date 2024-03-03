const { Schema, model } = require("mongoose");

const userVaultSchema = new Schema({
  userId:{
    type: String,
    required: [true, 'user vault needs use id'],
    unique: true
  },
  isEncrypted:{
    type:Boolean,
    required:[true, 'indicate if vault is encrypted']
  },
    documentPassword: {
        type: String,
        default: 'aj8U@eWAWIPKXd4Ow8?ND!9u',
      },
      passwords:{
        type:Buffer,
      },
      clients:{
        type:Buffer,
      },
      backupPasswords:{
        type:Buffer,
      },
      backupClients:{
        type:Buffer,
      }
});

const UserVault = model("UserVault", userVaultSchema);


module.exports = UserVault;
