import express from "express";
import pg from "pg";
const app = express();
const port = 3000;
const db = new pg.Client({
  port: 5432,
  host: "localhost",
  database: "note",
  user: "postgres",
  password: "0776285740",
});
if (db.connect()) {
  console.log("Database connected successfully");
} else {
  console.log("Database connection failed");
}
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM note_user");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  db.query("INSERT INTO note_user (title) VALUES ($1)", [item]);

  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const id = req.body.updatedItemId;
  db.query("UPDATE note_user SET title=$1 WHERE id=$2", [
    req.body.updatedItemTitle,
    id,
  ]);
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const id = req.body.deleteItemId;
  db.query("delete from note_user where id=$1", [id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
