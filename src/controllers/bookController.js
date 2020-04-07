const Boom = require('@hapi/boom');
const BookModel = require('../models/bookModel').BookModel;
const db = require('../db/database');

// Gets all books
const getAllBooks = async (request, h) => {
  try {
    var query = {
      text:
        'SELECT "BookId" AS "bookId", "Name" AS "name", "Author" AS "author", "PublicationDate" AS "publicationDate" FROM public."Book"'
    };
    const { rows } = await db.query(query);

    return rows;
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

// Gets a book by id
const getBookById = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    var query = {
      text: 'SELECT COUNT("BookId") FROM public."Book" WHERE "BookId" = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text:
        'SELECT "BookId" AS "bookId", "Name" AS "name", "Author" AS "author", "PublicationDate" AS "publicationDate" FROM public."Book" WHERE "BookId" = $1',
      values: [id]
    };

    const book = await (await db.query(query)).rows[0];

    return book;
  } catch (e) {
    if (e.isBoom) {
      throw new Boom.Boom(e.output.payload.message, {
        statusCode: e.output.statusCode
      });
    } else {
      console.log(e);
      throw Boom.internal();
    }
  }
};

// Adds a new book
const addBook = async (request, h) => {
  try {
    const { value, error } = BookModel.validate(request.payload);
    console.log(value);

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    var query = {
      text:
        'INSERT INTO public."Book" ("Name", "Author", "PublicationDate") VALUES ($1, $2, $3)',
      values: [value.name, value.author, value.publicationDate]
    };

    await db.query(query);

    return h.response().code(201);
  } catch (e) {
    if (e.isBoom) {
      throw new Boom.Boom(e.output.payload.message, {
        statusCode: e.output.statusCode
      });
    } else {
      console.log(e);
      throw Boom.internal();
    }
  }
};

// Updates a book
const updateBook = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    const { value, error } = BookModel.validate(request.payload);

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    var query = {
      text: 'SELECT COUNT("BookId") FROM public."Book" WHERE "BookId" = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text:
        'UPDATE public."Book" SET "Name" = $1, "Author" = $2, "PublicationDate" = $3 WHERE "BookId" = $4',
      values: [value.name, value.author, value.publicationDate, id]
    };

    await db.query(query);

    return h.response().code(200);
  } catch (e) {
    if (e.isBoom) {
      throw new Boom.Boom(e.output.payload.message, {
        statusCode: e.output.statusCode
      });
    } else {
      console.log(e);
      throw Boom.internal();
    }
  }
};

// Deletes a book
const deleteBook = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    var query = {
      text: 'SELECT COUNT("BookId") FROM public."Book" WHERE "BookId" = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text: 'DELETE FROM public."Book" WHERE "BookId" = $1',
      values: [id]
    };

    await db.query(query);

    return h.response().code(200);
  } catch (e) {
    if (e.isBoom) {
      throw new Boom.Boom(e.output.payload.message, {
        statusCode: e.output.statusCode
      });
    } else {
      console.log(e);
      throw Boom.internal();
    }
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
};