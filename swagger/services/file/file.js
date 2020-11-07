const images = require('../../config/file');

exports.addimageFile = async (connection, err, file) => {
  // 입력값 : send(요청한 기관), receive(요청을 받을 기관)
  // 리턴값 : insertId
  // 내용 : 특정 기관에게 관계 요청을 해준다.
  return new Promise(function(resolve, reject) {
    console.log(file)
    images.sendUploadToGCS(file);

  });
}
