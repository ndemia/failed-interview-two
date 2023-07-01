import { user, item } from './types';

export const service = (() => {
	const user = {
		id: 1,
		login: 'user1',
		balance: 120,
	};

	const items = [
		{
			id: 1,
			name: 'Bronze sword',
			price: 8,
			quantity: 10,
			filename: 'bronze_sword',
		},
		{
			id: 2,
			name: 'Longsword',
			price: 31,
			quantity: 1,
			filename: 'longsword',
		},
		{
			id: 3,
			name: 'Battle axe',
			price: 12,
			quantity: 2,
			filename: 'battle_axe',
		},
		{
			id: 4,
			name: 'Wooden shield',
			price: 15,
			quantity: 5,
			filename: 'wooden_shield',
		},
	];

	function simulateRequest(request: user | item[]): Promise<user | item[]> {
		let randomNumber = Math.floor(Math.random() * 10) + 1;
		console.log(randomNumber);
		return new Promise((resolve, reject) => {
			// 2 out of 10 times this promise will reject, showing errors in the app
			// if (randomNumber % 2 == 0 || randomNumber % 3 == 0) {
			if (true) {
				setTimeout(() => {
					resolve(request);
				}, 1000);
			} else {
				setTimeout(() => {
					reject('failedFetch');
				}, 3000);
			}
		});
	}

	return {
		getUser: () => simulateRequest(user),
		getItems: () => simulateRequest(items),
	};
})();
