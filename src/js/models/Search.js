import axios from 'axios';

export default class Search {
	constructor(query) {
		this.query = query;
	}

	async getResults() {
		const PROXY = 'https://cors-anywhere.herokuapp.com/';
		const APP_ID = '422e258e';
		const APP_KEY = '0f46c275df4555f0f6f5f1d364283e9a';
		try {
			// const res = await axios(
			// 		`https://forkify-api.herokuapp.com/api/search?q=${query}`
			// 	);
			// http://www.recipepuppy.com/api/?i=onions,garlic&q=omelet&p=3
			const res = await axios(
				`https://api.edamam.com/search?q=${this.query}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=30`
			);

			// const res = await axios(
			// 	`${PROXY}http://www.recipepuppy.com/api/?q=${this.query}`
			// );
			this.result = res.data.hits;
			console.log(res.data);
			console.log('----------------------------------------------');
			// console.log(this.result);
		} catch (error) {
			console.log(error);
		}
	}
}
