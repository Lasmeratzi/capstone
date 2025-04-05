const db = require("../config/database"); // Import database configuration

const SignupModel = {
  insertUser: (userData, callback) => {
    const query = "INSERT INTO profiles (username, password, email, bio, birthdate, pfp) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, userData, callback);
  },
};

module.exports = SignupModel;