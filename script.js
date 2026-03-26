'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movements: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movements - b.movements);

  // console.log(combinedMovsDates);
  // const movementsSort = sort
  //   ? acc.movements.slice().sort((a, b) => a - b)
  //   : acc.movements;
  combinedMovsDates.forEach(function (obj, i) {
    const { movements, movementDate } = obj;
    const type = movements > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(movementDate);


    
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const html = ` 
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${movements}</div>
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
  displayMovements(acc);
  // Display Balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Event Handlers
let currentAccount;

currentAccount = account1;
updateUi(currentAccount);
containerApp.style.opacity = 100;

// day/month/year

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

    // current date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = now.getHours();
    const min = now.getMinutes();

    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

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
  inputTransferAmount.value = inputTransferTo.value = '';
  // console.log(amount, recieverAcc);

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc.username !== currentAccount.username
  ) {
    // console.log('Transfer');
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // Add Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUi(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());

    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});

// FindIndex Method
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username,
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sortedState = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sortedState);
  sortedState = !sortedState;
});

// The New findLast and findLastIndex Methods
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const groupedMovements = Object.groupBy(movements, movement =>
  movement > 0 ? 'deposit' : 'withdrawal',
);
console.log(groupedMovements);

const groupedByActivity = Object.groupBy(accounts, account => {
  const movementsCount = account.movements.length;

  if (movementsCount >= 8) return 'Very Active';
  if (movementsCount >= 4) return ' Active';
  if (movementsCount >= 1) return 'Moderate';
  return 'inactive';
});

console.log(22 === 22.0);
console.log(0.1 + 0.2);

// console.log(groupedByActivity);

/*

Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
*/
/*
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => {
  dog.recFood = Math.floor(dog.weight ** 0.75 * 28);
  console.log(dog);
});

const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
const message =
  dogSarah.weight >= 16 ? 'its eating too much ' : 'Its eating to too less';
console.log(message);

const ownersToMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);

const ownersToLess = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners)
  .flat();
console.log(ownersToMuch);
console.log(ownersToLess);

console.log(`${ownersToMuch.join(' ')}'s dogs are eating too much`);
console.log(`${ownersToLess.join(' ')}'s dogs are eating too less`);

const recommendedDog = dogs.some(dog => dog.curFood === dog.recFood);
console.log(recommendedDog);

const recommendedDog2 = dogs.some(dog => dog.curFood >= dog.recFood);
console.log(recommendedDog2);

const recommendedDog3 = dogs.find(dog => dog.curFood >= dog.recFood);
console.log(recommendedDog3);
// console.log(newDog);

// const [...others] = dogs.filte r(dog => dog.curFood >= 250);

// console.log(a, others);

const friend = [
  { name: 'Rahbar', friends: ['Ali', 'Hassan'] },
  { name: 'Shamsher', friends: ['Waqar', 'Hassan', 'Hussain'] },
];

const aboutFrienda = friend
  .filter(f => f.name.includes('Rahbar'))
  .map(f => f.friends)
  .join(' ');

const aboutFriendb = friend
  .filter(f => f.name.includes('Shamsherc'))
  .map(f => f.friends)
  .join(' ');

const name = friend.map(n => n.name);
const [a, b] = name;
// console.log(`The Friend of ${a} are ${aboutFrienda}`);
// console.log(`The Friend of ${b} are ${aboutFriendb}`);

/*
console.log(movements);
const lastWithdrawal = movements.findLast(mov => mov < 0);
console.log(lastWithdrawal);

('Your lastest large movements was X movements age');

//Sorting Lession 20
const owner = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owner.sort());
console.log(movements.sort());
console.log(movements);
movements.sort((a, b) => {
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
});
console.log(movements);

//Coding Challenge

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:


const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];

const huskyWieght = breeds.find(dog => dog.breed === 'Husky');
console.log(huskyWieght.averageWeight);

const onlyBreedLike = breeds.find(
  breed =>
    breed.activities.includes('running') && breed.activities.includes('fetch'),
).breed;
console.log(onlyBreedLike);

const arrAllActDog = breeds.map(breed => breed.activities).flat();
console.log(arrAllActDog);

const allUniqueDog = new Set(arrAllActDog);
console.log(allUniqueDog);

const [swimming, s, ...others] = allUniqueDog;
console.log(swimming, s, others);
const newArr = [s, swimming, others];
console.log(newArr);
*/

// const onlyBreedLike = breeds.map(map => map.activities);
// const onlyBreedLike = breeds.forEach(function (dogs, i) {});

// console.log(onlyBreedLike);

// const dogLikeArr = breeds.findIndex(dogs => dogs === 'running');
// const allDogArr = breeds.filter(dogs => dogs === 'running');
// console.log(allDogArr);
// console.log(dogLikeArr);

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
