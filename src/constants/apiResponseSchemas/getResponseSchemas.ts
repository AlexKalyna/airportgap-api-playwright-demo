import Joi from 'Joi';

export const GET_ALL_AIRPORTS_SCHEMA = {
    data: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        type: Joi.string().valid('airport').required(),
        attributes: Joi.object({
          name: Joi.string().required(),
          city: Joi.string().required(),
          country: Joi.string().required(),
          iata: Joi.string().length(3).required(),
          icao: Joi.string().length(4).required(),
          latitude: Joi.string().pattern(/^[-+]?\d+(\.\d+)?$/).required(), // Validates a latitude format
          longitude: Joi.string().pattern(/^[-+]?\d+(\.\d+)?$/).required(), // Validates a longitude format
          altitude: Joi.number().integer().required(),
          timezone: Joi.string().required()
        }).required()
      })
    ).required(),
    links: Joi.object({
      first: Joi.string().uri().required(),
      last: Joi.string().uri().required(),
      next: Joi.string().uri().allow(null),  // Allows null for pagination limits
      prev: Joi.string().uri().allow(null),
      self: Joi.string().uri().required()
    }).required()
  };

export const GET_AIRPORT_BY_ID_SCHEMA = {
    data: Joi.object({
      id: Joi.string().required(),
      type: Joi.string().valid('airport_distance').required(),
      attributes: Joi.object({
        from_airport: Joi.object({
          altitude: Joi.number().integer().required(),
          city: Joi.string().required(),
          country: Joi.string().required(),
          iata: Joi.string().length(3).required(),
          icao: Joi.string().length(4).required(),
          id: Joi.number().integer().required(),
          latitude: Joi.string().pattern(/^[-+]?\d+(\.\d+)?$/).required(), // Validates a latitude format
          longitude: Joi.string().pattern(/^[-+]?\d+(\.\d+)?$/).required(), // Validates a longitude format
          name: Joi.string().required(),
          timezone: Joi.string().required()
        }).required(),
        kilometers: Joi.number().min(0).required(),
        miles: Joi.number().min(0).required(),
        nautical_miles: Joi.number().min(0).required(),
        to_airport: Joi.object({
          altitude: Joi.number().integer().required(),
          city: Joi.string().required(),
          country: Joi.string().required(),
          iata: Joi.string().length(3).required(),
          icao: Joi.string().length(4).required(),
          id: Joi.number().integer().required(),
          latitude: Joi.string().pattern(/^[-+]?\d+(\.\d+)?$/).required(), // Validates a latitude format
          longitude: Joi.string().pattern(/^[-+]?\d+(\.\d+)?$/).required(), // Validates a longitude format
          name: Joi.string().required(),
          timezone: Joi.string().required()
        }).required()
      }).required()
    }).required()
  };