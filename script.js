'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// // const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(function (mov) {
//   return mov < 0;
// });

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   // console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// // console.log(balance);

// console.log(deposits);

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` 
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // console.log(acc.balance);
  labelBalance.textContent = acc.balance;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = incomes;
  const expence = acc.movements
    .filter(mov => mov <= 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(expence)}`;
  const interestRate = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = interestRate;
};

createUsernames(accounts);
// console.log(accounts);

const updateUi = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  // Display Balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Event Handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value,
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUi(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value,
  );
  console.log(amount, recieverAcc);

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc.username !== currentAccount.username
  ) {
    // console.log('Transfer');
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUi(currentAccount);
  }
});

// LECTURES

////////BELOW ARE THE CODING CHALLENGES/////////
/////////////////////////////////////////////////

/*
const calAverageHumanAgeArrow = dogs =>
  dogs
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

console.log(calAverageHumanAgeArrow([2, 5, 1, 6, 7, 15, 7]));

const calcAverageHumanAge = function (dogsJulia) {
  const humanAge = dogsJulia.map(function (age) {
    if (age <= 2) {
      return (age = 2 * age);
    } else {
      return (age = 16 + age * 4);
    }
  });
  // console.log(humanAge);
  const excludedAge = humanAge.filter(function (m, i) {
    return m >= 18;
  }, 0);
  // console.log(excludedAge);

  const averageAge = excludedAge.reduce(function (acc, cur, i, arr) {
    return acc + cur / arr.length;
  }, 0);
  // console.log(averageAge);
};
calcAverageHumanAge([2, 5, 1, 6, 7, 15, 7]);

/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

const movementsUsd = movements.map(function (mov) {
return mov * eurToUsd;
});

const movementsArrow = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementsUsd);
console.log(movementsArrow);

const movementsDisc = movements.map(
  (mov, i) =>
    `Movement ${i + 1} You ${mov > 0 ? 'Deposited' : 'Withdrew '} ${Math.abs(mov)}`,
);

console.log(movementsDisc);

const juliaDog = [3, 5, 2, 12, 7];
const kateDog = [4, 1, 15, 8, 3];

const checkDog = function (dogsJulia, dogsKate) {
  const newDog = [...dogsJulia.splice(1, 2)];
  const newArrDogs = [...newDog, ...dogsKate];
  console.log(newArrDogs);
  newArrDogs.forEach(function (mov, index) {
    const type = mov < 5 ? 'Puppy' : 'Adult';
    console.log(`Dog Number ${index + 1} is ${type} and its ${mov} years old`);
  });
};

checkDog(juliaDog, kateDog);

const calcAverageHumanAge = function (dogsJulia) {
  const humanAge = dogsJulia.map(function (age) {
    if (age <= 2) {
      return (age = 2 * age);
    } else {
      return (age = 16 + age * 4);
    }
  });
  console.log(humanAge);
  const excludedAge = humanAge.filter(function (m, i) {
    return m >= 18;
  }, 0);
  console.log(excludedAge);

  const averageAge = excludedAge.reduce(function (acc, cur, i, arr) {
    return acc + cur / arr.length;
  }, 0);
  console.log(averageAge);
};
calcAverageHumanAge([2, 5, 1, 6, 7, 15, 7]);

const movement = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsdS = 1.1;

// PIPELINE
const newMov = movement
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsdS)
  .reduce((acc, cur) => acc + cur, 0);

console.log(newMov);


currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

currenciesUnique.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];



for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1} You have deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1} You have withdrew ${Math.abs(movement)}`);
  }
}

movements.forEach(function (movement, index, array) {
  if (movement > 0) {
    console.log(`Movement ${index + 1} You have deposited ${movement}`);
  } else {
    console.log(
      `Movement ${index + 1} You have withdrew ${Math.abs(movement)}`,
    );
  }
});

let arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr.slice(2));
console.log(arr.slice(2, 4));
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

const letters = arr.concat(arr2);
console.log(letters);

console.log(letters.join(' - '));

const arr3 = [23, 11, 63];
console.log(arr3.at(0));
*/

/*
///////// MY SELF EXPLAIN/////////////////////
const myAccount1 = {
  name: 'Rahbar Ali Haider',
  job: 'Instructor',
};

const myAccount2 = {
  name: 'Shamsher Ali Haider',
  job: 'Instructor',
};

const myAccount3 = {
  name: 'Waqar Ali Gadehi',
  job: 'Instructor',
};

const myAccount4 = {
  name: 'Qasim Memon',
  job: 'Instructor',
};

const myAccounts = [myAccount1, myAccount2, myAccount3, myAccount4];

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.name
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(myAccounts);
console.log(myAccounts);
*/
