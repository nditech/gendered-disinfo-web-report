'use strict'

// import schema validation lib
import * as Joi from 'joi'

// Constants
const supported_platform_types = ['facebook', 'youtube', 'twitter', 'telegram']

const engagement = Joi.object({
    views: Joi.number().integer().allow(null),
    reactions: Joi.number().integer().allow(null),
    shares: Joi.number().integer().allow(null),
    comments: Joi.number().integer().allow(null)
})

const submission = Joi.object({
    source_name: Joi.string().required(),
    source_endpoint: Joi.string().required(),
    source_type: Joi.string().valid(...supported_platform_types).required(),
    post_id: Joi.string().required(),
    published_at: Joi.date().required(),
    url: Joi.string().required(),
    engagement: engagement.required(),
    lexicon_match: Joi.array().min(0).items(Joi.string()).required(),
    results: Joi.object({}).unknown(true).required(),
    of_interest: Joi.boolean()
})

const submissions = Joi.array().items(submission).required()

export function validate (obj) {
    // make sure the schema is valid
    const result = submissions.validate(obj)

    // if there is an error
    const { error } = result
    if (error) {
        return [false, error]
    }

    return [true, null]
}
