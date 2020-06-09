import axios from 'axios';
import { APP_ID, APP_KEY } from '../config';

export default class Recipe {
	// resemebles an overloaded constructor, if we don't have recipes from Search
	// Make an async call and get that recipe based of id
	constructor(recipe, id = [-1, -1]) {
		this.recipe = recipe;
		this.id = id[1];
		this.query = id[0];
	}

	async getRecipe() {
		if (!this.recipe) {
			try {
				await this.callForRecipe();
				this.setRecipe();
			} catch (error) {}
		} else {
			this.setRecipe();
		}
	}

	async callForRecipe() {
		try {
			const res = await axios(
				`https://api.edamam.com/search?q=${this.query}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=50`
			);

			// console.log('async call for recipe  ', res.data.hits[this.id]);
			this.recipe = res.data.hits[this.id].recipe;
		} catch (error) {}
	}
	setRecipe() {
		this.ingredients = this.recipe.ingredientLines;
		// this.ingredientsAndWeight = this.recipe.ingredients;
		this.title = this.recipe.label;
		this.author = this.recipe.source;
		this.healthLabels = this.recipe.healthLabels;
		this.servings = this.recipe.yield;
		this.instructions = this.recipe.url;
		this.image = this.recipe.image;
	}
	parseIngredients() {
		const unitsLong = [
			'ounce',
			'ounces',
			'cups',
			'tablespoon',
			'tablespoons',
			'teaspoon',
			'teaspoons',
		];
		const unitsShort = ['oz', 'oz', 'cup', 'tbsp', 'tbsp', 'tsp', 'tsp'];
		const newIngredients = this.ingredients.map((el) => {
			// Uniform units
			let ingredient = el.toLowerCase();
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitsShort[i]);
			});
			//  remove parentheses
			ingredient = ingredient.replace(/ *\([^)]*\) */g, '');

			//  Parse ingredients into count, unit and ingredient
			const arrIng = ingredient.split(' ');
			const unitIndex = arrIng.findIndex((el2) => unitsShort.includes(el2));

			let objIng;
			if (unitIndex > -1) {
				// unit exsist
				// Ex. 4 1/2 cups, arrCount is [4, 1/2]
				// Ex. 4 cups, arrCount is [4]
				const arrCount = arrIng.slice(0, unitIndex);
				let count;

				if (arrCount.length === 1) {
					count = eval(arrIng[0].replace('-', '+'));
				} else {
					count = eval(arrIng.slice(0, unitIndex).join('+'));
				}
				objIng = {
					count,
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(' '),
				};
			} else if (parseInt(arrIng[0], 10)) {
				//There is NO unit, but 1st element is number
				objIng = {
					count: parseInt(arrIng[0], 10),
					unit: '',
					ingredient: arrIng.slice(1).join(' '),
				};
			} else if (unitIndex === -1) {
				// no unit
				objIng = {
					count: 1,
					unit: '',
					ingredient,
				};
			}

			return objIng;
		});

		this.ingredients = newIngredients;
	}
}

// 21 19
