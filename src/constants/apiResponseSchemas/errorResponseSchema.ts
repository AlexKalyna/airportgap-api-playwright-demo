import Joi from 'joi';

export const ERROR_SCHEMA = {
  errors: Joi.array()
    .items(
      Joi.object({
        status: Joi.string().required(),
        title: Joi.string().required(),
        detail: Joi.string().required()
      }).required()
    )
    .required()
};
