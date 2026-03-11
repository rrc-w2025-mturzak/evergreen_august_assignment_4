import Joi from "joi";

// Post operation schemas organized by request part
export const postSchemas = {
    // POST /loan - Create new post
    create: {
        body: Joi.object({
            applicant: Joi.string().required().messages({
                "any.required": "Loan applicant is required",
                "string.empty": "Loan applicant cannot be empty",
            }),
            amount: Joi.number().required().messages({
                "any.required": "Loan amount is required",
                "string.empty": "Loan amount cannot be empty",
            }),
            status: Joi.string().required().messages({
                "any.required": "status is required",
                "string.empty": "status cannot be empty",
            }),
        }),
    },

    // GET /loan/:id - Get single post
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Loan ID is required",
                "string.empty": "Loan ID cannot be empty",
            }),
        }),
        query: Joi.object({
            include: Joi.string().valid("comments", "author").optional(),
        }),
    },

    // PUT /loan/:id - Update post
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Loan ID is required",
                "string.empty": "Loan ID cannot be empty",
            }),
        }),
        body: Joi.object({
            applicant: Joi.string().required().messages({
                "any.required": "Loan applicant is required",
                "string.empty": "Loan applicant cannot be empty",
            }),
            amount: Joi.number().required().messages({
                "any.required": "Loan amount is required",
                "string.empty": "Loan amount cannot be empty",
            }),
            status: Joi.string().required().messages({
                "any.required": "status is required",
                "string.empty": "status cannot be empty",
            }),
        }),
    },

    // DELETE /loan/:id - Delete post
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Loan ID is required",
                "string.empty": "Loan ID cannot be empty",
            }),
        }),
    },
};