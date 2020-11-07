const relationQuery = require('./query')
const userService = require('../user/service');

exports.addRelation = async (connection, err, send, receive) => {
  // 입력값 : send(요청한 기관), receive(요청을 받을 기관)
  // 리턴값 : insertId
  // 내용 : 특정 기관에게 관계 요청을 해준다.
  return new Promise(function(resolve, reject) {
    connection.query(relationQuery.addRelation, [send, receive, "요청"], (err, rows) => {
      try {
        if (err) {
          throw err;
        }
        resolve(rows.insertId); // 결과는 rows에 담아 전송
      } catch (err) {
        console.log(err);
        reject(new Error('Error in addRelation'));
      }
    });
  });
}

exports.getRelation = async (connection, err, _id) => {
  return new Promise(function(resolve, reject) {
    connection.query(relationQuery.getRelation, [_id, _id], async (err, rows) => {
      try {
        if (err) {
          throw err;
        }
        let result = [];
        for (let i = 0; i < rows.length; i++) {
          let sub_result = {};
          sub_result.idx = rows[i].idx;
          sub_result.send = rows[i].send;
          sub_result.send_name = await userService.getUserName(connection, err, rows[i].send);
          sub_result.receive = rows[i].receive;
          sub_result.receive_name = await userService.getUserName(connection, err, rows[i].receive);
          sub_result.req_date = rows[i].req_date;
          sub_result.res_date = rows[i].res_date;
          sub_result.status = rows[i].status;
          result.push(sub_result);
        }
        console.log(result);
        resolve(result);
      } catch (err) {
        console.log(err);
        reject(new Error('Error in getRelation'));
      }
    });
  });
}

exports.patchRelation = async (connection, err, stat, idx) => {
  // 입력값 : stat(변경하고자 하는 idx), idx(해당 관계가 저장된 고유 번호)
  // 리턴값 : rows
  // 내용 : 특정 관계에 대해서 사용자의 요청을 반영하여 상태를 변경한다.
  return new Promise(function(resolve, reject) {
    connection.query(relationQuery.patchRelation, [stat, idx], (err, rows) => {
      try {
        if (err) {
          throw err;
        }
        resolve(rows); // 결과는 rows에 담아 전송
      } catch (err) {
        console.log(err);
        reject(new Error('Error in patchRelation'));
      }
    });
  });

}

exports.deleteRelation = async (connection, err, idx) => {
  // 입력값 : idx(특정 관계를 지칭)
  // 리턴값 :
  // 내용 : 특정 관계 인덱스를 삭제한다.
  return new Promise(function(resolve, reject) {
    connection.query(relationQuery.deleteRelation, [idx], (err, rows) => {
      try {
        if (err) {
          throw err;
        }
        resolve(); // 결과는 rows에 담아 전송
      } catch (err) {
        console.log(err);
        reject(new Error('Error in deleteRelation'));
      }
    });
  });
}


exports.getReceiveRelation = async (connection, err, c_code) => {
  // 입력값 : c_code(corporationCode)
  // 리턴값 : corporationRelationList
  // 내용 : c_code기관이 요청한 relation들을 모두 받아온다.
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM corp_relation WHERE receive = (?)", [c_code], (err, rows) => {
      try {
        if (err) {
          throw err;
        }
        let result = [];
        for (let i = 0; i < rows.length; i++) {
          let sub_result = {};
          sub_result.send = rows[i].send;
          sub_result.receive = rows[i].receive;
          sub_result.req_date = rows[i].req_date;
          sub_result.res_date = rows[i].res_date;
          sub_result.status = rows[i].status;
          result.push(sub_result);
        }
        resolve(result);
      } catch (err) {
        console.log(err);
        reject(new Error('Error in getReceiveRelation'));
      }
    });
  });
}

exports.getSendRelation = async (connection, err, c_code) => {
  // 입력값 : c_code(corporationCode)
  // 리턴값 : corporationRelationList
  // 내용 : c_code기관으로 요청 받은 relation들을 모두 받아온다.
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM corp_relation WHERE send = (?)", [c_code], (err, rows) => {
      try {
        if (err) {
          throw err;
        }
        let result = [];
        for (let i = 0; i < rows.length; i++) {
          let sub_result = {};
          sub_result.send_code = rows[i].send;
          sub_result.receive_code = rows[i].receive;
          sub_result.req_date = rows[i].req_date;
          sub_result.res_date = rows[i].res_date;
          sub_result.status = rows[i].status;
          result.push(sub_result);
        }
        resolve(result);
      } catch (err) {
        console.log(err);
        reject(new Error('Error in getSendRelation'));
      }
    });
  });
}


