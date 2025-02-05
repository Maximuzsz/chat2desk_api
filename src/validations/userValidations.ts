import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  nome: Joi.string().required(),
  senha: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
});