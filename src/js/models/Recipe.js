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
		this.url = this.recipe.url;
		this.img = this.recipe.image;
		this.formatable = true;
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
		const units = [...unitsShort, 'kg', 'g'];
		const unitsLsymbols = [...unitsLong, '½', '¾', '1 ½', '¼'];
		const unitsSsymbols = [...unitsShort, '1/2', '3/4', '1 1/2', '1/4'];

		const newIngredients = this.ingredients.map((el) => {
			// Uniform units
			let ingredient = el.toLowerCase();

			unitsLsymbols.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitsSsymbols[i]);
			});
			//  remove parentheses
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

			//  Parse ingredients into count, unit and ingredient
			let arrIng = ingredient.split(' ');
			// removes from "" array
			arrIng = arrIng.filter((el2) => {
				return el2;
			});

			// Special case, "12 oz of cheese or 1 cup of cheese" find or and cut after it
			// another case, "4 or 5 fresh basil leaves, shredded"
			let unitIndex = arrIng.findIndex((el2) => el2 === 'or');
			if (unitIndex > 0) {
				console.log('arrIng and unit index ', unitIndex);
				console.log(arrIng);
				console.log('arrIng + 1', arrIng[unitIndex + 1]);
				console.log('true or false ', isNaN(arrIng[unitIndex + 1]));
				if (unitIndex === 1) {
					arrIng = arrIng.slice(unitIndex + 1, arrIng.length - 1);
				} else if (!isNaN(arrIng[unitIndex + 1])) {
					arrIng = arrIng.slice(0, unitIndex);
					console.log('else if ', arrIng);
				}
				console.log(arrIng);
			}

			unitIndex = arrIng.findIndex((el2) => units.includes(el2));

			let objIng;
			if (unitIndex > -1) {
				// unit exsist
				// Ex. 4 1/2 cups, arrCount is [4, 1/2]
				// Ex. 4 cups, arrCount is [4]
				const arrCount = arrIng.slice(0, unitIndex);
				let count;

				if (arrCount.length === 1) {
					// console.log('test ', arrIng[0].replace('-', '+'));
					// console.log('arrIng', arrIng);
					// console.log('arrCount length', arrCount.length, arrCount);
					try {
						count = eval(arrIng[0].replace('-', '+'));
					} catch (error) {
						// console.log('error parsing to units', error);
						// special case ["¾", "cup", "shredded", "cheese"]
						count = arrIng[0];
						this.formatable = false;
					}
				} else {
					// console.log('unitIndex', unitIndex);
					// console.log('in else parsing arrIng', arrIng);
					// count = eval(arrIng.slice(0, unitIndex).join('+'));
					// Removing the or should prevent error and try catch wont be needed
					// leaving code for now
					// count = eval(arrIng.slice(0, unitIndex).join('+'));
					try {
						count = eval(arrIng.slice(0, unitIndex).join('+'));
					} catch (error) {
						// error parsing
						//  ["1", "½", "cup", "pizza", "sauce", "of", "your", "choice"]
						//  tries to add "1"+ "½", the second digit is a symbol
						// console.log('in error ', arrIng.slice(0, unitIndex).join('+'));
						count = arrIng.slice(0, unitIndex).join(' ');
						this.formatable = false;
					}
				}
				objIng = {
					count,
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(' '),
				};
			} else if (parseInt(arrIng[0], 10)) {
				//There is NO unit, but 1st element is number
				// let temp = parseFloat(arrIng[0]);
				// console.log(' eval first digit ', eval(arrIng[0]));
				objIng = {
					count: eval(arrIng[0]),
					// count: parseInt(arrIng[0], 10),
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
	updateServings(type) {
		console.log('in update servings');
		// Servings
		const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

		// Ingredients
		this.ingredients.forEach((ing) => {
			ing.count *= newServings / this.servings;
		});

		this.servings = newServings;
	}
}
