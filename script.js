import words from './words.json' assert { type: 'json' };

// Make imported words object into array
const wordsArray = Object.keys(words);

// Selectors
const Q = document.querySelector('.Q');
const W = document.querySelector('.W');
const E = document.querySelector('.E');
const R = document.querySelector('.R');
const T = document.querySelector('.T');
const Y = document.querySelector('.Y');
const U = document.querySelector('.U');
const I = document.querySelector('.I');
const O = document.querySelector('.O');
const P = document.querySelector('.P');
const A = document.querySelector('.A');
const S = document.querySelector('.S');
const D = document.querySelector('.D');
const F = document.querySelector('.F');
const G = document.querySelector('.G');
const H = document.querySelector('.H');
const J = document.querySelector('.J');
const K = document.querySelector('.K');
const L = document.querySelector('.L');
const Z = document.querySelector('.Z');
const X = document.querySelector('.X');
const C = document.querySelector('.C');
const V = document.querySelector('.V');
const B = document.querySelector('.B');
const N = document.querySelector('.N');
const M = document.querySelector('.M');
const backspace = document.querySelector('.backspace');
const enter = document.querySelector('.enter');
const jumbledSquares = document.querySelectorAll('.jumbled');
const guessLine1 = document.querySelectorAll('.g1');
const guessLine2 = document.querySelectorAll('.g2');
const guessLine3 = document.querySelectorAll('.g3');
const modal = document.querySelector('#my-modal');
const modalBody = document.querySelector('.modal-body');
const googleLink = document.querySelector('.google-link');

let currentLine = guessLine1;

// Number of [index] letter words in array. From 5 to 20 letter words
const wordsQty = [
  0, 0, 0, 0, 7185, 15918, 29874, 41997, 51626, 53403, 45872, 37539, 29125,
  20944, 14148, 8847, 5182, 2968, 1470, 760, 359,
];

let qty = 0;
let gameEnded = false;
const allXLettersArray = [];

// Get all x letter words from json file and put in array
const allXLetterWords = (x) => {
  wordsArray.forEach((word) => {
    if (word.length === x) {
      allXLettersArray.push(word);
      qty = wordsQty[x];
    }
  });
};
allXLetterWords(9);

// Get one x letter word
const randomIndex = Math.floor(Math.random() * qty);
const randomWord = allXLettersArray[randomIndex].toUpperCase();

// Scramble word - Fisher-Yates algorithm
let jumbledWord = randomWord.split('');
let i = jumbledWord.length;
while (--i > 0) {
  let randIndex = Math.floor(Math.random() * (i + 1));
  [jumbledWord[randIndex], jumbledWord[i]] = [
    jumbledWord[i],
    jumbledWord[randIndex],
  ];
}

// console.log(randomWord);
// console.log(jumbledWord);

// Populate scrambled word into top line of board
const populateWord = () => {
  for (let i = 0; i < 9; i++) {
    jumbledSquares[i].innerHTML += jumbledWord[i];
  }
};
populateWord();

// prettier-ignore
const keyboardLetterElements = [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z];

const jumbledArray = Array.from(jumbledSquares);
let available = [...jumbledWord];

// Listen for keyboard press and enter letter in first empty square if letter is in jumbled word - make jumbled letter grey.

const makeGrey = (letter) => {
  jumbledArray
    .find(
      (sq) => sq.innerHTML == letter.innerHTML && !sq.classList.contains('grey')
    )
    .classList.add('grey');
};

keyboardLetterElements.forEach((letter) => {
  if (!gameEnded) {
    letter.addEventListener('click', () => {
      for (let i = 0; i < 9; i++) {
        if (!currentLine[i].innerHTML && available.includes(letter.innerHTML)) {
          currentLine[i].innerHTML += letter.innerHTML;
          let index = available.findIndex((el) => el === letter.innerHTML);
          available.splice(index, 1);
          makeGrey(letter);
          return;
        }
      }
    });
  }
});

// Listen for backspace and delete one and remove grey class from jumbled word
backspace.addEventListener('click', () => {
  if (!gameEnded) {
    for (let i = 8; i >= 0; i--) {
      if (currentLine[i].innerHTML) {
        available.push(currentLine[i].innerHTML);
        jumbledArray
          .find(
            (sq) =>
              sq.innerHTML == currentLine[i].innerHTML &&
              sq.classList.contains('grey')
          )
          .classList.remove('grey');
        currentLine[i].innerHTML = '';
        return;
      }
    }
  }
});

// Sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Listen for enter, if nine letters are present compare guess to word
let guessedWord = '';

enter.addEventListener('click', () => {
  if (!gameEnded) {
    if (
      currentLine[0].innerHTML &&
      currentLine[1].innerHTML &&
      currentLine[2].innerHTML &&
      currentLine[3].innerHTML &&
      currentLine[4].innerHTML &&
      currentLine[5].innerHTML &&
      currentLine[6].innerHTML &&
      currentLine[7].innerHTML &&
      currentLine[8].innerHTML
    ) {
      // Store guessed word in a string
      guessedWord = `${currentLine[0].innerHTML}${currentLine[1].innerHTML}${currentLine[2].innerHTML}${currentLine[3].innerHTML}${currentLine[4].innerHTML}${currentLine[5].innerHTML}${currentLine[6].innerHTML}${currentLine[7].innerHTML}${currentLine[8].innerHTML}`;

      // Animation function to make correct letters have green background and others yellow
      const checkingAnimation = async () => {
        for (let i = 0; i < 9; i++) {
          if (currentLine[i].innerHTML === randomWord[i]) {
            currentLine[i].classList.add('green');
            await sleep(110);
          } else {
            currentLine[i].classList.add('yellow');
            await sleep(110);
          }
        }
        compare();
      };
      checkingAnimation();

      const endGame = async (ms) => {
        gameEnded = true;
        openModal();
        await sleep(ms);
        closeModal();
        googleLink.classList.remove('hide');
        googleLink.href = `https://www.google.com/search?q=${randomWord.toLowerCase()}+meaning`;
        available = [...jumbledWord];
      };

      const clearGrey = () => {
        jumbledSquares.forEach((sq) => {
          sq.classList.remove('grey');
        });
      };

      const compare = async () => {
        // Compare guessed word to random word and display message
        if (guessedWord === randomWord && currentLine == guessLine1) {
          modalBody.innerHTML = 'Excellent! <br> Got it in one!';
          endGame(1500);
          return;
        }
        if (guessedWord === randomWord && currentLine == guessLine2) {
          modalBody.innerHTML = 'Great! <br> Got it in two!';
          endGame(1500);
          return;
        }
        if (guessedWord === randomWord && currentLine == guessLine3) {
          modalBody.innerHTML = 'Nice! <br> You got it!';
          endGame(1500);
          return;
        }
        if (guessedWord !== randomWord && currentLine == guessLine3) {
          modalBody.innerHTML = `Unlucky! <br> It was ${randomWord}`;
          endGame(2000);
          return;
        } else {
          modalBody.innerHTML = 'Try again!';
          openModal();
          await sleep(1000);
          closeModal();
          clearGrey();
          available = [...jumbledWord];
          currentLine == guessLine1
            ? (currentLine = guessLine2)
            : (currentLine = guessLine3);
        }
      };
    }
  }
});

// Open modal
function openModal() {
  modal.style.display = 'block';
}

// Close modal
function closeModal() {
  modal.style.display = 'none';
}
