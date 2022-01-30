import Joi from 'joi';

const stringRequired = Joi.string().trim().required().max(800);
const nameSchema = Joi.string().trim().regex(/^[\sA-Za-z0-9]{1,}$/);

const Schema = {
        blogCreate: Joi.object().keys({
                title: Joi.string().required().trim().min(10)
                        .error(new Error('Please Add a title to your blog of atleast 10 characters!')),
                description: Joi.string().required().min(250)
                        .error(new Error('Please describe your blog in atleast 250 characters!')),
        }),
        blogUpdate: Joi.object().keys({
                title: Joi.string().trim().min(10)
                        .error(new Error('Title must be atleast 10 characters!')),
                description: Joi.string().min(25).max(500)
                        .error(new Error('Description must be atleast 250 characters!')),
        }),
        signup: Joi.object().keys({
                email: Joi.string().required()
                        .regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{2,5}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'email')
                        .error(new Error('Please Add a valid email address')),
                firstName: nameSchema
                        .error(new Error('firstname can only contain letters and numbers')),
                surName: nameSchema
                        .error(new Error('Surname can only contain letters and numbers')),
                password: stringRequired
                        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/)
                        .error(new Error('password must be atleast 8 characters with atleast one lowercase letter, one uppercase letter and a special character')),
                role: Joi.string()
        }),
        login: Joi.object().keys({
                email: Joi.string().required()
                        .error(new Error('Email is required')),
                password: stringRequired
                        .error(new Error('password is required')),
        }),
};

export default Schema;
