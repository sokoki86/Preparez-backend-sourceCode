const express = require('express')
const xss = require('xss')
const RecipeServices = require('./recipe-service')

const recipesRouter = express.Router()
const jsonParser = express.json()

const serializeRecipe = recipe => ({
  recipe_id: recipe.recipe_id,
  recipe_name: xss(recipe.recipe_name),
  recipe_preptime: xss(recipe.recipe_preptime),
  recipe_ingredients: xss(recipe.recipe_ingredients),
  recipe_instructions: xss(recipe.recipe_instructions),
  category: recipe.category,
})

recipesRouter
  .route('/search/:searchtext')
  .get((req, res, next) => {
    console.log(req.params);
    RecipeServices.getByText(
      req.app.get('db'),
      req.params.searchtext
    )
      .then(recipes => {
        if (!recipes) {
          return res.status(404).json({
            error: { message: `Recipe doesn't exist` }
          })
        }
        // var recipesArray=[];
        // recipesArray.push(recipes)
        // res.recipes = recipesArray;
        //  res.recipes = recipes;
         console.log(recipes);
        res.json(recipes)
      })
      .catch(next)
  })

  recipesRouter
  .route('/')
  .put(jsonParser, (req, res, next) => {
    const { recipe_id,recipe_name, recipe_preptime, recipe_ingredients, recipe_instructions, category } = req.body
    const editRecipe = { recipe_name, recipe_preptime, recipe_ingredients, recipe_instructions, category }

    for (const [key, value] of Object.entries(editRecipe))
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }

    RecipeServices.updateRecipe(
      req.app.get('db'),
      recipe_id,
      editRecipe
    )
      .then(recipes => {
        res
          .status(201)
          .json({
            status:'Completed'
          })
      })
      .catch(next)
  })




recipesRouter
  .route('/')
  .get((req, res, next) => {
    RecipeServices.getAllRecipes(
      req.app.get('db')
    )
      .then(recipes => {
        res.json(recipes.map(serializeRecipe))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { recipe_name, recipe_preptime, recipe_ingredients, recipe_instructions, category } = req.body
    const newRecipe = { recipe_name, recipe_preptime, recipe_ingredients, recipe_instructions, category }

    for (const [key, value] of Object.entries(newRecipe))
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }

    RecipeServices.insertRecipe(
      req.app.get('db'),
      newRecipe
    )
      .then(recipes => {
        res
          .status(201)
          .location(`/recipes/${recipes.recipe_id}`)
          .json(serializeRecipe(recipes))
      })
      .catch(next)
  })

recipesRouter
  .route('/:recipe_id')
  .get((req, res, next) => {
    console.log(req.params);
    RecipeServices.getById(
      req.app.get('db'),
      req.params.recipe_id
    )
      .then(recipes => {
        if (!recipes) {
          return res.status(404).json({
            error: { message: `Recipe doesn't exist` }
          })
        }
        res.recipes = recipes;
        res.json(serializeRecipe(res.recipes))
      })
      .catch(next)
  })
recipesRouter
  .route('/:recipe_id')
  .delete((req, res, done) => {
    RecipeServices.deleteRecipe(
      req.app.get('db'),
      req.params.recipe_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(done)
  })

module.exports = recipesRouter