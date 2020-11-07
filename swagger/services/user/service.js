const jwt = require('jsonwebtoken');
const secret = require("../../config/secret");

const userQuery = require('./query')


exports.login = async (connection, err, id, password) => {
  return new Promise(function(resolve, reject) {
    connection.query(userQuery.checkUserIdAndPW, [id, password], (err, rows) => {
      if (err) {
        throw err;
      }
      if (rows.length > 0) { //입력된 id, pw로 정보가 존재하는 경우 -> jwt 발급
          const p = new Promise((resolve, reject) => {
            jwt.sign({//id, pw, code로 만들어주기
              _id: id,
              _password: password
            }, secret.secretKey, {
              expiresIn: '30d',
              issuer: 'saltriver.com',
              subject: 'userInfo'
            }, (err, token) => {
              if (err) reject(err)
              resolve(token);
              console.log(token);
            });
          })
          resolve(p);
      } else { //로그인 실패
        reject(new Error('login failed'));
      }
    });
  });
}

exports.checkIDDuplicated = async (connection, err, id) => {
  //입력값 : id
  //리턴값 : true/false (사용중 - 사용 불가 /미사용중 - 사용 가능)
  //내용 : 입력된 id가 이미 사용 중인지 아닌지를 판별한다.
  return new Promise(function(resolve, reject) {
    connection.query(userQuery.checkIDDuplicated, [id], (err, rows) => { //초기 관계를 생성할 때에는 무조건 0으로 셋팅
      try {
        if (err) {
          throw err;
        }
        if (rows.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.log(err);
        reject(new Error('Error in checkIDDuplicated'));
      }
    });
  });
}


exports.getUserName = async (connection, err, id) => {
  //입력값 : id
  //리턴값 : true/false (사용중 - 사용 불가 /미사용중 - 사용 가능)
  //내용 : 입력된 id가 이미 사용 중인지 아닌지를 판별한다.
  return new Promise(function(resolve, reject) {
    connection.query(userQuery.getUserName, [id], (err, rows) => { //초기 관계를 생성할 때에는 무조건 0으로 셋팅
      try {
        if (err) {
          throw err;
        }
        if (rows.length > 0) {
          resolve(rows[0].name);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.log(err);
        reject(new Error('Error in getUserName'));
      }
    });
  });
}


exports.addUser = async (connection, err, info) => {
  // 입력값 : corporationCode, id
  // 리턴값 : rows.insertId
  // 내용 : 각각 등록된 user 정보와 corporation 정보를 하나의 테이블에 함께 저장해준다.(연결 정보 명시)

  return new Promise(function(resolve, reject) {
    connection.query( userQuery.addUser, [info.id, info.pw, info.email, info.name, info.phone], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows.insertId);
      }catch(err){
        console.log(err);
        reject(new Error('Error in addUser'));
      }
    });
  });
}


exports.patchUser = async (connection, err, info, id) => {
  // 입력값 : corporationCode, id
  // 리턴값 : rows.insertId
  // 내용 : 각각 등록된 user 정보와 corporation 정보를 하나의 테이블에 함께 저장해준다.(연결 정보 명시)

  return new Promise(function(resolve, reject) {
    console.log(info)
    connection.query( userQuery.patchUser, [info.pw, info.email, info.name, info.phone, id], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows.insertId);
      }catch(err){
        console.log(err);
        reject(new Error('Error in patchUser'));
      }
    });
  });
}

exports.getUser = async (connection, err,  _id) => {
  // 입력값 : corporationCode, id
  // 리턴값 : rows.insertId
  // 내용 : 각각 등록된 user 정보와 corporation 정보를 하나의 테이블에 함께 저장해준다.(연결 정보 명시)

  return new Promise(function(resolve, reject) {
    connection.query( "SELECT * FROM USER WHERE id = (?)", [_id],(err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows);
      }catch(err){
        console.log(err);
        reject(new Error('Error in addUser'));
      }
    });
  });
}


exports.findUser = async (connection, err, search_text, _id) => {
  // 입력값 : corporationCode, id
  // 리턴값 : rows.insertId
  // 내용 : 각각 등록된 user 정보와 corporation 정보를 하나의 테이블에 함께 저장해준다.(연결 정보 명시)

  return new Promise(function(resolve, reject) {
    connection.query( "SELECT * FROM USER LEFT JOIN FRIEND on (USER.id = FRIEND.send AND FRIEND.receive = (?)) OR (USER.id = FRIEND.receive AND FRIEND.send = (?)) WHERE (name LIKE '%" + search_text +"%' OR id LIKE '%" + search_text +"%') AND id NOT IN (?)", [_id, _id, _id],(err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows);
      }catch(err){
        console.log(err);
        reject(new Error('Error in addUser'));
      }
    });
  });
}
