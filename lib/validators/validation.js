import Joi from "joi";

export const login_schema = Joi.object({
  address: Joi.string()
    .required(),
});

export const register_schema = Joi.object({
  first_name: Joi.string()
    .min(3)
    .max(30)
    .empty("")
    .default(""),
  last_name: Joi.string()
    .min(3)
    .max(30)
    .empty("")
    .default(""),
  user_id: Joi.string()
    .min(3)
    .max(15)
    .empty("")
    .default(""),
  profile_img: Joi.string()
    .uri()
    .empty("")
    .default(""),
});

export const verify_schema = Joi.object({
  address: Joi.string()
    .required()
});