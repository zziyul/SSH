var express = require('express');
var router = express.Router();

const db = require('../../config/db')

const relationService = require('../../services/friend/service')
const userService = require('../../services/user/service')

exports.addRelations = router.post('/relation', async (req, res) => {
  // 요청 : 모든 회원
  // 내용 : 다른 기관에 관계를 요청한다.
  // 특이사항 :
  // 개선사항 :

  db(async (err, connection) => {
    try {
      let dup_chk = false; //중복 체크 위한 필드
      let dup_str = ''; //중복 내용을 담아준다.(error 메시지 활용)
        if (req.body.friend_id !== req.decoded._id) { //요청하는 기관과 요청 받는 기관이 같으면 안된다.
          //let idx = await relationService.checkRelation(connection, err, req.decoded._id, req.body.friend_id);
          //if (!idx) { //연결 되어 있지 않은 경우에만
            await connection.beginTransaction();

            await relationService.addRelation(connection, err, req.decoded._id, req.body.id);

          // } else { //이미 연결되어 있는 경우
          //   dup_chk = true;
          //   dup_str += ' ' + await userService.getUserName(connection, err, friend_id) + ',';
          // }
        }
      if (!dup_chk) {

        await connection.commit();

        res.json({
          success: true,
          message: "Success"
        });
      } else {
        res.json({
          message: false,
          message: "이미 등록된 " + dup_str.substring(0, dup_str.length - 1) + "을(를) 제외한 모든 관계들을 요청하였습니다."
        })
      }
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

exports.getRelations = router.get('/relation', async (req, res) => {
  // 요청 : 모든 회원
  // 내용 : 자신과 연결된 모든 관계들을 받아온다.
  // 특이사항 :
  // 개선사항 :

  db(async (err, connection) => {
    try {

      let result
      if(req.query.search_text != undefined ){//존재하는 경우

         result = await relationService.findFriend(connection, err, req.decoded._id, req.query.search_text);

      }else{
        result = await relationService.getRelation(connection, err, req.decoded._id);
        for (let i = 0; i < result.length; i++) {
          result[i]["send_name"] = await userService.getUserName(connection, err, result[i].send);
          result[i]["receive_name"] = await userService.getUserName(connection, err, result[i].receive);
        }
      }


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

exports.setRelation = router.patch('/relation', async (req, res) => {
  db(async (err, connection) => {
    try {

      let chk = await relationService.checkRelationIdx(connection, err, req.body.idx, req.decoded._id);

      if (chk) {

        await connection.beginTransaction();

        await relationService.patchRelation(connection, err, req.body.stat, req.body.idx);

        await connection.commit();

        res.json({
          success: true,
          message: "Success"
        });
      } else {
        res.json({
          success: false,
          message: "올바르지 않은 요청입니다.(등록된 관계가 없음)"
        });
      }
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

exports.deleteRelation = router.delete('/relation', async (req, res) => {

  db(async (err, connection) => {
    try {
      let idx = await relationService.checkRelationIdx(connection, err, req.query.idx, req.decoded._id); //이미 등록된 관계인지 확인
      if (idx !== 0) { //해당 relation이 이미 등록된 경우에만 수행할 수 있는 작업이다.

        await connection.beginTransaction();

        await relationService.deleteRelation(connection, err, idx);

        await connection.commit();

        res.json({
          success: true,
          message: "Success"
        });
      } else {
        res.json({
          success: false,
          message: "비정상적인 접근입니다."
        });
      }
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
