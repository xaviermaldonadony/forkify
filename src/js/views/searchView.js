import { elements } from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
	elements.searchInput.value = '';
};

export const clearResults = () => {
	elements.searchResList.innerHTML = '';
	elements.searchResPages.innerHTML = '';
};

const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];

	if (title.length > limit) {
		title.split(' ').reduce((acc, curr) => {
			if (acc + curr.length <= limit) {
				newTitle.push(curr);
			}
			return acc + curr.length;
		}, 0);
		// return the result
		return `${newTitle.join(' ')}...`;
	}

	return title;
};
const renderRecipe = (id, recipe) => {
	const markup = `
	  <li>
	  <a class="results__link" href="#${recipe.shareAs.replace(
			/(?:.*?\/){4}/,
			''
		)}-${id}"> <figure class="results__fig">
	          <img src="${recipe.image}" alt="${recipe.label}">
	      </figure>
	      <div class="results__data">
	          <h4 class="results__name">${limitRecipeTitle(recipe.label)}</h4>
	          <p class="results__author">${recipe.source}</p>
	      </div>
	  </a>
	  </li>`;
	elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `

	<button class="btn-inline results__btn--${type}" data-goto=${
	type === 'prev' ? page - 1 : page + 1
}>
<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
			<svg class="search__icon">
					<use href="img/icons.svg#icon-triangle-${
						type === 'prev' ? 'left' : 'right'
					}"></use>
			</svg>
	</button>
`;

const renderButtons = (page, numResults, resPerPage) => {
	const pages = Math.ceil(numResults / resPerPage);
	let button;

	if (page === 1 && pages > 1) {
		// Button to go to next page
		button = createButton(page, 'next');
	} else if (page < pages) {
		button = ` ${createButton(page, 'prev')}${createButton(page, 'next')}`;
		// Both Buttons
	} else if (page === pages && pages > 1) {
		// Only button to go to prev page
		button = createButton(page, 'prev');
	}

	elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
	// Render results of current page
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;
	let id = start;

	recipes
		.slice(start, end)
		.forEach((index) => renderRecipe(id++, index.recipe));

	//  Render pagination buttons
	renderButtons(page, recipes.length, resPerPage);
};
