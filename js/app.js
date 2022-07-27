// $(function() {
//     service.getUser()
//         .then(function (user) {
//             $("#user-name").text(user.login);
//             $("#gold-balance").text(user.balance);
//         })
//         .then(service.list)
//         .then(function(items) {
//             var container = $("#stock");
//             items.forEach(function (item) {
//                 container.append(item.name + ": " + item.quantity + "<br/>");
//             });
//         });
// });

document.getElementById('gold-balance').innerText = `${service.user.balance}`
document.getElementById('user-name').innerText = `${service.user.login}`


document.querySelector('#buy').addEventListener('click', function() {

    document.querySelector('.market').style.display = 'block';

});

document.querySelector('.action-cancel').addEventListener('click', function() {

    document.querySelector('.market').style.display = 'none';

});

document.querySelector('.close-market').addEventListener('click', function() {

    document.querySelector('.market').style.display = 'none';

});