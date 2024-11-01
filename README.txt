# Book Notes Web Application

This is a web application built with Node.js, Express, EJS, and PostgreSQL for managing a collection of books. Users can add books by providing an ISBN number, view their book collection, leave reviews and ratings, and delete book entries.

## Features

- **Home Page**: Displays a list of books in the collection with details such as the book cover, title, author, rating, review, and date read.
- **Add New Book**: Users can add a new book to the collection by entering the ISBN number. Book data is fetched using the Open Library API.
- **Review Book**: Users can update their review and rating for a book or delete the book from the collection.
- **Responsive Design**: The application is styled with CSS to ensure a user-friendly experience on different screen sizes.

## Technologies Used

- **Node.js**: JavaScript runtime environment for the back end.
- **Express**: Web framework for building the server and routing.
- **EJS**: Templating engine for rendering dynamic HTML pages.
- **PostgreSQL**: Database used to store book data, including ISBN, title, author, cover URL, rating, review, and date read.
- **Axios**: HTTP client for making API requests to fetch book data.
- **dotenv**: Module for managing environment variables securely.

