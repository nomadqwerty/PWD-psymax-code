const ServerVault = require('../models/ServerVault')
const UserVault = require('../models/UserVault')

exports.getServerVault = async (req, res, next) => {
    try {
        let vault = await ServerVault.find()
        console.log(vault[0],'vault')
        if(vault[0]){
            let response = {
                status_code: 200,
                message: '',
                data: vault[0],
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
exports.getUserVault = async (req, res, next) => {
    try {
        let id = req.params.userId
        console.log(id)
        let vault = await UserVault.findOne({userId:id})
        console.log(vault,'vault')
        if(vault){
            let response = {
                status_code: 200,
                message: '',
                data: vault,
              };
            res.status(200).json(response);
        }else{
          let response = {
            status_code: 200,
            message: '',
            
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