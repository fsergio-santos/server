
exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary().unsigned()
        table.string('username',100).notNull()
        table.string('nome',100).notNull()
        table.string('email',100).notNull().unique()
        table.string('password',100).notNull()
        table.boolean('ativo').notNull().defaultTo(true)
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users')
};
