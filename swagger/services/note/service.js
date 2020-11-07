const jwt = require('jsonwebtoken');
const secret = require("../../config/secret");

const noteQuery = require('./query')


exports.addNote = async (connection, err, _id, info) => {

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.addNote, [_id, info.url], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows.insertId);
      }catch(err){
        console.log(err);
        reject(new Error('Error in addNote'));
      }
    });
  });
}

exports.patchNote = async (connection, err, idx, info) => {
//소유 관계 확인 필요(*)
  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.addNote, [idx, info.url, info.draw_url], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows.insertId);
      }catch(err){
        console.log(err);
        reject(new Error('Error in patchNote'));
      }
    });
  });
}

exports.getNotes = async (connection, err, _id) => {
  // 입력값 : corporationCode, id
  // 리턴값 : rows.insertId
  // 내용 : 각각 등록된 user 정보와 corporation 정보를 하나의 테이블에 함께 저장해준다.(연결 정보 명시)

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.getNotes, [_id], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows);
      }catch(err){
        console.log(err);
        reject(new Error('Error in getNotes'));
      }
    });
  });
}

exports.getNote = async (connection, err, note_idx) => {
  // 입력값 : corporationCode, id
  // 리턴값 : rows.insertId
  // 내용 : 각각 등록된 user 정보와 corporation 정보를 하나의 테이블에 함께 저장해준다.(연결 정보 명시)

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.getNote, [note_idx], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        let result = {};
        if(rows.length > 0){
          result.idx = rows[0].idx;
          result.url = rows[0].url;
          result.draw_url = rows[0].draw_url;
          result.timestamp = rows[0].timestamp;
        }else{
          result.idx = 0;
        }

        resolve(result);
      }catch(err){
        console.log(err);
        reject(new Error('Error in getNote'));
      }
    });
  });
}

exports.getNoteWithUrl = async (connection, err, url, id) => {
  // 입력값 : corporationCode, id
  // 리턴값 : rows.insertId
  // 내용 : 각각 등록된 user 정보와 corporation 정보를 하나의 테이블에 함께 저장해준다.(연결 정보 명시)

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.getNoteWithUrl, [url, id], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        let result = {};
        if(rows.length > 0){
          result.idx = rows[0].idx;
          result.url = rows[0].url;
          result.draw_url = rows[0].draw_url;
          result.timestamp = rows[0].timestamp;
        }else{
          result.idx = 0;
        }
        resolve(result);
      }catch(err){
        console.log(err);
        reject(new Error('Error in getNoteWithUrl'));
      }
    });
  });
}

exports.getSharingNotes = async (connection, err, _id) => {
  // 입력값 : corporationCode, id
  // 리턴값 : rows.insertId
  // 내용 : 각각 등록된 user 정보와 corporation 정보를 하나의 테이블에 함께 저장해준다.(연결 정보 명시)

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.getSharingNotes, [ _id], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows);
      }catch(err){
        console.log(err);
        reject(new Error('Error in getSharingNotes'));
      }
    });
  });
}

exports.getSharedNotes = async (connection, err, _id) => {
  // 입력값 : corporationCode, id
  // 리턴값 : rows.insertId
  // 내용 : 각각 등록된 user 정보와 corporation 정보를 하나의 테이블에 함께 저장해준다.(연결 정보 명시)

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.getSharedNotes, [ _id], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows);
      }catch(err){
        console.log(err);
        reject(new Error('Error in getSharedNotes'));
      }
    });
  });
}

exports.getSharedNoteList = async (connection, err, _id, _url) => {
  // 입력값 : corporationCode, id
  // 리턴값 : rows.insertId
  // 내용 : 각각 등록된 user 정보와 corporation 정보를 하나의 테이블에 함께 저장해준다.(연결 정보 명시)

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.getSharedNoteList, [ _id, _url], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        let result = [];
        console.log(rows);
        for(let i = 0 ; i < rows.length ; i++){
          let sub_result = {};
          sub_result.id = rows[i].id;
          sub_result.idx = rows[i].idx;
          sub_result.draw_url = rows[i].draw_url;

          result.push(sub_result);
        }
        resolve(result);
      }catch(err){
        console.log(err);
        reject(new Error('Error in getSharedNoteList'));
      }
    });
  });
}

exports.deleteNote = async (connection, err, note_idx, id) => {

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.deleteNote, [note_idx], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows.insertId);
      }catch(err){
        console.log(err);
        reject(new Error('Error in deleteNote'));
      }
    });
  });
}

exports.disconnectSharing = async (connection, err, note_idx, id) => {

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.disconnectSharing, [note_idx, id], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows.insertId);
      }catch(err){
        console.log(err);
        reject(new Error('Error in disconnectSharing'));
      }
    });
  });
}

exports.checkShareUser = async (connection, err, _request_id, _receive_id, note_idx) => {
  // 입력값 : corporationCode, id
  // 리턴값 : rows.insertId
  // 내용 : 각각 등록된 user 정보와 corporation 정보를 하나의 테이블에 함께 저장해준다.(연결 정보 명시)

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.checkShareUser, [ _request_id, _receive_id, note_idx ], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        if(rows.length){
          console.log("false")
          resolve(false)
        }else{
          console.log("true")
          resolve(true)
        }
      }catch(err){
        console.log(err);
        reject(new Error('Error in checkShareUser'));
      }
    });
  });
}


exports.addShareUser = async (connection, err, _request_id, _receive_id, note_idx) => {
  // 입력값 : corporationCode, id
  // 리턴값 : rows.insertId
  // 내용 : 각각 등록된 user 정보와 corporation 정보를 하나의 테이블에 함께 저장해준다.(연결 정보 명시)

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.addShareUser, [ _request_id, _receive_id, note_idx ], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows);
      }catch(err){
        console.log(err);
        reject(new Error('Error in addShareUser'));
      }
    });
  });
}

exports.addDraw = async (connection, err, info) => {

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.addDraw, [info.draw_url, info.note_idx], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows.insertId);
      }catch(err){
        console.log(err);
        reject(new Error('Error in addDraw'));
      }
    });
  });
}

exports.addMemo = async (connection, err, info) => {

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.addMemo, [info.note_idx], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows.insertId);
      }catch(err){
        console.log(err);
        reject(new Error('Error in addMemo'));
      }
    });
  });
}

exports.getMemo = async (connection, err, note_idx) => {

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.getMemo, [note_idx], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        let result = [];
        for(let i = 0 ; i < rows.length ; i++){
          let sub_result = {};
          sub_result.memo_idx = rows[i].idx;
          sub_result.content = rows[i].content;
          sub_result.top = rows[i].top_px;
          sub_result.left = rows[i].left_px;
          sub_result.timestamp = rows[i].timestamp;

          result.push(sub_result)
        }
        resolve(result);
      }catch(err){
        console.log(err);
        reject(new Error('Error in getMemo'));
      }
    });
  });
}

exports.patchMemo = async (connection, err, info) => {

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.patchMemo, [info.content, info.top, info.left, info.memo_idx], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows.insertId);
      }catch(err){
        console.log(err);
        reject(new Error('Error in patchMemo'));
      }
    });
  });
}


exports.deleteMemo = async (connection, err, note_idx) => {

  return new Promise(function(resolve, reject) {
    connection.query( noteQuery.deleteMemo, [note_idx], (err, rows) => {
      try{
        if (err) {
          throw err;
        }
        resolve(rows.insertId);
      }catch(err){
        console.log(err);
        reject(new Error('Error in deleteMemo'));
      }
    });
  });
}
