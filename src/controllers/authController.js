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
      text: 'SELECT * FROM public."AppUser" WHERE username = $1 OR email = $2',
      values: [value.username, value.email]
    };

    var { rows } = await db.query(query);

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

    if (value.role === 'admin') {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    query = {
      text: 'SELECT id FROM public."AppRole" WHERE name = $1',
      values: [value.role]
    };

    var { rows } = await db.query(query);

    if (!rows[0]) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    const id = rows[0].id;

    value.password = Crypto.createHash('sha256')
      .update(value.password)
      .digest('hex');

    query = {
      text:
        'INSERT INTO public."AppUser" (username, email, password, role) VALUES ($1, $2, $3, $4);',
      values: [value.username, value.email, value.password, id]
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
        'SELECT U.*, R.name FROM public."AppUser" U JOIN public."AppRole" R ON R.id = U.role WHERE username = $1 AND password = $2',
      values: [value.username, value.password]
    };

    const { rows } = await db.query(query);

    if (!rows[0]) {
      throw Boom.notFound('USER_NOT_FOUND');
    }

    const { id, username } = rows[0];
    const role = rows[0].name;

    const accessToken = JWT.sign(
      { id, username, role },
      TokenConfig.accessTokenSecret,
      {
        expiresIn: TokenConfig.accessTokenExpiresIn
      }
    );

    const expiresIn = TokenConfig.accessTokenExpiresInSeconds;

    const refreshToken = JWT.sign(
      { id, username, role },
      TokenConfig.refreshTokenSecret
    );

    query = {
      text: 'INSERT INTO public."RefreshToken" (token) VALUES ($1)',
      values: [refreshToken]
    };

    await db.query(query);

    return { id, username, role, accessToken, refreshToken, expiresIn };
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
      text: 'DELETE FROM public."RefreshToken" WHERE token = $1',
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
      text: 'SELECT token FROM public."RefreshToken" WHERE token = $1',
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
          { id: user.id, username: user.username, role: user.role },
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
