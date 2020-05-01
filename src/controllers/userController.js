const Boom = require('@hapi/boom');
const db = require('../db/database');

// Gets all users
const getAllUsers = async (request, h) => {
  try {
    var query = {
      text:
        'SELECT U.id, U.username FROM public."AppUser" U JOIN public."AppRole" R ON R.id = U.role WHERE R.name NOT IN (\'admin\') ORDER BY U.id'
    };
    const { rows } = await db.query(query);

    return rows;
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

module.exports = {
  getAllUsers
};
