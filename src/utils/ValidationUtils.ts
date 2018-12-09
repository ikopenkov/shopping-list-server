import { body } from 'express-validator/check';

const getCommonNameValidation = (field: string = 'name') =>
    body(
        field,
        'name should be string with length between 1 and 100 characters',
    )
        .isString()
        .isLength({ min: 1, max: 100 })
        .optional();

export const ValidationUtils = {
    getCommonNameValidation,
};
