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

  exports.createUserVault=async (req,res)=>{
    try {
       // TODO: save user vault to storage.
       let userVault = req.body;
       console.log(userVault)
       let existingVault = await UserVault.findOne({userId: userVault.userId})
      
       if(!existingVault){
         console.log('not found')
         let newVault = await UserVault.create(userVault)
         console.log(newVault)
         let response = {
          status_code: 200,
         
          data: newVault,
        };

        return res.status(200).json(response);
       }else{
        let response = {
          status_code: 200,
         
          message:'user vault already exists'
        };

         return res.status(200).json(response);
       }
    } catch (error) {
      return res.status(405).json({
        status: "fail",
        message: error.message,
      });
    }
  }
  exports.updateUserVault=async (req,res)=>{
    try {
       // TODO: save user vault to storage.
       let userVault = req.body;
       console.log(userVault)
       let existingVault = await UserVault.findOne({userId: userVault.userId})
      
       if(existingVault){
         console.log('found')
         let updatedVault = await UserVault.findOneAndUpdate({userId: userVault.userId},userVault,{new:true});
         console.log(updatedVault);
         let response = {
          status_code: 200,
         
          data: updatedVault,
        };

        return res.status(200).json(response);
       }else{
        let response = {
          status_code: 404,
         
          message:'user vault does not exists'
        };

         return res.status(404).json(response);
       }
    } catch (error) {
      console.log(error)
      return res.status(405).json({
        status: "fail",
        message: error.message,
      });
    }
  }
exports.getUserVault = async (req, res, next) => {
    try {
        let id = req.params.userId
        console.log(id)
        let vault = await UserVault.findOne({userId:id})
        console.log(vault,'vaultHere')
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