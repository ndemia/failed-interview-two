var service = (function () {
	var user = {
		id: 1,
		login: 'user1@example.com',
		balance: 120,
	};

	var items = [
		{
			id: 1,
			name: 'Bronze sword: low quality, low price',
			price: 8,
			quantity: 10,
		},
		{
			id: 2,
			name: 'Wooden shield',
			price: 15,
			quantity: 5,
		},
		{
			id: 3,
			name: 'Battle axe',
			price: 12,
			quantity: 2,
		},
		{
			id: 4,
			name: 'Longsword, carefully crafted to slay your enemies',
			price: 31,
			quantity: 1,
		},
	];

	function simulateSuccessfulRequest(result) {
		var deferred = $.Deferred();

		setTimeout(function () {
			deferred.resolve(result);
		}, Math.random() * 100);

		return deferred.promise();
	}

	function simulateFailureRequest() {
		var deferred = $.Deferred();

		setTimeout(function () {
			deferred.reject();
		}, Math.random() * 100);

		return deferred.promise();
	}

	return {
		getUser: function () {
			return simulateSuccessfulRequest(user);
		},
		list: function () {
			return simulateSuccessfulRequest(items);
		},
	};
})();
