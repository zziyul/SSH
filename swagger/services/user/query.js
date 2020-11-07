

exports.checkUserIdAndPW = "SELECT * FROM USER WHERE id = (?) AND pw = (?)"
exports.checkIDDuplicated = "SELECT id FROM USER WHERE id = (?)"

exports.getUserName = "SELECT name FROM USER WHERE id = (?)"
exports.addUser = "INSERT INTO USER(id, pw, email, name, phone) VALUES (?, ?, ?, ?, ?)"
exports.patchUser = "UPDATE USER SET pw = (?), email = (?), name = (?), phone = (?) WHERE id = (?)"
