
exports.addRelation = "INSERT INTO FRIEND (send, receive, status, req_date) VALUES (?, ?, ?, NOW())"
exports.getRelation = "SELECT * FROM FRIEND WHERE send = (?) OR receive = (?)"
exports.patchRelation = "UPDATE FRIEND SET status = (?), res_date = NOW() WHERE idx = (?)"
exports.deleteRelation = "DELETE FROM FRIEND WHERE idx = (?)"

exports.checkRelation = "SELECT idx FROM FRIEND WHERE (send = (?) AND receive = (?)) OR (send = (?) AND receive = (?))"
exports.checkRelationIdx = "SELECT idx FROM FRIEND WHERE idx = (?) AND (send = (?) OR receive = (?))"
exports.checkRelationConnected = "SELECT idx FROM FRIEND WHERE ((send = (?) AND receive = (?)) OR (send = (?) AND receive = (?))) AND status = '승인'"

exports.findFriend = "SELECT * FROM FRIEND WHERE ((send = (?) AND receive = (?)) OR (send = (?) AND receive = (?))) AND status = '승인'"
