const EventTypeController = require('../controllers/eventTypeController');

const routes = [
  {
    method: 'GET',
    path: '/event-type',
    handler: EventTypeController.getAllEventTypes
  },
  {
    method: 'POST',
    path: '/event-type',
    handler: EventTypeController.addEventType
  },
  {
    method: 'GET',
    path: '/event-type/{id}',
    handler: EventTypeController.getEventTypeById
  },
  {
    method: 'PUT',
    path: '/event-type/{id}',
    handler: EventTypeController.updateEventType
  },
  {
    method: 'DELETE',
    path: '/event-type/{id}',
    handler: EventTypeController.deleteEventType
  }
];

exports.routes = routes;
