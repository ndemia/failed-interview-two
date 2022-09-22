// Original test code
// function simulateSuccessfulRequest(result) {
//     var deferred = $.Deferred();

//     setTimeout(
//         function() {
//             deferred.resolve(result);
//         }, 
//         Math.random() * 100
//     );

//     return deferred.promise();
// }

// function simulateFailureRequest() {
//     var deferred = $.Deferred();

//     setTimeout(
//         function() {
//             deferred.reject();
//         }, 
//         Math.random() * 100
//     );

//     return deferred.promise();
// }

// return {
//     getUser: function() {
//         return simulateSuccessfulRequest(user);
//     },
//     list: function() {
//         return simulateSuccessfulRequest(items);
//     }
// };

class Service {
    constructor() {

        this.user = {
            id : 1,
            login : "User1",
            balance : 120
        }

        this.items = [
            {
                id : 1,
                name : "Bronze sword",
                price : 8,
                quantity : 10,
                filename: "bronze_sword"
            },
            {
                id : 2,
                name : "Longsword",
                price : 31,
                quantity : 1,
                filename: "longsword"
            },
            {
                id : 3,
                name : "Battle axe",
                price : 12,
                quantity : 2,
                filename: "battle_axe"
            },
            {
                id : 4,
                name : "Wooden shield",
                price : 15,
                quantity : 5,
                filename: "wooden_shield"
            }
        ]
    }

    // Simulate a fail once every three times, or almost three times.
    simulateRequest() {

        return new Promise((resolve, reject) => {

            setTimeout(() => {
                let rand = Math.floor(Math.random() * 10) + 1;
            
                if (rand % 2 === 0 || rand % 3 === 0) {
                    resolve();
                } else {
                    reject();
                };
            }, 2000)

        });
    }
}

const service = new Service();