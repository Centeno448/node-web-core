const Boom = require('@hapi/boom');
const EventTypeModel = require('../models/eventTypeModel').EventModel;
const db = require('../db/database');

// Gets all event types
const getAllEventTypes = async (request, h) => {
  try {
    const { rows } = await db.query(
      'SELECT "EventTypeId" AS "eventTypeId", "Name" AS "name" FROM Public."EventType"'
    );

    return rows;
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

// Gets event type by id
const getEventTypeById = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    var query = {
      text:
        'SELECT "EventTypeId" AS "eventTypeId", "Name" AS "name" FROM public."EventType" WHERE "EventTypeId" = $1',
      values: [id]
    };
    const { rows } = await db.query(query);

    if (!rows[0]) {
      throw Boom.notFound();
    }

    return rows[0];
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

// Updates an event type
const updateEventType = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    const { value, error } = EventTypeModel.validate(request.payload);

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    var query = {
      text:
        'SELECT "EventTypeId" FROM public."EventType" WHERE "EventTypeId" = $1',
      values: [id]
    };

    const { rows } = await db.query(query);

    if (!rows[0]) {
      throw Boom.notFound();
    }

    query = {
      text:
        'SELECT COUNT("EventTypeId") FROM public."EventType" WHERE "Name" = $1',
      values: [value.name]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (exists) {
      throw Boom.badRequest('EVENT_TYPE_EXISTS');
    }

    query = {
      text:
        'UPDATE public."EventType" SET "Name" = $1 WHERE "EventTypeId" = $2',
      values: [value.name, id]
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

// Deletes an event type
const deleteEventType = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    var query = {
      text:
        'SELECT COUNT("EventTypeId") FROM public."EventType" WHERE "EventTypeId" = $1',
      values: [id]
    };

    const exists = await (await db.query(query)).rows[0];

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text: 'DELETE FROM public."EventType" WHERE "EventTypeId" = $1',
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

// Add an event type
const addEventType = async (request, h) => {
  try {
    const { value, error } = EventTypeModel.validate(request.payload);

    if (error) {
      throw Boom.badRequest(error);
    }

    var query = {
      text: 'SELECT COUNT(*) FROM public."EventType" WHERE "Name" = $1',
      values: [value.name]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (exists) {
      throw Boom.badRequest('EVENT_TYPE_EXISTS');
    }

    query = {
      text: 'INSERT INTO public."EventType" ("Name") VALUES ($1)',
      values: [value.name]
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

module.exports = {
  getAllEventTypes,
  getEventTypeById,
  updateEventType,
  deleteEventType,
  addEventType
};
