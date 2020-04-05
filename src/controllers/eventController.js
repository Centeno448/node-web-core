const Boom = require('@hapi/boom');
const EventModel = require('../models/eventModel').EventModel;
const db = require('../db/database');
const Joi = require('@hapi/joi');

// Gets all events
const getAllEvents = async (request, h) => {
  try {
    var query = {
      text:
        'SELECT E."Name" AS "name", E."StartAt" AS "startAt", E."EndAt" AS "endAt", ET."Name" AS "eventType" FROM public."Event" E JOIN public."EventType" ET ON E."EventTypeId" = ET."EventTypeId" '
    };
    const { rows } = await db.query(query);

    return rows;
  } catch (e) {
    console.log(e);
    throw Boom.internal();
  }
};

// Gets an event by id
const getEventById = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    var query = {
      text: 'SELECT COUNT("EventId") FROM public."Event" WHERE "EventId" = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text:
        'SELECT E."Name" AS "name", E."StartAt" AS "startAt", E."EndAt" AS "endAt", ET."Name" AS "eventType" FROM public."Event" E JOIN public."EventType" ET ON E."EventTypeId" = ET."EventTypeId" WHERE E."EventId" = $1',
      values: [id]
    };

    const event = await (await db.query(query)).rows[0];

    return event;
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

// Adds a new event
const addEvent = async (request, h) => {
  try {
    const { value, error } = EventModel.validate(request.payload);

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    var query = {
      text:
        'INSERT INTO public."Event" ("Name", "StartAt", "EndAt", "EventTypeId") VALUES ($1, $2, $3, $4)',
      values: [value.name, value.startAt, value.endAt, value.eventTypeId]
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

// Updates an event
const updateEvent = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    const { value, error } = EventModel.validate(request.payload);

    if (error) {
      throw Boom.badRequest('BAD_PAYLOAD');
    }

    var query = {
      text: 'SELECT COUNT("EventId") FROM public."Event" WHERE "EventId" = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text:
        'UPDATE public."Event" SET "Name" = $1, "StartAt" = $2, "EndAt" = $3, "EventTypeId" = $4 WHERE "EventId" = $5',
      values: [value.name, value.startAt, value.endAt, value.eventTypeId, id]
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

// Deletes an event
const deleteEvent = async (request, h) => {
  try {
    const id = +request.params.id;

    if (!id || id < 0) {
      throw Boom.badRequest('BAD_ID');
    }

    var query = {
      text: 'SELECT COUNT("EventId") FROM public."Event" WHERE "EventId" = $1',
      values: [id]
    };

    const exists = +(await (await db.query(query)).rows[0].count);

    if (!exists) {
      throw Boom.notFound();
    }

    query = {
      text: 'DELETE FROM public."Event" WHERE "EventId" = $1',
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
  getAllEvents,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent
};
