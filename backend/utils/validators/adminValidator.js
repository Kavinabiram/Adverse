const Joi = require('joi');

/**
 * Validates driver creation request
 */
const createDriverSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Name is required'
    }),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be 10 digits',
        'any.required': 'Phone number is required'
    }),
    auto_number: Joi.string().required().messages({
        'any.required': 'Auto number is required'
    }),
    email: Joi.string().email().optional(),
    driver_code: Joi.string().optional()
});

/**
 * Validates tablet enrollment request
 */
const enrollTabletSchema = Joi.object({
    tablet_uid: Joi.string().required().messages({
        'any.required': 'Tablet UID is required'
    })
});

/**
 * Validates tablet assignment request
 */
const assignTabletSchema = Joi.object({
    tablet_id: Joi.string().guid({ version: 'uuidv4' }).required().messages({
        'string.guid': 'Invalid tablet ID format',
        'any.required': 'Tablet ID is required'
    }),
    driver_id: Joi.string().guid({ version: 'uuidv4' }).required().messages({
        'string.guid': 'Invalid driver ID format',
        'any.required': 'Driver ID is required'
    })
});

/**
 * Validates ad creation request (metadata part)
 */
const createAdSchema = Joi.object({
    company_id: Joi.string().guid({ version: 'uuidv4' }).required(),
    title: Joi.string().required(),
    description: Joi.string().allow('', null),
    type: Joi.string().valid('Video', 'Poster').required(),
    duration_seconds: Joi.number().integer().min(1).required(),
    zone_ids: Joi.array().items(Joi.string().guid({ version: 'uuidv4' })).optional()
});

module.exports = {
    createDriverSchema,
    enrollTabletSchema,
    assignTabletSchema,
    createAdSchema
};
