const EventController = require('../controllers/eventController');

const routes = [
  {
    method: 'GET',
    path: '/event',
    handler: EventController.getAllEvents
  },
  {
    method: 'POST',
    path: '/event',
    handler: EventController.addEvent
  },
  {
    method: 'GET',
    path: '/event/{id}',
    handler: EventController.getEventById
  },
  {
    method: 'PUT',
    path: '/event/{id}',
    handler: EventController.updateEvent
  },
  {
    method: 'DELETE',
    path: '/event/{id}',
    handler: EventController.deleteEvent
  }
];

exports.routes = routes;
