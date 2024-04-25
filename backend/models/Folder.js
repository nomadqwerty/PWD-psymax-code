const { Schema, model } = require("mongoose");

const folderSchema = new Schema({
    userId:{type:String,required: [true, "Which User does the vault belong to?"]},
  files: {
    type: [Buffer],
  },
  names:{
    type:[String]
  }
});

const Folder = model("Folder", folderSchema);

module.exports = Folder;