exports.checkRelation = async (connection, err, first, second) => {
  // 입력값 : first, second (모두 c_code로 입력된 두 회사의 연결 관계를 확인한다.)
  // 리턴값 : true or false(등록되어 있는 경우 true 아닌 경우 false)
  // 내용 : 입력된 두 회사가 relation db에 이미 등록되어 있는 관계인지 확인한다.
  return new Promise(function(resolve, reject) {
    connection.query(relationQuery.checkRelation, [first, second, second, first], (err, rows) => {
      try {
        if (err) {
          throw err;
        }
        if (rows.length > 0) { //관계가 등록되었다.
          resolve(true);
        } else { //관계가 등록 되지 않았다.
          resolve(false);
        }
      } catch (err) {
        console.log(err);
        reject(new Error('Error in checkRelation'));
      }
    });
  });
}

exports.checkRelationIdx = async (connection, err, idx, c_code) => {
  // 입력값 : idx(요청된 관계를 지칭하는 인덱스), c_code(현재 요청을 보낸 기관 코드)
  // 리턴값 : idx or 0(연결되어 있는 경우 idx 아닌 경우 0)
  // 내용 : 특정 idx(관계)에 대하여 접속한 c_code가 접근 권한이 존재하는지 파악하고, 등록되어 있는 경우 해당 idx(고유 번호)를 넘겨준다.
  return new Promise(function(resolve, reject) {
    connection.query(relationQuery.checkRelationIdx, [idx, c_code, c_code], (err, rows) => {
      try {
        if (err) {
          throw err;
        }
        if (rows.length === 0) { //관계가 등록되지 않았다.
          resolve(0);
        } else { //관계가 등록 되었다.
          resolve(rows[0].idx);
        }
      } catch (err) {
        console.log(err);
        reject(new Error('Error in checkRelationIdx'));
      }
    });
  });
}

exports.checkRelationConnected = async (connection, err, first, second) => {
  // 입력값 : first, second (모두 c_code로 입력된 두 회사의 연결 관계를 확인한다.)
  // 리턴값 : true or false(연결되어 있는 경우 true 아닌 경우 false)
  // 내용 : 입력된 두 회사가 relation db에 이미 등록되어 있는 관계인지 확인한다.
  return new Promise(function(resolve, reject) {
    connection.query(relationQuery.checkRelationConnected, [first, second, second, first], (err, rows) => {
      try {
        if (err) {
          throw err;
        }
        if (rows.length > 0) { //관계가 연결되었다.
          resolve(true);
        } else { //관계가 연결 되지 않았다.
          resolve(false);
        }
      } catch (err) {
        console.log(err);
        reject(new Error('Error in checkRelationConnected'));
      }
    });
  });
}


exports.findFriend = async (connection, err, id, search_text) => {
  // 입력값 : first, second (모두 c_code로 입력된 두 회사의 연결 관계를 확인한다.)
  // 리턴값 : true or false(연결되어 있는 경우 true 아닌 경우 false)
  // 내용 : 입력된 두 회사가 relation db에 이미 등록되어 있는 관계인지 확인한다.
  return new Promise(async function(resolve, reject) {
    connection.query("SELECT * FROM FRIEND WHERE ((send = (?) AND receive LIKE '%"+ search_text + "%') OR (send LIKE '%"+ search_text + "%' AND receive = (?))) AND status = '승인'", [id, id], async (err, rows) => {
      try {
        if (err) {
          throw err;
        }
        let result = []
        for (let i = 0; i < rows.length; i++) {
          let sub_result = {};
          sub_result.idx = rows[i].idx;
          if(rows[i].send == id){//내가 보낸 경우라면, 친구꺼를 가져와야함
            sub_result.friend_id = rows[i].receive;
            sub_result.friend_name = await userService.getUserName(connection, err, rows[i].receive);
          }else{
            sub_result.friend_id = rows[i].send;
            sub_result.friend_name = await userService.getUserName(connection, err, rows[i].send);
          }
          result.push(sub_result);
        }

        if (result.length > 0) { //관계가 연결되었다.
          resolve(result);
        } else { //관계가 연결 되지 않았다.
          resolve("No contents");
        }
      } catch (err) {
        console.log(err);
        reject(new Error('Error in findFriend'));
      }
    });
  });
}
