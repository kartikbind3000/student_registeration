const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("student"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kartik@9120",   
    database: "student_db"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
app.post("/registerform", async (req, res) => {

    const { full_name, roll_number, email, password, address } = req.body;

    if (!full_name || !roll_number || !email || !password || !address) {
        return res.send("All fields are required");
    }
    if (!validateEmail(email)) {
        return res.send("Invalid email format");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO students 
            (full_name, roll_number, email, password, address)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sql, [full_name, roll_number, email, hashedPassword, address],
            (err, result) => {

                if (err) {
                    console.log(err);
                    return res.send("Error saving data");
                }
                res.send("Registration Successful");
            });

    } catch (err) {
        console.log(err);
        res.send("Server error");
    }

});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
