$(function () {
	service
		.getUser()
		.then(function (user) {
			$('#user-name').text(user.login);
			$('#gold-balance').text(user.balance);
		})
		.then(service.list)
		.then(function (items) {
			var container = $('#stock');
			items.forEach(function (item) {
				container.append(item.name + ': ' + item.quantity + '<br/>');
			});
		});

	$('#buy-items-navigation-option').on('click', function (args) {
		args.preventDefault();
		$('.market').show();
	});

	$('.close-market').on('click', function (args) {
		args.preventDefault();
		$('.market').hide();
	});
});
