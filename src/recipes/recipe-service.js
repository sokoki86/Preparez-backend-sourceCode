const RecipeServices = {
    getAllRecipes(knex) {
        return knex.select('*').from('recipe_table')
    },
    insertRecipe(knex, newRecipe) {
        return knex
        .insert(newRecipe)
        .into('recipe_table')
        .returning('*')
        .then(rows => {
            return rows[0]
        })

    },
    getById(knex, recipeId) {
        return knex.from('recipe_table').select('*').where('recipe_id', recipeId).first()
    },
    getByText(knex, searchText) {
        console.log('%'+searchText+'%'+'');
        return knex.select('*').where('recipe_name', 'like', `%${searchText}`).from('recipe_table')
    },
    deleteRecipe(knex, recipe_id) {
        return knex('recipe_table')
        .where({recipe_id})
        .delete()
    },
    updateRecipe(knex, recipe_id, newRecipeFields) {
        return knex('recipe_table')
        .where({recipe_id})
        .update(newRecipeFields)
    },
}


module.exports = RecipeServices