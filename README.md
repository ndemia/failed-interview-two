# Marketplace (Failed interview test, volume 2)

![picture](https://raw.githubusercontent.com/ndemia/demia.me/main/assets/images/interview02.png)

As soon as I received this test, and read it, I realised that it was not a possibility with my current knowledge at that point in time. I didn't understand some of the requirements to make it work, so I ended the process. So here I am, a couple of years later, trying to make it work. The original test used jQuery but since I'm learning vanilla JS, I'll be converting everything to the latter.

## Design

A design was provided, but I decided to ditch it and make a more fun one instead.

## Pre-built part

- There is a web application with a pre-authenticated user.
- Each user has an amount of gold coins, which is shown somewhere in the top bar.
- There is a stock of items to offer, with a price in gold coins and an available amount. E.g.: 3 swords costing 35 each and 2 helmets costing 12 each and so on.
- For the simplicity of the setup, pre-built storage is in-memory (i.e. some static collections) and the requests to the “back-end” are simulated (see service.js).

## Part to be built

- [x] Make “Buy” button in the top bar show the dialog which will allow user to buy available items.
- [x] User can see available items and their price, can type in an amount to buy (integer value), or increment/decrement it with buttons + and -. Total cost is calculated in real-time and reflects changes to the amount.
- [x] If the total cost exceeds available money, message appears and buy button is disabled.
- [x] When user clicks "Buy", dialog is closed, item stocks are updated and user balance is updated. There is no need to store bought items.
- [x] User can also close the dialog via cancel or close buttons.
- [x] Make sure constraints with regard to number of items available and user balance are not violated. Make sure feedback is available to users if they cannot accomplish the action (e.g. item is no longer available or a request to the backend fails).
- [x] A “random” failure request is implemented for the “Buy” request (e.g. once every 3 requests) and the failure is handled.

## Implementation requirements

- Existing features should continue to function.
- ~~The requested design (and styling) for the "Buy" dialog is implemented (or as close as possible).~~
- The domain logic described for the dialog is implemented (real-time updating, constraints/validation checks, updating of the user/stock on purchase, feedback on failure).
- A “random” failure request is implemented for the “Buy” request (e.g. once every 3 requests) and the failure is handled.
- You don’t need to have any database or backend (changes) though if you feel like giving it a try, you can. We do however expect you to write a service / proxy which returns promises to simulate requests to the backend (preferable including some random failures).

https://ndemia.github.io/marketplace/
