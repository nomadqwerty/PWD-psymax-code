const Folder = require('../models/Folder')
exports.storeFile = async (req,res)=>{

    try {
        const fileData = req.body?.file;
        const userId = req.body?.userId;

        if(fileData && userId){
            // console.log(fileData,userId);
            const folder = await Folder.findOne({userId:userId});

            if(folder){
                const reducedFiles = [...folder.files, fileData];
                folder.files = reducedFiles;
                await folder.save();
            }else{
                const userFolder = {userId:userId, files:[fileData]}
                const newFolder = await Folder.create(userFolder)
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