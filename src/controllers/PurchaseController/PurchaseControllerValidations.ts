import { body } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

const purchaseBoughtValidation = body('bought')
  .isBoolean()
  .optional();

const purchaseBodyValidation = body('number', 'number should be number')
  .isNumeric()
  .optional();

const addPurchaseValidation = [
  body('name', 'name should be string with length between 1 and 100 characters')
    .isString()
    .isLength({ min: 1, max: 100 }),
  purchaseBoughtValidation,
  purchaseBodyValidation,
  sanitizeBody('*')
    .trim()
    .escape(),
];

const updatePurchaseValidation = [
  body('name', 'name should be string with length between 1 and 100 characters')
    .isString()
    .isLength({ min: 1, max: 100 })
    .optional(),
  purchaseBoughtValidation,
  purchaseBodyValidation,
  sanitizeBody('*')
    .trim()
    .escape(),
];

export const PurchaseControllerValidations = {
  addPurchaseValidation,
  updatePurchaseValidation,
};
