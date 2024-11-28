import Joi from 'joi';

export const GET_ALL_AIRPORTS_SCHEMA = {
  data: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        type: Joi.string().valid('airport').required(),
        attributes: Joi.object({
          name: Joi.string().required(),
          city: Joi.string().required(),
          country: Joi.string().required(),
          iata: Joi.string().length(3).required(),
          icao: Joi.string().length(4).required(),
          latitude: Joi.string()
            .pattern(/^[-+]?\d+(\.\d+)?$/)
            .required(), // Validates a latitude format
          longitude: Joi.string()
            .pattern(/^[-+]?\d+(\.\d+)?$/)
            .required(), // Validates a longitude format
          altitude: Joi.number().integer().required(),
          timezone: Joi.string().required()
        }).required()
      })
    )
    .required(),
  links: Joi.object({
    first: Joi.string().uri().required(),
    last: Joi.string().uri().required(),
    next: Joi.string().uri().allow(null), // Allows null for pagination limits
    prev: Joi.string().uri().allow(null),
    self: Joi.string().uri().required()
  }).required()
};

export const GET_AIRPORT_BY_ID_SCHEMA = {
  data: Joi.object({
    id: Joi.string().required(),
    type: Joi.string().valid('airport').required(),
    attributes: Joi.object({
      name: Joi.string().required(),
      city: Joi.string().required(),
      country: Joi.string().required(),
      iata: Joi.string().length(3).required(), // IATA code should be 3 characters long
      icao: Joi.string().length(4).required(), // ICAO code should be 4 characters long
      latitude: Joi.string()
        .pattern(/^[-+]?\d+(\.\d+)?$/)
        .required(), // Validates a latitude format
      longitude: Joi.string()
        .pattern(/^[-+]?\d+(\.\d+)?$/)
        .required(), // Validates a longitude format
      altitude: Joi.number().integer().required(),
      timezone: Joi.string().required()
    }).required()
  }).required()
};

export const GET_AIRPORTS_EMPTY_SCHEMA = {
  data: Joi.array().required()
};

export const GET_FAVORITE_AIRPORTS_SCHEMA = {
  data: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        type: Joi.string().valid('favorite').required(),
        attributes: Joi.object({
          airport: Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().required(),
            iata: Joi.string().length(3).required(),
            icao: Joi.string().length(4).required(),
            latitude: Joi.string().required(),
            longitude: Joi.string().required(),
            altitude: Joi.number().required(),
            timezone: Joi.string().required()
          }).required(),
          note: Joi.string().required()
        }).required()
      })
    )
    .required(),
  links: Joi.object({
    first: Joi.string().uri().required(),
    self: Joi.string().uri().required(),
    last: Joi.string().uri().required(),
    prev: Joi.string().uri().required(),
    next: Joi.string().uri().required()
  }).required()
};
