var express = require('express');
var router = express.Router();

const db = require('../../config/db')

const noteService = require('../../services/note/service')
const userService = require('../../services/user/service')

exports.addNote = router.post('/note', async (req, res) => {

  db(async (err, connection) => {
    try {
      await connection.beginTransaction();

      let note_idx = await noteService.addNote(connection, err, req.decoded._id, req.body);

      await connection.commit();

      res.json({
        success: true,
        message: note_idx
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

exports.getNotes = router.get('/note', async (req, res) => {

  db(async (err, connection) => {
    try {
      await connection.beginTransaction();

      let content = {};
      console.log(req.query.note_idx);
      if (req.query.note_idx != undefined) {

        content.note = await noteService.getNote(connection, err, req.query.note_idx);
        if (content.note.idx != 0) {
          content.memo = await noteService.getMemo(connection, err, req.query.note_idx);
        }else{
          content = "일치하는 내용이 없습니다."
        }

      } else if (req.query.url != undefined) { //특정 인덱스에 대해서 조회

        content.note = await noteService.getNoteWithUrl(connection, err, req.query.url, req.decoded._id);
        if (content.note.idx != 0) {
          content.memo = await noteService.getMemo(connection, err, content.note.idx);
        }else{
          content = "일치하는 내용이 없습니다."
        }

      } else {
        content = await noteService.getNotes(connection, err, req.decoded._id);
      }

      await connection.commit();

      res.json({
        success: true,
        message: content
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

exports.getShareNotes = router.get('/note/share', async (req, res) => {

  db(async (err, connection) => {
    try {
      await connection.beginTransaction();

      let content = {};

      content.shared = await noteService.getSharedNotes(connection, err, req.decoded._id);
      content.sharing = await noteService.getSharingNotes(connection, err, req.decoded._id);


      await connection.commit();

      res.json({
        success: true,
        message: content
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

exports.deleteNote = router.delete('/note', async (req, res) => {

  db(async (err, connection) => {
    try {
      await connection.beginTransaction();

      await noteService.deleteNote(connection, err, req.query.idx);

      await connection.commit();

      res.json({
        success: true,
        message: "Success"
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

exports.disconnectSharing = router.delete('/note/share', async (req, res) => {

  db(async (err, connection) => {
    try {
      await connection.beginTransaction();

      await noteService.disconnectSharing(connection, err, req.query.idx, req.decoded._id);

      await connection.commit();

      res.json({
        success: true,
        message: "Success"
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


exports.addShare = router.post('/note/share', async (req, res) => {

  db(async (err, connection) => {
    try {
      await connection.beginTransaction();

      let content = {};
      
      dup_chk = await noteService.checkShareUser(connection, err, req.decoded._id, req.body.id, req.body.note_idx)
      console.log(dup_chk)
      if(dup_chk){

        await noteService.addShareUser(connection, err, req.decoded._id, req.body.id, req.body.note_idx);
        await connection.commit();

        res.json({
          success: true,
          message: "Success"
        });
      }else{
        res.json({
          success : false,
          message: "이미 공유 신청된 사용자 입니다."
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

exports.getSharedNoteContents = router.get('/note/shared', async (req, res) => {

  db(async (err, connection) => {
    try {
      await connection.beginTransaction();

      let content = [];
      let shared_content_list = await noteService.getSharedNoteList(connection, err, req.decoded._id, req.query.url);
      if (shared_content_list.length > 0) { //공유 받은 내용이 있는 경우.

        for (let i = 0; i < shared_content_list.length; i++) {
          let sub_result = {};
          sub_result.note_idx = shared_content_list[i].idx;
          sub_result.send_id = shared_content_list[i].id;
          sub_result.send_name = await userService.getUserName(connection, err, shared_content_list[i].id);
          sub_result.draw_url = shared_content_list[i].draw_url;
          sub_result.memo = await noteService.getMemo(connection, err, shared_content_list[i].idx);

          content.push(sub_result);
        }


      } else { //공유 받은 내용이 없는 상황이다.
        content = "";
      }

      await connection.commit();

      res.json({
        success: true,
        message: content
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


exports.addDraw = router.post('/note/draw', async (req, res) => {

  db(async (err, connection) => {
    try {
      await connection.beginTransaction();

      await noteService.addDraw(connection, err, req.body);

      await connection.commit();

      res.json({
        success: true,
        message: "Success"
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


exports.addMemo = router.post('/note/memo', async (req, res) => {

  db(async (err, connection) => {
    try {
      await connection.beginTransaction();

      let memo_id = await noteService.addMemo(connection, err, req.body);

      await connection.commit();

      res.json({
        success: true,
        message: memo_id
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

exports.patchMemo = router.patch('/note/memo', async (req, res) => {

  db(async (err, connection) => {
    try {
      await connection.beginTransaction();

      await noteService.patchMemo(connection, err, req.body);

      await connection.commit();

      res.json({
        success: true,
        message: "Success"
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


exports.deleteMemo = router.delete('/note/memo', async (req, res) => {

  db(async (err, connection) => {
    try {
      await connection.beginTransaction();

      await noteService.deleteMemo(connection, err, req.query.memo_idx);

      await connection.commit();

      res.json({
        success: true,
        message: "Success"
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
