const joi = require("joi");

module.exports.ListingSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    location: joi.string().required(),
    country: joi.string().required(),
    price: joi.number().required().min(0),
    img: joi.string().uri().allow('', null).optional()
}).options({ convert: true });

module.exports.Reviewschema = joi.object({
    review: joi.object({
        comment: joi.string().required(),
        ratings: joi.number().required().min(1).max(5)
    }).required()
});
