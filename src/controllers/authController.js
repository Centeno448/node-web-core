const Boom = require('@hapi/boom');
const db = require('../db/database');
const JWT = require('jsonwebtoken');
const TokenConfig = require('../apiConfig');
const UserModels = require('../models/userModel');
const Crypto = require('crypto');

const register = async (request, h) => {
  try {
    if (!request.payload) {
      throw Boom.badRequest('NO_DATA');
    }

    const { value, error } = UserModels.AddUser.validate(request.payload);

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    var query = {
      text:
        'SELECT "UserName" AS "username", "Email" AS "email" FROM public."AppUser" WHERE "UserName" = $1 OR "Email" = $2',
      values: [value.username, value.email]
    };

    const { rows } = await db.query(query);

    if (rows[0]) {
      const dbUser = rows[0].username;
      const dbEmail = rows[0].email;

      if (value.email === dbEmail) {
        throw Boom.badRequest('EMAIL_EXISTS');
      }

      if (value.username === dbUser) {
        throw Boom.badRequest('USERNAME_EXISTS');
      }
    }

    value.password = Crypto.createHash('sha256')
      .update(value.password)
      .digest('hex');

    query = {
      text:
        'INSERT INTO public."AppUser" ("UserName", "Email", "Password", "Role") VALUES ($1, $2, $3, $4);',
      values: [value.username, value.email, value.password, value.role]
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

const login = async (request, h) => {
  try {
    if (!request.payload) {
      throw Boom.badRequest('NO_DATA');
    }

    const { value, error } = UserModels.LoginUser.validate(request.payload);

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    value.password = Crypto.createHash('sha256')
      .update(value.password)
      .digest('hex');

    var query = {
      text:
        'SELECT "AppUserId" AS "id", "UserName" AS "username" FROM public."AppUser" WHERE "UserName" = $1 AND "Password" = $2',
      values: [value.username, value.password]
    };

    const { rows } = await db.query(query);

    if (!rows[0]) {
      throw Boom.notFound('USER_NOT_FOUND');
    }

    const { id, username } = rows[0];

    const accessToken = JWT.sign(
      { id, username },
      TokenConfig.accessTokenSecret,
      {
        expiresIn: TokenConfig.accessTokenExpiresIn
      }
    );

    const expiresIn = TokenConfig.accessTokenExpiresInSeconds;

    const refreshToken = JWT.sign(
      { id, username },
      TokenConfig.refreshTokenSecret
    );

    query = {
      text: 'INSERT INTO public."RefreshToken" ("Token") VALUES ($1)',
      values: [refreshToken]
    };

    await db.query(query);

    return { id, username, accessToken, refreshToken, expiresIn };
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

const logout = async (request, h) => {
  try {
    if (!request.payload) {
      throw Boom.badRequest('NO_DATA');
    }

    const { token } = request.payload;

    if (!token) {
      throw Boom.badRequest('NO_DATA');
    }

    var query = {
      text: 'DELETE FROM public."RefreshToken" WHERE "Token" = $1',
      values: [token]
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

const refresh = async (request, h) => {
  try {
    if (!request.payload) {
      throw Boom.badRequest('NO_DATA');
    }

    const { token } = request.payload;

    if (!token) {
      throw Boom.unauthorized();
    }

    var query = {
      text: 'SELECT "Token" FROM public."RefreshToken" WHERE "Token" = $1',
      values: [token]
    };

    const { rows } = await db.query(query);

    if (!rows[0]) {
      throw Boom.unauthorized();
    }

    const accessToken = JWT.verify(
      token,
      TokenConfig.refreshTokenSecret,
      (err, user) => {
        if (err) {
          throw Boom.unauthorized();
        }

        const token = JWT.sign(
          { id: user.id, username: user.username },
          TokenConfig.accessTokenSecret,
          { expiresIn: TokenConfig.accessTokenExpiresIn }
        );

        return token;
      }
    );

    return { accessToken };
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
  register,
  login,
  logout,
  refresh
};
