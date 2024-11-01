import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

db.connect((err) => {
    if (err) {
      console.error("Error connecting to the database", err.stack);
    } else {
      console.log("Connected to the database");
    }
  });
  

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/assets', express.static('assets'));


const fetchBookData = async (isbn, title, author) => {
    
    try{
        const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
        const bookData = response.data[`ISBN:${isbn}`];
    
        if(bookData){
            const title = bookData.title || 'Uknown Title';
            const author = bookData.authors ? bookData.authors[0].name : 'Unknown Author';
            const cover_url = bookData.cover ? bookData.cover.medium : null;
    
            await db.query(
                `INSERT INTO books (isbn, title, author, cover_url) VALUES ($1, $2, $3, $4)`,
                [isbn, title, author, cover_url]
            );
            console.log(`Book "${title}" inserted sucessfully`);
        } else {
            console.log(`No data found for ISBN ${isbn}`);
            throw new Error("Book data not found in API");
            throw error;
        }
    }catch(erro){
        console.error('Error fetching book data: ' ,erro);
    };
}

app.get("/", async (req, res) =>{
    try {
      const result = await db.query("SELECT * FROM books");
      const books = result.rows;

      res.render("index.ejs", {
        books: books
      });
    } catch (error) {
      console.error("Error fetching items: ", error);
      res.status(500).send("Error fetching items");
    }
});

app.get("/books", async (req, res) => {
    res.render("addBook.ejs");
});

app.get("/addReview", async (req,res) =>{
  const { id } = req.query;

  try{
    const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    const book = result.rows[0];

    res.render("review.ejs", { book });
  }catch(err){
    console.err("Error fetching book details: " , err);
    res.status(500).send("Error fetching book details");
  }
});

app.post("/books", async (req, res) => {
    const { isbn } = req.body;
    try{
        await fetchBookData(isbn);
        
        res.redirect("/");
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).send("Error adding book. Book data not found in API.");
      }
});

app.post("/addReview", async (req, res) => {
  const { id, rating, review } = req.body;

  try{
    await db.query("UPDATE books SET rating=($1), review=($2) WHERE id=($3)", [rating, review, id]);
    res.redirect("/");
  }catch(err){
    console.error("Error updating book:", err);
    res.status(500).send("Error updating book");
  }

});

app.post("/deleteBook", async (req, res) => {
  const { id } = req.body;

  try{
    await db.query("DELETE FROM books WHERE id = ($1)", [id]);
    res.redirect("/");
  }catch(error){
    console.error("Error deleting book: ", error);
    res.status(500).send("Error deleting book");
  }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});