const ServerVault = require('../models/ServerVault')
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