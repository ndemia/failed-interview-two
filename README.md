# Marketplace (Interview test, volume 2)

![picture](https://demia.me/assets/images/marketplace_x2.png)

## Context
Until now, this assignment has been the most difficult one. It's great to say that I've been able to correct a lot of previous mistakes that I've made in the first iteration of this project.

## Design
A design was provided, but I decided to ditch it and make a more fun one instead :)

## Pre-built part
- There is a web application with a pre-authenticated user.
- Each user has an amount of gold coins, which is shown somewhere in the top bar.
- There is a stock of items to offer, with a price in gold coins and an available amount. E.g.: 3 swords costing 35 each and 2 helmets costing 12 each and so on.
- For the simplicity of the setup, pre-built storage is in-memory (i.e. some static collections) and the requests to the “back-end” are simulated (see service.js).

## Part to be built
- [x] Make “Buy” button in the top bar show the dialog which will allow user to buy available items (to be displayed in a modal).
- [x] User can see available items and their price, can type in an amount to buy (integer value), or increment/decrement it with buttons + and -. Total cost is calculated in real-time and reflects changes to the amount.
- [x] If the total cost exceeds available money, message appears and buy button is disabled.
- [x] When user clicks "Buy", dialog is closed, item stocks are updated and user balance is updated. There is no need to store bought items.
- [x] User can also close the dialog via cancel or close buttons.
- [x] Make sure constraints with regard to number of items available and user balance are not violated. Make sure feedback is available to users if they cannot accomplish the action (e.g. item is no longer available or a request to the backend fails).
- [x] A “random” failure request is implemented for the “Buy” request (e.g. once every 3 requests) and the failure is handled.

## Implementation requirements
- Existing features should continue to function.
- ~~The requested design (and styling) for the "Buy" dialog is implemented (or as close as possible).~~
- The original test used jQuery but since I'm learning ~~vanilla JavaScript~~ TypeScript, I'll be converting everything to the latter.
- The domain logic described for the dialog is implemented (real-time updating, constraints/validation checks, updating of the user/stock on purchase, feedback on failure).
- A “random” failure request is implemented for the “Buy” request (e.g. once every 3 requests) and the failure is handled.
- You don’t need to have any database or backend (changes) though if you feel like giving it a try, you can. We do however expect you to write a service / proxy which returns promises to simulate requests to the backend (preferable including some random failures).

## Tech Stack
HTML, CSS (SASS), TypeScript.

## Process
HTML, CSS (SASS), TypeScript.

## Problems
The first time I did this project I didn't comprehend that the database worked as an API, and replaced it with a Class. It worked, but it was not the original intention. For this new iteration, I corrected this mistake, and reverted to the original code to keep that core functionality. 

The API handled requests for each information individually, which makes sense: you request the user, or you request the stock. Each request has a 1 in 3 chances to fail (by design). A lot of the checks during the purchasing process depend on this calls to validate the available item quantity, for example. As well as the item's price, specially when calculating total prices. With so many checks, calls, and potential failures, the challenge was to keep calls to a minimun, which I managed to achieve! Now it only makes one call to the API, and then it just passes that information around between the functions that need it.

## Accessibility
I learned about the inert attribute (and its polyfill), and how to use it to 'disable' parts of the website so that they are not keyboard accessible. In this particular case, disabling the 'back' of the website while the modal is open. I also got familiar with 'aria-live' and 'role' attributes so that screen readers can announce changes in the UI. For example, when prices update, alerts and error messages appear. And finally, I got more comfortable with aria-label, aria-hidden, and improving keyboard navigation overall.

## Learnings
Besides all the accessibility things previously mentioned, TypeScript allowed me to better understand JavaScript: validating types, understanding return values, making sure elements exits, etc. It has also helped me write better, more structered code. I got more comfortable with promises and asynchronous JavaScript, as well as with handling errors, and managing the flow of information, among other things. 

https://ndemia.github.io/marketplace/
