const Boom = require('@hapi/boom');
const BookModel = require('../models/bookModel').BookModel;
const BookUpdateModel = require('../models/bookModel').BookUpdateModel;
const BookByUserModel = require('../models/bookModel').BookByUserModel;
const db = require('../db/database');

// Gets all books
const getAllBooks = async (request, h) => {
  try {
    var query = {
      text:
        'SELECT B.id, B.name, B.author, B."publicationDate", BC.name AS "category", U.username as "owner" FROM public."Book" B JOIN public."BookCategory" BC ON BC.id = B.category JOIN public."AppUser" U ON U.id = B.user ORDER BY B.id'
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
      text: 'SELECT COUNT(id) FROM public."Book" WHERE id = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text:
        'SELECT B.id, B.name, B.author, B."publicationDate", BC.name AS "category", U.username as "owner" FROM public."Book" B JOIN public."BookCategory" BC ON BC.id = B.category JOIN public."AppUser" U ON U.id = B.user WHERE B.id = $1',
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

// Gets a book by user
const getBookByUser = async (request, h) => {
  try {
    const { value, error } = BookByUserModel.validate(request.payload);

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    var query = {
      text:
        'SELECT B.id, B.name, B.author, B."publicationDate", BC.name AS "category", U.username as "owner" FROM public."Book" B JOIN public."BookCategory" BC ON BC.id = B.category JOIN public."AppUser" U ON U.id = B.user WHERE B."user" = $1',
      values: [value.user]
    };

    const books = await (await db.query(query)).rows;

    return books;
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

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    var query = {
      text: 'SELECT id FROM public."AppUser" WHERE id = $1',
      values: [value.user]
    };

    var { rows } = await db.query(query);

    if (!rows[0]) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    query = {
      text: 'SELECT id FROM public."BookCategory" WHERE id = $1',
      values: [value.category]
    };

    var { rows } = await db.query(query);

    if (!rows[0]) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    query = {
      text:
        'INSERT INTO public."Book" (name, author, "publicationDate", category, "user") VALUES ($1, $2, $3, $4, $5)',
      values: [
        value.name,
        value.author,
        value.publicationDate,
        value.category,
        value.user
      ]
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

    const { value, error } = BookUpdateModel.validate(request.payload);

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    var query = {
      text: 'SELECT COUNT(id) FROM public."Book" WHERE id = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text: 'SELECT COUNT(id) FROM public."AppUser" WHERE id = $1',
      values: [value.user]
    };

    const validUser = +(await (await db.query(query)).rows[0].count);

    if (validUser === 0) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    query = {
      text:
        'UPDATE public."Book" SET name = $1, author = $2, "publicationDate" = $3, category = $4, "user" = $5 WHERE id = $6',
      values: [
        value.name,
        value.author,
        value.publicationDate,
        value.category,
        value.user,
        id
      ]
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
      text: 'SELECT COUNT(id) FROM public."Book" WHERE id = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text: 'DELETE FROM public."Book" WHERE id = $1',
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
  getBookByUser,
  addBook,
  updateBook,
  deleteBook
};
