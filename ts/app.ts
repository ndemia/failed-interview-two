// Original test code
// $(function () {
// 	service.getUser()
// 		.then(function (user) {
// 			$("#user-name").text(user.login);
// 			$("#gold-balance").text(user.balance);
// 		})
// 		.then(service.list)
// 		.then(function (items) {
// 			var container = $("#stock");
// 			items.forEach(function (item) {
// 				container.append(item.name + ": " + item.quantity + "<br/>");
// 			});
// 		});
// });

import { Service } from './service.js';
import './inert.min.js';

export const service = new Service();
export const currentStock = service.items;
const container = document.getElementById('stock') as HTMLUListElement;
const productsList = document.querySelector('.products__list') as HTMLUListElement;

export const showGoldBalance = (): void => {
	const goldBalance = document.getElementById('gold-balance') as HTMLSpanElement;
	goldBalance.innerText = `${service.user.balance} gold`;
};

const showUserName = (): void => {
	const userName = document.getElementById('user-name') as HTMLSpanElement;
	userName.innerText = `${service.user.login}`;
};

const showCurrentStock = (): void => {
	currentStock.forEach(item => {
		container.insertAdjacentHTML('beforeend',
			`<li class="dashboard__item">
				<img src="images/${item.filename}.png" class="item__image" alt="A ${item.name}"/>
				<div class="item__info">
					<h3 class="item__name">${item.name}</h3>
					<p class="item__quantity" data-item-id="${item.id}">Quantity: ${item.quantity}</p>
					<p class="item__price" data-item-id="${item.id}">Price: ${item.price} gold</p>
				</div>
			</li>`);
		productsList.insertAdjacentHTML('beforeend',
			`<li class="products__item">
			<div class="item__container">
				<div class="item__info">
					<img src="images/${item.filename}.png" class="item__image" alt="A ${item.name}">
					<p class="item__name">${item.name}</p>
				</div>
				<div class="item__actions" data-item-id="${item.id}">
					<button class="item__decrease" aria-label="Decrease ${item.name} quantity">-</button>
					<input type="number" name="item__quantity" class="item__quantity" value="0" min="0" max="${item.quantity}" data-item-id="${item.id}" aria-label="${item.name} quantity" role="status">
					<button class="item__increase" aria-label="Increase ${item.name} quantity">+</button>	
				</div>
				<span class="item__cost" role="status">0 gold</span>
			</div>
		</li>`);
	});
}

document.addEventListener('DOMContentLoaded', showUserName);
document.addEventListener('DOMContentLoaded', showGoldBalance);
document.addEventListener('DOMContentLoaded', showCurrentStock);