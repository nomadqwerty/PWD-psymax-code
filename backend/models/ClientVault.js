const { Schema, model } = require("mongoose");

const clientVaultSchema = new Schema({
  userId:{
    type: String,
    required: [true, 'Which User does the vault belong to?'],
  },
  type:{
    type: String,
    required: [true, 'vault needs a type'],
    enum:['update','main','archive']
  },
  isEncrypted:{
    type:Boolean,
    required:[true, 'indicate if vault is encrypted']
  },
clients:{
        type:Buffer,
      },
     
});

const ClientVault = model("ClientVault", clientVaultSchema);


module.exports = ClientVault;
