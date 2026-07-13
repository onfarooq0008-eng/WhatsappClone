const db = require("./database");

function createUser(username) {
    return new Promise((resolve, reject) => {

        db.get(
            "SELECT * FROM users WHERE username = ?",
            [username],
            (err, row) => {

                if (err) return reject(err);

                if (row) return resolve(row);

                db.run(
                    "INSERT INTO users(username) VALUES(?)",
                    [username],
                    function(err) {

                        if (err) return reject(err);

                        db.get(
                            "SELECT * FROM users WHERE id=?",
                            [this.lastID],
                            (err, user) => {

                                if (err) reject(err);
                                else resolve(user);

                            }
                        );

                    }
                );

            }
        );

    });
}

module.exports = {
    createUser
};
