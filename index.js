import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

// DB
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test DB
(async () => {
  try {
    await db.query("SELECT 1");
    console.log("Database connected successfully");
  } catch (err) {
    console.error("DB connection error:", err);
  }
})();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ROUTES
app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM note_user ORDER BY id");
  res.render("index", {
    listTitle: "Today",
    listItems: result.rows,
  });
});

app.post("/add", async (req, res) => {
  await db.query("INSERT INTO note_user (title) VALUES ($1)", [
    req.body.newItem,
  ]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  await db.query("UPDATE note_user SET title=$1 WHERE id=$2", [
    req.body.updatedItemTitle,
    req.body.updatedItemId,
  ]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  await db.query("DELETE FROM note_user WHERE id=$1", [req.body.deleteItemId]);
  res.redirect("/");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
