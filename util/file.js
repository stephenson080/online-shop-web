const fs = require("fs")

exports.delefile = filePath =>{
    fs.unlink(filePath, (err)=>{
        if(err){
            throw err
        }
    })
}