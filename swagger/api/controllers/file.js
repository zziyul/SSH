var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path')
var appDir = path.dirname(require.main.filename);
const dateObjectHelper = require('../../services/helper/dateObject')

const fileService = require('../../services/file/file');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/draw_result')
  },
  filename: function (req, file, cb) {

    let extra = file.originalname.toString().split('.')[1];
     if(extra == "jpeg" || extra == "jpg" || extra == "png"){
        let date = new Date();
        date = dateObjectHelper.dateObjecttoSuccessiveString(date) + "." + extra;
        cb(null, date)
    }else{
        throw new Error('Invalid image type')
    }

  }
})
var upload = multer({ storage: storage }).single('file')



exports.addimageFile = router.post('/file', async (req, res) => {


  try{

                console.log("ff ", req.file);

       upload(req, res, (err) => {
           try{

               if(err) throw err;

               // console.log("ff ", req.body);

               res.json(req.file);

           }catch(err){

               console.log(err);

               res.status(403).json({
                   success : false,
                   message : err.message
               })
           }
       })

   }catch(err){

       console.log(err);

       res.status(403).json({
           success : false,
           message : "Error in image uploading"
       })
   }

});


exports.getImageFile = router.get('/file/:fileName', (req, res) => {
    let fileName = req.params.fileName;
    let dir = path.join(appDir, "uploads","draw_result", fileName);
    console.log('dr ', dir);
    fs.readFile(dir, (err, data) => {


            if(err){

                console.log(err);

                res.status(403).json({
                    success : false,
                    message : err.message
                })

            }

             if(fileName.split('.')[1] == "jpeg" || fileName.split('.')[1] == "jpg"){
                 res.writeHead(200, {'Content-Type':'image/jpeg'})
             }else if(fileName.split('.')[1] == "png"){
                 res.writeHead(200, { 'Content-Type': 'image/png' });
             }else{
                 throw new Error ('invalid type image')
             }
            res.end(data)


    })
})
