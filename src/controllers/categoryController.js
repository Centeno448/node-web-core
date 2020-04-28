const Boom = require('@hapi/boom');
const BookCategoryModel = require('../models/bookCategoryModel')
  .BookCategoryModel;
const db = require('../db/database');

// Gets all book categories
const getAllCategories = async (request, h) => {
  try {
    //console.log(request.auth.credentials);

    var query = {
      text: 'SELECT * FROM public."BookCategory" ORDER BY id'
    };
    const { rows } = await db.query(query);

    return rows;
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

// Gets a category by id
const getCategoryById = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    var query = {
      text: 'SELECT COUNT(id) FROM public."BookCategory" WHERE id = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text: 'SELECT * FROM public."BookCategory" WHERE id = $1',
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

// Adds a new category
const addCategory = async (request, h) => {
  try {
    const { value, error } = BookCategoryModel.validate(request.payload);

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    query = {
      text:
        'INSERT INTO public."BookCategory" (name, description) VALUES ($1, $2)',
      values: [value.name, value.description]
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

// Updates a category
const updateCategory = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    const { value, error } = BookCategoryModel.validate(request.payload);

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    var query = {
      text: 'SELECT COUNT(id) FROM public."BookCategory" WHERE id = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text:
        'UPDATE public."BookCategory" SET name = $1, description = $2 WHERE id = $3',
      values: [value.name, value.description, id]
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

// Deletes a category
const deleteCategory = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    var query = {
      text: 'SELECT COUNT(id) FROM public."BookCategory" WHERE id = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text: 'DELETE FROM public."BookCategory" WHERE id = $1',
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
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory
};
