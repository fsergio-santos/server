
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('users', table => {
        table.string('url',200)
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('users', table => {
        table.dropColumn('url')
    })
};
