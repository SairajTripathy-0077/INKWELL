# 🖋️ Inkwell — Reading Log API

Inkwell is a backend API designed to help users track their personal library, manage reading progress, and gain data-driven insights into their reading habits. This project focuses on implementing robust CRUD operations, data aggregation, and structured error handling.

## 🚀 Features

- **Book Management:** Full CRUD (Create, Read, Update, Delete) functionality for your library.
- **Reading Progress:** Track status as *Reading*, *Finished*, or *Plan to Read*.
- **Personal Reviews:** Store ratings and short reviews for every book.
- **Advanced Filtering:** Filter your collection by genre or reading status via query parameters.
- **Reading Insights:** A specialized analytics endpoint providing:
  - Total number of books logged.
  - Average rating across all books.
  - The user's most-read genre.
- **Robust Validation:** Schema-level validation for data integrity and comprehensive error handling.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Environment:** Dotenv

## 📂 Project Structure

```text
inkwell-api/
├── src/
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API route definitions
│   ├── controllers/   # Request logic & DB interaction
│   ├── middleware/    # Validation & Error handling
│   └── app.js         # Express app entry point
├── .env               # Environment variables
└── package.json
```

## 🎓 Learning Goals

- Designing structured NoSQL schemas.
- Implementing RESTful best practices.
- Using MongoDB aggregation for data insights.
- Centralized error handling and HTTP status code management.