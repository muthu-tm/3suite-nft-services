import Joi from "joi";

export const login_schema = Joi.object({
  address: Joi.string()
    .required(),
  chain_id: Joi.number()
    .required(),
});

export const register_schema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .empty("")
    .default(""),
  user_id: Joi.string()
    .min(3)
    .max(15)
    .required(),
  bio: Joi.string()
    .allow("")
    .optional(),
  img: Joi.string()
    .allow("")
    .optional(),
  banner: Joi.string()
    .allow("")
    .optional(),
  preferences: Joi.array()
    .items(Joi.string()
      .optional())
    .optional()
    .default([]),
  address: Joi.string()
    .required(),
  chain_id: Joi.number()
    .required(),
  // metamask, temple, etx
  wallet_name: Joi.string()
    .uri()
    .empty(""),
  //EVM, Tezos.,
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