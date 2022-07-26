import Joi from "joi";

const searchPortfolioJoi = Joi.object({
  option: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional(),
  value: Joi.string().optional(),
  orderBy: Joi.string().optional(),
  skill: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional(),
  page: Joi.string().required(),
});

const searchQnaJoi = Joi.object({
  value: Joi.string().empty("").optional(),
  page: Joi.string().required(),
});

export { searchPortfolioJoi, searchQnaJoi };
