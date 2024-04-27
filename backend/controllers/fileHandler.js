const Folder = require('../models/Folder')
exports.storeFile = async (req,res)=>{

    try {
        const fileData = req.body?.file;
        const fileName = req.body?.name
        const userId = req.body?.userId;

        if(fileData && userId){
            // console.log(fileData,userId);
            const folder = await Folder.findOne({userId:userId});

            if(folder){
                let reducedFiles;
                let reducedNames;
               
                reducedFiles = [...folder.files, fileData];
                reducedNames = [...folder.names, fileName];
                
                folder.files = reducedFiles;
                folder.names = reducedNames;

                await folder.save();
            }else{
                const userFolder = {userId:userId, files:[fileData], names:[fileName]};
                const newFolder = await Folder.create(userFolder);
            }
            return  res.status(200).json({
                status: "success",
                message: 'stored file',
              });

        }else{
            throw new Error('required fields are missing')

        }

    } catch (error) {
        return res.status(405).json({
            status: "fail",
            message: error.message,
          });
    }
}