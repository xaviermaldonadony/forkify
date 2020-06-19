// Controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
	Search object
	Current recipe object
	Shopping list object
	liked recipes
*/

const state = {};
const controlSearch = async () => {
	// 1 Get query from view
	const query = searchView.getInput();
	// console.log(query);
	if (query) {
		// 2 New Search object and add to state
		state.search = new Search(query);

		// 3 Prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);
		try {
			// 4 search for recipes
			await state.search.getResults();

			// 5 Render results on UI
			clearLoader();
			searchView.renderResults(state.search.result);
			console.log('result ', state.search.result);
		} catch (error) {
			alert('Something wrong with search...');
			clearLoader();
		}
	}
};
elements.searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const gotoPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, gotoPage);
	}
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
	let id = window.location.hash.replace('#', '');

	if (state.search && state.search.result !== undefined) {
		// Highlight selected search item
		searchView.highlightSelected(id);
		id = id.replace(/(?:.*?\/){1}/, '').split('-');
		// Create new recipe object
		state.recipe = new Recipe(state.search.result[id[1]].recipe);

		// Set loader to a parent
		renderLoader(elements.recipe);
		// Get recipe data
		state.recipe.getRecipe();
		console.log('before calling recipe helper', state.recipe);
		controlRecipeHelper();
	}
	//only if the id exsists. and ui is not filled (state.search does not exsist).
	//  example would be a bookmark
	// else if (id[0] !== '') {
	else if (id !== '') {
		console.log(id);
		id = id.replace(/(?:.*?\/){1}/, '').split('-');
		state.recipe = new Recipe(false, id);
		renderLoader(elements.recipe);
		try {
			await state.recipe.getRecipe();
			// Set loader to a parent
			controlRecipeHelper();
			console.log('in control recipe', state.recipe);
		} catch (error) {
			alert('Error processing recipe');
		}
	}
};

//Helps the controller recipe set up the view
const controlRecipeHelper = () => {
	// prepare ui for changes
	recipeView.clearRecipe();
	state.recipe.parseIngredients();
	clearLoader();
	// Render recipe
	recipeView.renderRecipe(state.recipe);
};

['hashchange', 'load'].forEach((event) =>
	window.addEventListener(event, controlRecipe)
);

// Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
	console.log(state.recipe);
	if (!state.recipe.formatable) {
		// temp solution since the count of the recipe is a string/symbol "¾"
		console.log('not formatable ');
		return;
	}
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		// Decreae button is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches('btn-increase, .btn-increase *')) {
		// Increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	}
});
