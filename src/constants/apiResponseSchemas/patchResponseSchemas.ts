import Joi from 'joi';

export const PATCH_FAVORITE_AIRPORT_BY_ID_SCHEMA = {
  data: Joi.object({
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
  }).required()
};
