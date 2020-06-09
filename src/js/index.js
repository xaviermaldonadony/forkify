// Controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
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
	id = id.replace(/(?:.*?\/){1}/, '').split('-');

	// console.log(id, ' control recipe length');
	// console.log('in controlR', id);
	// console.log('test result ', state.search.result);
	// if search object exsist we don't need to make an api call
	console.log();
	if (state.search && state.search.result !== undefined) {
		// Prepare UI for changes
		// Create new recipe object
		state.recipe = new Recipe(state.search.result[id[1]].recipe);

		// Get recipe data
		state.recipe.getRecipe();
		// Parse ingredients
		state.recipe.parseIngredients();
		// Render recipe
		console.log('in control recipe, recipe.search ', state.recipe);
		// use else if, only if the id exsists. and ui is not filled.
		//  example would be a bookmark
	} else if (id[0] !== '') {
		state.recipe = new Recipe(false, id);
		try {
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();
			console.log('in control recipe ', state.recipe);
		} catch (error) {
			alert('Erro processing recipe');
		}
	}
};

['hashchange', 'load'].forEach((event) =>
	window.addEventListener(event, controlRecipe)
);

//21
