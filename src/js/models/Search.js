import axios from 'axios';
import { APP_ID, APP_KEY } from '../config';

export default class Search {
	constructor(query) {
		this.query = query;
	}

	async getResults() {
		try {
			const res = await axios(
				`https://api.edamam.com/search?q=${this.query}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=50`
			);

			this.result = res.data.hits;
			// console.log(res.data);
			// console.log('----------------------------------------------');
			// console.log(this.result);
		} catch (error) {
			console.log('catch ' + error);
		}
	}
}
