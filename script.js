/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 100],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2024-02-18T12:01:20.894Z",
    "2024-02-21T12:01:20.894Z",
    "2024-02-24T12:01:20.894Z",
    "2024-02-25T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getUTCFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date, acc.local);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.local, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(Math.trunc(time % 60)).padStart(2, 0);

    //In each call, print the remaining time UI
    labelTimer.textContent = `${min}:${seconds}`;

    // Whene 0 soconds, stop timer and log out user

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get start`;
      //Create curent date
      containerApp.style.opacity = 0;
    }
    //Decries 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 300;
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// Experementing API

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    //Create curent date

    containerApp.style.opacity = 100;
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long", // 2-digit
      year: "numeric",
      weekday: "long",
    };
    const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getUTCFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  // Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  // const amount = +inputLoanAmount.value;

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// // LECTURES

// console.log(23 === 23.0);

// //Base 10 - 0 to 9. 1/10 = 0.1. 3/10 = 3.3333333
// // Binary base 2- 0 -1
// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3);

// // Conversion
// console.log(Number("23"));
// console.log(+"23");

// // Parsing
// console.log(Number.parseInt("30px", 10));
// console.log(Number.parseInt("e30", 10));

// console.log(Number.parseFloat(" 2.5rem     "));
// console.log(Number.parseInt("     2.5rem "));

// // console.log(parseFloat("     2.5rem "));

// // Check if value is NaN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN("20"));
// console.log(Number.isNaN(+"20x"));
// console.log(Number.isNaN(20 / 0));
// console.log(Number.isNaN(NaN));

// // Checking is value is number

// console.log(Number.isFinite(20));
// console.log(Number.isFinite("20"));
// console.log(Number.isFinite(+"20x"));
// console.log(Number.isFinite(20 / 0));

// console.log(Number.isInteger(20));
// console.log(Number.isInteger(20.0));
// console.log(Number.isInteger(23 / 0));

/////////////////////////////////////////////////

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(5, 18, "23", 11, 2));
// console.log(Math.max(5, 18, "23p", 11, 2));

// console.log(Math.min(5, 18, "23", 11, 2));

// console.log(Math.PI * Number.parseFloat("10px") ** 2);

// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;
// // 0...1 -> 0... (max - min) -> min...max
// console.log(randomInt(50, 52));

// // Rounding integers
// console.log(Math.round(23.3)); //23
// console.log(Math.round(23.9)); //24

// console.log(Math.ceil(23.3)); //24
// console.log(Math.ceil(23.9)); //24

// console.log(Math.floor(23.3)); //23
// console.log(Math.floor("23.9")); //23

// console.log(Math.trunc(23.3)); //23

// console.log(Math.trunc(-23.3)); //-23
// console.log(Math.floor(-23.3)); //-24

// // Rounding decimals
// console.log((2.7).toFixed(0)); //3
// console.log((2.7).toFixed(3)); //2.700
// console.log((2.345).toFixed(2)); //2.35
// console.log(+(2.345).toFixed(3)); // 2.345

/////////////////////////////////////////////////

// %
// console.log(5 % 2);
// console.log(5 / 2); // 5 = 2 * 2  + 1
// console.log(8 % 3);
// console.log(8 / 3); // 8 = 2 * 3 + 2

// console.log(6 % 2);
// console.log(6 / 2);

// console.log(7 % 2);
// console.log(7 / 2);

// const isEven = (n) => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(23));
// console.log(isEven(514));

// labelBalance.addEventListener("click", function () {
//   [...document.querySelectorAll(".movements__row")].forEach((row, i) => {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = "orangered";
//     }
//     if (i % 3 === 0) {
//       row.style.backgroundColor = "blue";
//     }
//     if (i % 4 === 0) {
//       row.style.backgroundColor = "orange";
//     }
//   });
// });

/////////////////////////////////////////////////

// // Underscores
// // 287,475,800,000
// const diamete = 287_475_800_000;
// console.log(diamete);

// const priceCentes = 245_99;
// console.log(priceCentes);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// const PI = 3.14_15;
// // not work _3.1415, 3.1415_, 3_.1415, 3._1415, 3.14__15
// console.log(PI);

// console.log(Number("24_1200")); // NaN
// console.log(parseInt("24_1200")); // 24

/////////////////////////////////////////////////

// // Big INT
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 2);
// console.log(2 ** 53 + 3);
// console.log(2 ** 53 + 4);

// console.log(931285731295713951367951651956139569n);
// console.log(BigInt(931285731295713));

// //Operators
// console.log(1000n + 10000n);
// console.log(123497195719057137905631516501561056n * 12984712947219471958n);
// // console.log(Math.sqrt(16n)); dont work

// const huge = 1238971292794124n;
// const num = 23;
// console.log(huge * BigInt(num));
// // console.log(huge * num); dont work

// console.log(20n > 15);
// console.log(20n === 20);
// console.log(typeof 20n);
// console.log(20n == 20);

// console.log(huge + " is Really big!!!");

// // Divisins
// console.log(10n / 3n);
// console.log(10 / 3);

/////////////////////////////////////////////////

//// Dates and Time
// Create a date
// const now = new Date();
// console.log(now);

// console.log(new Date("Sun Feb 25 2024 14:12:17"));
// console.log(new Date("December 24, 2015"));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2027, 10, 19, 15, 23, 5));
// console.log(new Date(2027, 10, 32));

// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// // Working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2142242580000));

// console.log(Date.now());

// future.setFullYear(2040); // And setMonth setDate setHours...
// console.log(future);

/////////////////////////////////////////////////

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(Number(future));

// const calcDaysPassed = (date1, date2) =>
//   Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));

// const days1 = calcDaysPassed(
//   new Date(2037, 3, 11),
//   new Date(2037, 10, 19, 10, 8)
// );
// console.log(days1);

/////////////////////////////////////////////////

// const num = 23123535.23;
// const options = {
//   style: "currency", //"percent", //"unit",
//   unit: "celsius", //"mile-per-hour",
//   currency: "EUR",
//   // useGrouping: false,
// };

// console.log("US: ", new Intl.NumberFormat("en-US", options).format(num));
// console.log("Germany:  ", new Intl.NumberFormat("de-DE", options).format(num));
// console.log("Syria:  ", new Intl.NumberFormat("ar-SY", options).format(num));
// console.log("Armenia:  ", new Intl.NumberFormat("hy-AM", options).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language).format(num)
// );

/////////////////////////////////////////////////

// setTimeout
// const ing = ["olives", "spinatch"];

// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza  with ${ing1} and ${ing2}🍕`),
//   3000,
//   ...ing
// );

// console.log("Waiting");

// if (ing.includes("spinatch")) {
//   clearTimeout(pizzaTimer);
// }

// // setInterval

// setInterval(() => {
//   const now = new Date();
//   console.log(now);
// }, 1000);
