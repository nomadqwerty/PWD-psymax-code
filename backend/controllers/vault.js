const ServerVault = require("../models/ServerVault");
const UserVault = require("../models/UserVault");
const ClientVault = require("../models/ClientVault");
const { UserSchema } = require("../models/userModel");

exports.getServerVault = async (req, res, next) => {
  try {
    let vault = await ServerVault.find();
    if (vault[0]) {
      let response = {
        status_code: 200,
        message: "",
        data: vault[0],
      };

      res.status(200).json(response);
    } else {
      let response = {
        status_code: 404,
        message: "not found",
      };
      res.status(404).json(response);
    }
  } catch (error) {
    res.status(405).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.createUserVault = async (req, res) => {
  try {
    // TODO: save user vault to storage.
    let userVault = req.body;

    let existingVault = await UserVault.findOne({ userId: userVault.userId });
    let existingClientVault = await ClientVault.findOne({
      userId: userVault.userId,
    });

    if (!existingVault && !existingClientVault) {
      console.log("not found");
      let fileVault = { ...userVault };
      let clientVault = { ...userVault };

      delete fileVault.clients;
      delete clientVault.passwords;

      let newVault = await UserVault.create(fileVault);
      let newClientVault = await ClientVault.create(clientVault);
      console.log("main...");
      fileVault.type = "update";
      clientVault.type = "update";

      let newUpdateVault = await UserVault.create(fileVault);
      let newClientUpdateVault = await ClientVault.create(clientVault);

      console.log("update...");
      fileVault.type = "archive";
      clientVault.type = "archive";

      let newArchiveVault = await UserVault.create(fileVault);
      let newClientArchiveVault = await ClientVault.create(clientVault);
      console.log("archive...");

      let response = {
        status_code: 204,

        message: "vaults created",
      };

      return res.status(200).json(response);
    } else {
      let response = {
        status_code: 200,

        message: "user vault already exists",
      };

      return res.status(200).json(response);
    }
  } catch (error) {
    return res.status(405).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.updateUserVault = async (req, res) => {
  try {
    let userVault = req.body?.fileVault;
    let clientVault = req.body?.clientVault;
    let recoveryKey = req.body?.recoveryKey;

    let user = await UserSchema.findOne({ _id: userVault[0].userId });

    let existingVault = await UserVault.find({ userId: userVault[0].userId });

    let existingClientVault = await ClientVault.find({
      userId: userVault[0].userId,
    });
    // TODO: check if all vaults exist.

    if (
      existingVault.length === 3 &&
      existingClientVault.length === 3 &&
      user
    ) {
      console.log("found");
      userVault.forEach(async (e) => {
        await UserVault.findOneAndUpdate(
          { userId: e.userId, type: e.type },
          e,
          { new: true }
        );
      });

      clientVault.forEach(async (e) => {
        await ClientVault.findOneAndUpdate(
          { userId: e.userId, type: e.type },
          e,
          { new: true }
        );
      });

      user.recoveryKey = recoveryKey;

      await user.save();

      let response = {
        status_code: 200,

        data: "updated Vaults",
      };

      return res.status(200).json(response);
    } else {
      let response = {
        status_code: 404,

        message: "user vault does not exists",
      };

      return res.status(404).json(response);
    }
  } catch (error) {
    console.log(error);
    return res.status(405).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getUserVault = async (req, res, next) => {
  try {
    let id = req.params.userId;
    let vault = await UserVault.find({ userId: id });
    let clientVault = await ClientVault.find({ userId: id });
    if (vault.length === 3 && clientVault.length === 3) {
      let response = {
        status_code: 200,
        message: "",
        data: {
          vaults: vault,
          clientVaults: clientVault,
        },
      };
      res.status(200).json(response);
    } else {
      let response = {
        status_code: 200,
        message: "",
      };
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(405).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateMainVault = async (req, res, next) => {
  try {
    let reqBody = req.body;
    let vaultType = reqBody.vault;
    reqBody.vault = undefined;
    if (vaultType === "file") {
      let fileVault = await UserVault.findOneAndUpdate(
        {
          userId: reqBody.userId,
          type: reqBody.type,
        },
        reqBody,
        { new: true }
      );
    }
    if (vaultType === "client") {
      let clientVault = await ClientVault.findOneAndUpdate(
        {
          userId: reqBody.userId,
          type: reqBody.type,
        },
        reqBody,
        { new: true }
      );
    }
    // let clientVault = await ClientVault.findOne({
    //   userId: reqBody.userId,
    //   type: reqBody.type,
    // });

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(405).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateArchiveVault = async (req, res, next) => {
  try {
    let reqBody = req.body;
    let vaultType = reqBody.vault;
    reqBody.vault = undefined;
    if (vaultType === "file") {
      let archive = {
        userId: reqBody.userId,
        type: "archive",
        passwords: reqBody.passwordsArchive,
      };

      let main = {
        userId: reqBody.userId,
        type: "main",
        passwords: reqBody.passwordsMain,
      };

      let fileVaultArchive = await UserVault.findOneAndUpdate(
        {
          userId: archive.userId,
          type: archive.type,
        },
        archive,
        { new: true }
      );
      let fileVaultMain = await UserVault.findOneAndUpdate(
        {
          userId: main.userId,
          type: main.type,
        },
        main,
        { new: true }
      );
    }
    if (vaultType === "client") {
      let archive = {
        userId: reqBody.userId,
        type: "archive",
        clients: reqBody.clientsArchive,
      };

      let main = {
        userId: reqBody.userId,
        type: "main",
        clients: reqBody.clientsMain,
      };

      let clientVaultArchive = await UserVault.findOneAndUpdate(
        {
          userId: archive.userId,
          type: archive.type,
        },
        archive,
        { new: true }
      );
      let clientVaultMain = await UserVault.findOneAndUpdate(
        {
          userId: main.userId,
          type: main.type,
        },
        main,
        { new: true }
      );
    }
    // let clientVault = await ClientVault.findOne({
    //   userId: reqBody.userId,
    //   type: reqBody.type,
    // });

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(405).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getStatus = async (req, res, next) => {
  try {
    let response = {
      status_code: 200,
      message: "online",
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
