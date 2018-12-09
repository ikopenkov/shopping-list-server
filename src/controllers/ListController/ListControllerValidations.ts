import { body } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

const listNameValidation = body(
  'name',
  'name should be string with length between 1 and 100 characters',
)
  .optional()
  .isString()
  .isLength({ min: 1, max: 100 });

const addListValidation = [
  listNameValidation,
  sanitizeBody('*')
    .trim()
    .escape(),
];

const updateListValidation = [
  listNameValidation,
  sanitizeBody('*')
    .trim()
    .escape(),
];

export const ListControllerValidations = {
  addListValidation,
  updateListValidation,
};
