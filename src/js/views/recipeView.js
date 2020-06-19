import { elements } from './base';
import { Fraction } from 'fractional';
// import { math } from 'mathjs';

export const clearRecipe = () => {
	elements.recipe.innerHTML = '';
};

const formatCount = (count) => {
	if (count) {
		// count = 2.5 -> 2 1/2
		// count = 0.5 ->  1/2

		let [int, dec] = count
			.toString()
			.split('.')
			.map((el) => parseInt(el, 10));
		// console.log('int dec and count ', int, dec, count);
		// console.log('typeof count', typeof count);
		if (!dec) return count;

		if (int === 0) {
			const fr = generateFraction(dec, count);
			// generateFraction(int, dec);
			console.log('second if recipeview ', int, dec);
			// const fr = new Fraction(count);
			return `${fr.numerator}/${fr.denominator}`;
		} else {
			// 2.5 - 2
			const fr = new Fraction(count - int);
			return `${int} ${fr.numerator}/${fr.denominator}`;
		}
	}

	return '?';
};

// returns fraction, checks special case if the number is repeating after the decimal place
const generateFraction = (dec, count) => {
	const n = parseInt(dec.toString().charAt(0), 10);

	// console.log('dec to string ', n);
	console.log('gen frac ', dec, count);
	const reg = /\b(\d)\1+\b$/;
	if (reg.test(dec)) {
		// ex .3333
		// solve 10x =  3.333
		//       -x  = -0.333
		//        9x =  3
		//         x =  3/9
		// should be modified if int is not 0 and decimal is also repeating
		console.log('true repeating ');
		return new Fraction(n, 9);
	} else {
		console.log('did not hit if');
		return new Fraction(count);
	}
};
const createIngredient = (ingredient) => `
  <li class="recipe__item">
      <svg class="recipe__icon">
          <use href="img/icons.svg#icon-check"></use>
      </svg>
      <div class="recipe__count">${formatCount(ingredient.count)}</div>
      <div class="recipe__ingredient">
          <span class="recipe__unit">${ingredient.unit}</span>
          ${ingredient.ingredient}
      </div>
  </li>`;

export const renderRecipe = (recipe) => {
	const markup = `
            <figure class="recipe__fig">
                <img src="${recipe.img}" alt="${
		recipe.title
	}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>

            <div class="recipe__details">
               <!-- <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">45</span>
                    <span class="recipe__info-text"> minutes</span>
                </div> -->
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${
											recipe.servings
										}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart-outlined"></use>
                    </svg>
                </button>
            </div>

            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                  ${recipe.ingredients
										.map((el) => createIngredient(el))
										.join('')} 
                

                </ul>

                <button class="btn-small recipe__btn">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${
											recipe.author
										}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${
									recipe.url
								}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>

                </a>
            </div>
  `;
	elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

// 24
export const updateServingsIngredients = (recipe) => {
	// update servings
	document.querySelector('.recipe__info-data--people').textContent =
		recipe.servings;
	// Update ingredients
	const countElements = Array.from(document.querySelectorAll('.recipe__count'));
	countElements.forEach(
		(el, i) => (el.textContent = formatCount(recipe.ingredients[i].count))
	);
};
