import Joi from "joi";

export const login_schema = Joi.object({
  address: Joi.string()
    .required(),
});

export const register_schema = Joi.object({
  fname: Joi.string()
    .min(3)
    .max(30)
    .empty("")
    .default(""),
  lname: Joi.string()
    .min(1)
    .max(30)
    .empty("")
    .default(""),
  user_id: Joi.string()
    .min(3)
    .max(15)
    .required(),
  address: Joi.string()
    .required(),
  chain_id: Joi.number()
    .required(),
  wallet_name: Joi.string()
    .uri()
    .empty(""),
  wallet_type: Joi.string()
    .uri()
    .empty("")
});

export const verify_schema = Joi.object({
  address: Joi.string()
    .required(),
  chain_id: Joi.number()
    .required(),
});

export const user_id_verify_schema = Joi.object({
  user_id: Joi.string()
    .required()
});