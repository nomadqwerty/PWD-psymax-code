const Folder = require('../models/Folder');
const { UserSchema } = require('../models/userModel');
const UserVault = require('../models/UserVault');
const ServerVault = require('../models/ServerVault');

exports.getFileDetails = async (req, res) => {
  try {
    // get user details: password, epassword.
    // get uservault
    // get file that is to be downloaded.
    const { userId, name } = req.body;
    console.log(userId, name);
    const user = await UserSchema.findOne({ _id: userId });

    if (user) {
      const userVault = await UserVault.findOne({
        userId: userId,
        type: 'main',
      });
      const userVaultUpdate = await UserVault.findOne({
        userId: userId,
        type: 'update',
      });

      if (userVault) {
        const userFolder = await Folder.findOne({ userId: userId });
        if (userFolder) {
          const serverVault = await ServerVault.find();

          const fileIdx = userFolder.names.indexOf(name);

          const fileFound = userFolder.files[fileIdx];

          let detailObject = {
            password: user.password,
            ePassword: user.emergencyPassword,
            vault: userVault,
            fileData: fileFound,
            serverVault: serverVault[0],
            updateVault: userVaultUpdate,
          };

          return res.status(200).json(detailObject);
        }
      }
    }

    res.end('here');
  } catch (error) {
    res.status(405).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.storeFile = async (req, res) => {
  try {
    const fileData = req.body?.file;
    const fileName = req.body?.name;
    const userId = req.body?.userId;

    if (fileData && userId) {
      console.log(fileData, userId);
      const folder = await Folder.findOne({ userId: userId });

      if (folder) {
        let reducedFiles;
        let reducedNames;

        reducedFiles = [...folder.files, fileData];
        reducedNames = [...folder.names, fileName];

        folder.files = reducedFiles;
        folder.names = reducedNames;

        await folder.save();
        return res.status(200).json({
          status: 'success',
          message: 'stored file',
        });
      } else {
        throw new Error('no folder found.');
      }
    } else {
      throw new Error('required fields are missing');
    }
  } catch (error) {
    console.log(error.message);
    return res.status(405).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.createFolder = async (req, res) => {
  try {
    const userId = req.body?.userId;
    const hasFolder = await Folder.findOne({ userId: userId });

    if (!hasFolder) {
      await Folder.create({
        userId: userId,
        files: [],
        names: [],
      });
      return res.status(200).json({
        status: 'success',
        message: 'stored created',
      });
    } else {
      throw new Error('folder exists');
    }
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
