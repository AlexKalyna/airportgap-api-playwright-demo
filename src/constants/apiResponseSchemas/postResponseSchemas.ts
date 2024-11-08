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
