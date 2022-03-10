# Book Library API 📚 

This project is part of Manchester Codes Backend exercise. It was built by using Express.js, MySQL and Sequelize. Integrated tests were written by using Mocha, Chai and Supertest. 

## Installation

- Install docker

- Pull and run a MySQL image with:  
`docker run -d -p 3307:3306 --name book_library_mysql -e MYSQL_ROOT_PASSWORD=password mysql`

- Run `npm install` in your repo directory 

- Create .env and .env.test (if you want to run the tests) file(s) in your root directory, and add the below local variables:   
  - DB_PASSWORD
  
  - DB_NAME (set a different name in .env.test file eg. `book_library_api_test` )

  - DB_USER

  - DB_HOST

  - DB_PORT

- Run `npm start` to run the project

- Run `npm test` to run the tests 

## Routes

### Readers
A reader requires a name, email and password:

- Create: POST to /readers

- Get all: GET to /readers

- Get an individual reader: GET to /readers/:readerId

- Update: PATCH to /readers/:readerId

- Delete: DELETE to /readers/:readerId

### Books
A book requires a title, ISBN, GenreId, AuthorId and a ReaderId:

- Create: POST to /books

- Get all: GET to /books

- Get an individual book: GET to /books/:bookId

- Update: PATCH to /books/:bookId

- Delete: DELETE to /books/:bookId

### Authors
An author requires an author name:

- Create: POST to /authors

- Get all: GET to /authors

- Get an individual author: GET to /authors/:authorId

- Update: PATCH to /authors/:authorId

- Delete: DELETE to /authors/:authorId

### Genres
A genre requires a genre name:

- Create: POST to /genres

- Get all: GET to /genres

- Get an individual genre: GET to /genres/:genreId

- Update: PATCH to /genres/:genreId

- Delete: DELETE to /genres/:genreId