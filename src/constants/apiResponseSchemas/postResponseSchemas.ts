import Joi from 'joi';

const airportSchema = {
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  iata: Joi.string().length(3).required(),
  icao: Joi.string().length(4).required(),
  latitude: Joi.string()
    .pattern(/^[-+]?\d+(\.\d+)?$/)
    .required(),
  longitude: Joi.string()
    .pattern(/^[-+]?\d+(\.\d+)?$/)
    .required(),
  altitude: Joi.number().integer().required(),
  timezone: Joi.string().required()
};

export const AIRPORT_DISTANCE_SCHEMA = {
  data: Joi.object({
    id: Joi.string().required(),
    type: Joi.string().valid('airport_distance').required(),
    attributes: Joi.object({
      from_airport: Joi.object(airportSchema).required(),
      to_airport: Joi.object(airportSchema).required(),
      kilometers: Joi.number().required(),
      miles: Joi.number().required(),
      nautical_miles: Joi.number().required()
    }).required()
  }).required()
};

export const USER_TOKEN_SCHEMA = {
  token: Joi.string().alphanum().length(24).required()
};

export const USER_FAVORITES_SCHEMA = {
  data: Joi.object({
    id: Joi.string().required(),
    type: Joi.string().valid('favorite').required(),
    attributes: Joi.object({
      airport: Joi.object({
        id: Joi.number().integer().positive().required(),
        name: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        iata: Joi.string().length(3).required(),
        icao: Joi.string().length(4).required(),
        latitude: Joi.string()
          .regex(/^[-+]?[0-9]*\.?[0-9]+$/)
          .required(),
        longitude: Joi.string()
          .regex(/^[-+]?[0-9]*\.?[0-9]+$/)
          .required(),
        altitude: Joi.number().integer().required(),
        timezone: Joi.string().required()
      }).required(),
      note: Joi.string().required()
    }).required()
  }).required()
};
