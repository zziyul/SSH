// // /**
// //  * TODO(developer): Uncomment the following lines before running the sample.
// //  */
// // const bucketName = 'image_save';
// // const filename = './config/test.png';
// //
// // // Imports the Google Cloud client library
// // const {Storage} = require('@google-cloud/storage');
// //
// // const projectId = 'vocal-ceiling-282506';
// // const keyFilename = './config/sqltest-1bcbe8dc0516.json';
// // // Creates a client
// // // const storage = new Storage({projectId, keyFilename});
// // const storage = new Storage({prokectId : projectId, keyFilename : keyFilename});
// //
// // // var uploadFile = async function uploadFile() {
// // var uploadFile = async function() {
// //   // Uploads a local file to the bucket
// //   console.log(storage);
// //   console.log("!!!!!!!!!!!!!!check the storage !!!!!!!!!!")
// //   await storage.bucket(bucketName).upload(filename, {
// //     // Support for HTTP requests made with `Accept-Encoding: gzip`
// //     gzip: true,
// //     // By setting the option `destination`, you can change the name of the
// //     // object you are uploading to a bucket.
// //     metadata: {
// //       // Enable long-lived HTTP caching headers
// //       // Use only if the contents of the file will never change
// //       // (If the contents will change, use cacheControl: 'no-cache')
// //       cacheControl: 'public, max-age=31536000',
// //     },
// //   });
// //
// //   console.log(`${filename} uploaded to ${bucketName}.`);
// // }
// //
// //
// // async function downloadFile() {
// //   const options = {
// //     // The path to which the file should be downloaded, e.g. "./file.txt"
// //     destination: destFilename,
// //   };
// //
// //   // Downloads the file
// //   await storage.bucket(bucketName).file(srcFilename).download(options);
// //
// //   console.log(
// //     `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
// //   );
// // }
// //
// // module.exports = uploadFile;
//
//
//
//
//
//
//
//
//
//

const CLOUD_BUCKET = 'vocal-ceiling-282506_bucket';

// [START bookshelf_cloud_storage_client]
const {Storage} = require('@google-cloud/storage');
const path = require("path");
//
// const storage = new Storage();
// const bucket = storage.bucket(CLOUD_BUCKET);


const storage = new Storage({
  keyFilename: path.join(__dirname, "../vocal-ceiling-282506-b952f42b0a25.json"),
  // keyFilename: "../vocal-ceiling-282506-b952f42b0a25.json",
  projectId: "vocal-ceiling-282506"
});
const bucket = storage.bucket("saltriver");

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}
// [END public_url]

// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have two new properties:
// * ``cloudStorageObject`` the object name in cloud storage.
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START process]
function sendUploadToGCS(file) {

  // console.log(bucket)


  if (!file) {//파일이 없다면
    // reject(new Error('Error in sendUploadToGCS'));
    console.log("error occured")

    // return next();
  }

  const gcsname = Date.now() + file.originalname;
  // const gcsname = Date.now() + "1234";
  const o_file = bucket.file(gcsname);

  const stream = o_file.createWriteStream({
    metadata: {
      contentType: file.mimetype,
      // contentType: file,
    },
    resumable: false,
  });

  stream.on('error', err => {
    file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', async () => {
    file.cloudStorageObject = gcsname;
    await file.makePublic();
    file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    next();
  });

  // stream.end(file);
  stream.end(file.buffer);
}
// [END process]

// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory.
// This makes it straightforward to upload to Cloud Storage.
// [START multer]
const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
});
// [END multer]

module.exports = {
  getPublicUrl,
  sendUploadToGCS,
  multer,
};
