var express = require('express');
var router = express.Router();

const db = require('../../config/db')

const userService = require('../../services/user/service');

exports.checkToken = router.get('/token', async (req, res) => {
  db(async (err, connection) => {

    try {
      let result = {}
      result.id = req.decoded._id;
      result.name = await userService.getUserName(connection, err, req.decoded._id);

      res.json({
        success: true,
        message: result
      });
    } catch (e) {
      console.log(e);
      res.status(403).json({
        success: false,
        message: e.message
      });
    } finally {
      if (connection) connection.release();
    }
  });

});


exports.login = router.post('/login', async (req, res) => {
  // 요청 기관 : 모든 회원
  // 내용 : user로부터 입력값(id, pw)을 전달 받아서, 해당 정보와 매치되는 회원이 존재하는지 확인하고, 존재하는 경우 토큰을 발급해준다.
  // 특이사항 : jwt 토큰 없이도 요청 가능
  // 개선사항 : pw 암호화
  db(async (err, connection) => {
    try {
      const {
        id,
        password
      } = req.body;
      let token = await userService.login(connection, err, id, password);
      res.json({
        token: token
      });
    } catch (e) {
      console.log(e);
      res.status(403).json({
        success: false,
        message: e.message
      });
    } finally {
      if (connection) connection.release();
    }
  });
});

exports.checkID = router.post('/id', async (req, res) => {
  // 요청 기관 : 모든 회원
  // 내용 : user로부터 입력값(id)을 전달 받아서, 입력한 값의 id가 이미 존재하는지, 존재하지 않는지를 확인한다.
  // 특이사항 : jwt 토큰 없이도 요청 가능
  // 개선사항 :
  db(async (err, connection) => {
    try {
      let chk = await userService.checkIDDuplicated(connection, err, req.query.id);
      if (chk === false) { //중복되지 않았다는 뜻으로 해당 아이디를 사용할 수 있다.
        res.json({
          success: true,
          message: "사용 가능합니다."
        });
      } else {
        res.json({
          success: false,
          message: "이미 사용중입니다."
        });
      }
    } catch (e) {
      console.log(e);
      res.status(403).json({
        success: false,
        message: e.message
      });
    } finally {
      if (connection) connection.release();
    }
  });
});


exports.addUser = router.post('/user', async (req, res) => {
  // 요청 기관 : 모든 회원
  // 내용 : 회원 가입을 할 때 사용된다.
  // 특이사항 : jwt 토큰 없이도 요청 가능
  // 개선사항 : error 발생시 연쇄 반응 가능하도록 cascade 필요.

  db(async (err, connection) => {
    try {

      await connection.beginTransaction();

      console.log(req.body);
      let message = await userService.addUser(connection, err, req.body.info);


      await connection.commit();

      res.json({
        success: true,
        message: "성공적으로 등록되었습니다."
      });
    } catch (e) {
      console.log(e);
      if (connection) connection.rollback();
      res.status(403).json({
        success: false,
        message: e.message
      });
    } finally {
      if (connection) connection.release();
    }
  });

});

exports.patchUser = router.patch('/user', async (req, res) => {
  // 요청 기관 : 모든 회원
  // 내용 : 회원 가입을 할 때 사용된다.
  // 특이사항 : jwt 토큰 없이도 요청 가능
  // 개선사항 : error 발생시 연쇄 반응 가능하도록 cascade 필요.

  db(async (err, connection) => {
    try {

      await connection.beginTransaction();

      let message = await userService.patchUser(connection, err, req.body.info, req.decoded._id);

      await connection.commit();

      res.json({
        success: true,
        message: "성공적으로 등록되었습니다."
      });
    } catch (e) {
      console.log(e);
      if (connection) connection.rollback();
      res.status(403).json({
        success: false,
        message: e.message
      });
    } finally {
      if (connection) connection.release();
    }
  });

});

exports.findUser = router.get('/user', async (req, res) => {

  db(async (err, connection) => {
    try {

      if(req.query.search_text != undefined ){//존재하는 경우
        let friend_list = await userService.findUser(connection, err, req.query.search_text, req.decoded._id);
        res.json({
          success: true,
          message: friend_list
        });

      }else{
        let myinfo = await userService.getUser(connection, err, req.decoded._id);
        res.json({
          success: true,
          message: myinfo
        })
      }




    } catch (e) {
      console.log(e);
      res.status(403).json({
        success: false,
        message: e.message
      });
    } finally {
      if (connection) connection.release();
    }
  });

});
