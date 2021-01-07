const UserServices = {
    getUser(knex) {
        return knex.select('*').from('user_table')
    },
    insertUser(knex, newUser) {
        return knex
        .insert(newUser)
        .into('user_table')
        .returning('*')
        .then(rows => {
            return rows[0]
        })

    },
    getById(knex, userId) {
        return knex.from('user_table').select('*').where('user_id', userId).first()
    },
    login(knex, username,password) {
        return knex.from('user_table').select('username','email').where('username', username).where('password',password).first()
    },
    deleteUser(knex, user_id) {
        return knex('user_table')
        .where({user_id})
        .delete()
    },
    updateUser(knex, user_id, newUserFields) {
        return knex('user_table')
        .where({user_id})
        .update(newUserFields)
    },
}


module.exports = UserServices