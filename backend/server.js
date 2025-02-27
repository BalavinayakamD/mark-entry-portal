// Code to run the server and handle API requests
// Importing required modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./src/config/db");
const app = express();
const PORT = process.env.PORT || 8080; 

app.use(cors());
app.use(bodyParser.json());

// API to fetch the cardinals from the database
app.get("/api/fetch-login", (req, res) => {
  const { userid, email, password } = req.query;
  console.log("Received login request with:", req.query);
  const query = "SELECT * FROM master_login WHERE userid = ? AND email = ? AND pass = ?";
  db.query(query, [userid, email, password], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Failed to login" });
    }
    if (result.length === 0) {
      console.log("No user found with provided credentials");
      return res.status(404).json({ error: "No user found" });
    }
    console.log("User found:", result[0]);
    res.status(200).json({ user: result[0], success: true });
  });
});

// API to ipdate marks in the database
app.put("/api/enter-mark", (req, res) => {
  const {  subject1, subject2, subject3, subject4, subject5, total , stuid } = req.body;
  const query =
    "UPDATE marks SET sub1=?, sub2=?, sub3=?, sub4=?, sub5=?, total=? WHERE stuid=?";
  db.query(query, [ subject1, subject2, subject3, subject4, subject5, total , stuid], (err) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Failed to enter mark" });
    }
    return res.status(200).json({ message: "Mark entered" });
  });
});

// API to fetch marks from the database
app.get("/api/fetch-marks", (req, res) => {
  const {stuid} = req.query;
  const query = "SELECT * FROM marks ";
  db.query(query, [stuid], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch marks" });
    }
    return res.status(200).json({ marks: result });
  });
});


//API to upload into pending
app.post("/api/req-edit", (req, res) => {
  const {stuid, subject1, subject2, subject3, subject4, subject5, total} = req.body;
  const query = "INSERT INTO pending (stuid, sub1, sub2, sub3, sub4, sub5, total) VALUES (?,?,?,?,?,?,?)";
  db.query(query, [stuid, subject1, subject2, subject3, subject4, subject5, total], (err) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Failed to request edit" });
    }
    return res.status(200).json({ message: "Edit requested" });
  });
})

//API to upload into marks
app.post("/api/enter-mark", (req, res) => {
  const { stuid, subject1, subject2, subject3, subject4, subject5, total } = req.body;
  console.log("Received request to enter mark:", req.body); // for logging
  const query =
    "INSERT INTO marks (stuid, sub1, sub2, sub3, sub4, sub5, total) VALUES (?,?,?,?,?,?,?)";
  db.query(query, [stuid, subject1, subject2, subject3, subject4, subject5, total], (err) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Failed to enter mark" });
    }
    return res.status(200).json({ message: "Mark entered" });
  });
});

//API to update marks
app.post("/api/edit-mark", (req, res) => {
  const { stuid, sub1, sub2, sub3, sub4, sub5, total } = req.body;
  const query =
    "UPDATE marks SET sub1=?, sub2=?, sub3=?, sub4=?, sub5=?, total=? WHERE stuid=?";

  db.query(query, [sub1, sub2, sub3, sub4, sub5, total, stuid], (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update mark" });
    }
    return res.status(200).json({ message: "Mark updated" });
  });
});

//API to delete marks
app.delete("/api/delete-mark", (req, res) => {
  const { stuid } = req.body;
  console.log("Received delete request for stuid:", stuid); // Add this line for logging
  const query = "DELETE FROM marks WHERE stuid=?";
  db.query(query, [stuid], (err) => {
    if (err) {
      console.log("Database query error:", err);
      return res.status(500).json({ error: "Failed to delete mark" });
    }
    return res.status(200).json({ message: "Mark deleted" });
  });
});

//API to delete form pending

app.delete("/api/delete-pending", (req, res) => {
  const { stuid } = req.body;
  console.log("Received delete request in pending for stuid:", stuid); // Add this line for logging
  const query = "DELETE FROM pending WHERE stuid=?";
  db.query(query, [stuid], (err) => {
    if (err) {
      console.log("Database query error:", err);
      return res.status(500).json({ error: "Failed to delete mark" });
    }
    return res.status(200).json({ message: "Mark deleted" });
  });
});


//API to fetch from pending
app.get("/api/fetch-pending", (req, res) => {
  const query = "SELECT * FROM pending";
  db.query(query, (err, result) => {
    if (err) {
      console.log("Database query error:", err);
      return res.status(500).json({ error: "Failed to fetch pending" });
    }
    return res.status(200).json({ pending: result });
  });
});

//listen to port 8080 or any PORT
app.listen(PORT, (err) => {
  if (err) {
    console.log("Error connecting to DB");
    return err;
  }
  console.log(`App running on port ${PORT}`);
});
