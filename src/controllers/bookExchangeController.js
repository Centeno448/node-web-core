const Boom = require('@hapi/boom');
const BookExchangeModel = require('../models/bookExchangeModel')
  .BookExchangeModel;
const db = require('../db/database');

// Gets all book exchanges
const getAllExchanges = async (request, h) => {
  try {
    //console.log(request.auth.credentials);

    var query = {
      text:
        'SELECT BE.*, TU.username AS "toUser", FU.username AS "fromUser", TB.name AS "toBook", FB.name AS "fromBook" FROM public."BookExchange" BE JOIN public."AppUser" TU ON TU.id = BE."toUser" JOIN public."AppUser" FU ON FU.id = BE."fromUser" JOIN public."Book" TB ON TB.id = BE."toBook"  JOIN public."Book" FB ON FB.id = BE."fromBook"'
    };
    const { rows } = await db.query(query);

    return rows;
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

// Gets a bok exchange by id
const getExchangeById = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    var query = {
      text: 'SELECT COUNT(id) FROM public."BookExchange" WHERE id = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text:
        'SELECT BE.*, TU.username AS "toUserName", FU.username AS "fromUserName", TB.name AS "toBookName", FB.name AS "fromBookName" FROM public."BookExchange" BE JOIN public."AppUser" TU ON TU.id = BE."toUser" JOIN public."AppUser" FU ON FU.id = BE."fromUser" JOIN public."Book" TB ON TB.id = BE."toBook"  JOIN public."Book" FB ON FB.id = BE."fromBook" WHERE BE.id = $1',
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

// Adds a new book exchange
const addExchange = async (request, h) => {
  try {
    const { value, error } = BookExchangeModel.validate(request.payload);

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    var query = {
      text: 'SELECT * FROM public."AppUser" WHERE id IN($1, $2)',
      values: [value.toUser, value.fromUser]
    };

    var { rows } = await db.query(query);

    if (!rows[0]) {
      throw Boom.notFound('BAD_PAYLOAD');
    }

    if (!rows[1]) {
      throw Boom.notFound('BAD_PAYLOAD');
    }

    query = {
      text: 'SELECT * FROM public."Book" WHERE id IN($1, $2)',
      values: [value.toBook, value.fromBook]
    };

    var { rows } = await db.query(query);

    if (!rows[0]) {
      throw Boom.notFound('BAD_PAYLOAD');
    }

    if (!rows[1]) {
      throw Boom.notFound('BAD_PAYLOAD');
    }

    query = {
      text:
        'INSERT INTO public."BookExchange" ("fromUser", "toUser", "fromBook", "toBook", "exchangeDate") VALUES ($1, $2, $3, $4, $5)',
      values: [
        value.fromUser,
        value.toUser,
        value.fromBook,
        value.toBook,
        value.exchangeDate
      ]
    };

    await db.query(query);

    // query = {
    //   text:
    //     'UPDATE public."Book" SET "user" = $1 WHERE id = $2 AND "user" = $3',
    //   values: [value.toUser, value.fromBook, value.fromUser]
    // };

    // await db.query(query);

    // query = {
    //   text:
    //     'UPDATE public."Book" SET "user" = $1 WHERE id = $2 AND "user" = $3',
    //   values: [value.fromUser, value.toBook, value.toUser]
    // };

    // await db.query(query);

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

// Updates a book exchange
const updateExchange = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    const { value, error } = BookExchangeModel.validate(request.payload);

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    var query = {
      text: 'SELECT * FROM public."AppUser" WHERE id IN($1, $2)',
      values: [value.toUser, value.fromUser]
    };

    var { rows } = await db.query(query);

    if (!rows[0]) {
      throw Boom.notFound('BAD_PAYLOAD');
    }

    if (!rows[1]) {
      throw Boom.notFound('BAD_PAYLOAD');
    }

    query = {
      text: 'SELECT * FROM public."Book" WHERE id IN($1, $2)',
      values: [value.toBook, value.fromBook]
    };

    var { rows } = await db.query(query);

    if (!rows[0]) {
      throw Boom.notFound('BAD_PAYLOAD');
    }

    if (!rows[1]) {
      throw Boom.notFound('BAD_PAYLOAD');
    }

    query = {
      text: 'SELECT COUNT(id) FROM public."BookExchange" WHERE id = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text:
        'UPDATE public."BookExchange" SET "toUser" = $1, "fromUser" = $2, "toBook" = $3, "fromBook" = $4, "exchangeDate" = $5 WHERE id = $6',
      values: [
        value.toUser,
        value.fromUser,
        value.toBook,
        value.fromBook,
        value.exchangeDate,
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

// Deletes a book exchange
const deleteExchange = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    var query = {
      text: 'SELECT COUNT(id) FROM public."BookExchange" WHERE id = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text: 'DELETE FROM public."BookExchange" WHERE id = $1',
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
  getAllExchanges,
  getExchangeById,
  addExchange,
  updateExchange,
  deleteExchange
};
