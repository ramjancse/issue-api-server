'use strict';

/**
 *  contact controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact.contact', ({strapi}) => ({
    async delete(ctx) {
        try {
            const { id } = ctx.params;
            const { id: authId } = ctx.state.user;
            const contact = await strapi.entityService.findOne('api::contact.contact', +id, {
                populate: 'author'
            });
    
            if (!contact) return ctx.notFound('contact is not found to be deleted');
            if (contact.author.id !==authId ) {
                return ctx.unauthorized('You are not the owner of the contact');
            }
            const response = super.delete(ctx);
            return response;  
        } catch (error) {
            ctx.InternalServererror('Unknown Server Error')
        }
    },

    async create(ctx) {
        try {
        const { id } = ctx.state.user;  
        ctx.request.body.data.author = id;
        const response = await super.create(ctx);
        return response;
        } catch (error) {
            ctx.InternalServererror('Unknown Error');
        }
        
    },

    async update(ctx) {
        try {
            const { id } = ctx.params;
        const { id: authId } = ctx.state.user;
        const contact = await strapi.entityService.findOne('api::contact.contact', +id, {
            populate: 'author'
        });

        if (!contact) return ctx.notFound('contact is not found to be update');
        if (contact.author.id !==authId ) {
            return ctx.unauthorized('You are not the owner of the contact');
        }
        const response = await super.update(ctx);
        return response;
        } catch (err) {
            ctx.InternalServererror('Unknow Error');
        }
        
    },

}));
