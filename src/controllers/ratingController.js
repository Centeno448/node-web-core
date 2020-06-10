const Boom = require('@hapi/boom');
const RatingModel = require('../models/ratingModel').RatingModel;
const db = require('../db/database');

// Gets all ratings
const getAllRatings = async (request, h) => {
  try {
    //console.log(request.auth.credentials);

    var query = {
      text:
        'SELECT R.id, R.score, R.comment, TU.username AS "toUser", FU.username AS "fromUser" FROM public."Rating" R JOIN public."AppUser" TU on TU.id = R."toUser" JOIN public."AppUser" FU on FU.id = R."fromUser" ORDER BY R.id'
    };
    const { rows } = await db.query(query);

    return rows;
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

const getUsersToRate = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    query = {
      text:
        'SELECT "toUser", "fromUser" FROM public."BookExchange" WHERE "toUser" = $1 OR "fromUser" = $1',
      values: [id]
    };

    const res = await (await db.query(query)).rows;

    var userIds = [];

    res.forEach((element) => {
      if (element.toUser != id && !userIds.includes(element.toUser)) {
        userIds.push(element.toUser);
      }
      if (element.fromUser != id && !userIds.includes(element.fromUser)) {
        userIds.push(element.fromUser);
      }
    });

    query = {
      text: `SELECT id, username FROM public."AppUser" WHERE id IN(${userIds.join(
        ','
      )})`
    };

    const users = await (await db.query(query)).rows;

    return users;
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

// Gets a rating by id
const getRatingByUserId = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    query = {
      text:
        'SELECT R.id, R.score, R.comment, TU.username AS "toUser", FU.username AS "fromUser" FROM public."Rating" R JOIN public."AppUser" TU on TU.id = R."toUser" JOIN public."AppUser" FU on FU.id = R."fromUser" WHERE R."fromUser" = $1 ORDER BY R.id',
      values: [id]
    };

    const rating = await (await db.query(query)).rows;

    return rating;
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

// Gets a rating by id
const getRatingToUserId = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    query = {
      text:
        'SELECT R.id, R.score, R.comment, TU.username AS "toUser", FU.username AS "fromUser" FROM public."Rating" R JOIN public."AppUser" TU on TU.id = R."toUser" JOIN public."AppUser" FU on FU.id = R."fromUser" WHERE R."toUser" = $1 ORDER BY R.id',
      values: [id]
    };

    const rating = await (await db.query(query)).rows;

    return rating;
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

// Adds a new rating
const addRating = async (request, h) => {
  try {
    const { value, error } = RatingModel.validate(request.payload);

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
      text:
        'SELECT * FROM public."Rating" WHERE "toUser" = $1 AND "fromUser" = $2',
      values: [value.toUser, value.fromUser]
    };

    var { rows } = await db.query(query);

    if (rows[0]) {
      throw Boom.badRequest('DUPLICATE_RATING');
    }

    query = {
      text:
        'INSERT INTO public."Rating" (score, comment, "toUser", "fromUser") VALUES ($1, $2, $3, $4)',
      values: [value.score, value.comment, value.toUser, value.fromUser]
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

// Updates a rating
const updateRating = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    const { value, error } = RatingModel.validate(request.payload);

    if (error) {
      console.log(error);
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    var query = {
      text: 'SELECT COUNT(id) FROM public."Rating" WHERE id = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text:
        'SELECT * FROM public."Rating" WHERE "toUser" = $1 AND "fromUser" = $2',
      values: [value.toUser, value.fromUser]
    };

    var { rows } = await db.query(query);

    if (rows[0].id !== id) {
      throw Boom.badRequest('DUPLICATE_RATING');
    }

    query = {
      text:
        'UPDATE public."Rating" SET score = $1, comment = $2, "fromUser" = $3, "toUser" = $4 WHERE id = $5',
      values: [value.score, value.comment, value.fromUser, value.toUser, id]
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

// Deletes a rating
const deleteRating = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    var query = {
      text: 'SELECT COUNT(id) FROM public."Rating" WHERE id = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text: 'DELETE FROM public."Rating" WHERE id = $1',
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
  getAllRatings,
  getRatingByUserId,
  getRatingToUserId,
  addRating,
  getUsersToRate,
  updateRating,
  deleteRating
};
