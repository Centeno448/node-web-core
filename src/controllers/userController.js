const Boom = require('@hapi/boom');
const UserModel = require('../models/userModel');
const db = require('../db/database');
const Crypto = require('crypto');

const getAll = async (request, h) => {
  try {
    const { rows } = await db.query(
      'SELECT "AppUserId" AS "id", "UserName" AS "username", "Email" as "email", "Password" AS "password" FROM Public."AppUser"'
    );

    return rows;
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

const getUser = async (request, h) => {
  const id = request.params.id;

  if (isNaN(id)) {
    throw Boom.badRequest('BAD_ID');
  }

  if (id < 0) {
    throw Boom.badRequest('BAD_ID');
  }

  try {
    var query = {
      text:
        'SELECT COUNT("AppUserId") FROM public."AppUser" WHERE "AppUserId" = $1',
      values: [id]
    };

    const { rows } = await db.query(query);

    if (rows[0].count == 0) {
      throw Boom.badRequest('BAD_ID');
    }

    query = {
      text:
        'SELECT "AppUserId" AS "id", "UserName" AS "username", "Email" as "email", "Password" AS "password" FROM Public."AppUser" WHERE "AppUserId" = $1',
      values: [id]
    };

    const res = await (await db.query(query)).rows;

    return res[0];
  } catch (e) {
    if (e.isBoom) {
      throw new Boom.Boom(e.output.payload.message, {
        statusCode: e.output.statusCode
      });
    } else {
      throw Boom.internal();
    }
  }
};

const addUser = async (request, h) => {
  const { value, error } = UserModel.AddUser.validate(request.payload);

  if (error) {
    throw Boom.badRequest(error);
  }

  try {
    // value.Password = Crypto.createHash('sha256')
    //   .update(value.Password)
    //   .digest('hex');

    const query = {
      text:
        'INSERT INTO public."AppUser"("UserName", "Email", "Password") VALUES ($1, $2, $3);',
      values: [value.username, value.email, value.password]
    };

    await db.query(query);

    return h.response().code(201);
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

const updateUser = async (request, h) => {
  const id = request.params.id;

  if (isNaN(id)) {
    throw Boom.badRequest('BAD_ID');
  }

  if (id < 0) {
    throw Boom.badRequest('BAD_ID');
  }

  const { value, error } = UserModel.UpdateUser.validate(request.payload);

  if (error) {
    throw Boom.badRequest('BAD_PAYLOAD');
  }

  try {
    var query = {
      text:
        'SELECT COUNT("AppUserId") FROM public."AppUser" WHERE "AppUserId" = $1',
      values: [id]
    };

    const { rows } = await db.query(query);

    if (rows[0].count == 0) {
      throw Boom.badRequest('BAD_ID');
    }

    query = {
      text:
        'UPDATE public."AppUser" SET "UserName" = $1, "Email" = $2, "Password" = $3 WHERE "AppUserId" = $4',
      values: [value.username, value.email, value.password, id]
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

const deleteUser = async (request, h) => {
  const id = request.params.id;

  if (isNaN(id)) {
    throw Boom.badRequest('BAD_ID');
  }

  if (id < 0) {
    throw Boom.badRequest('BAD_ID');
  }

  try {
    var query = {
      text:
        'SELECT COUNT("AppUserId") FROM public."AppUser" WHERE "AppUserId" = $1',
      values: [id]
    };

    const { rows } = await db.query(query);

    if (rows[0].count == 0) {
      throw Boom.badRequest('BAD_ID');
    }

    query = {
      text: 'DELETE FROM public."AppUser" WHERE "AppUserId" = $1',
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
      throw Boom.internal();
    }
  }
};

module.exports = {
  getAll: getAll,
  addUser: addUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getUser: getUser
};
