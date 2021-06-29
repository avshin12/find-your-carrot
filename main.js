const prompt = require('prompt-sync')({sigint: true});

const carrot = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field;
    this.row = 0;
    this.column = 0;
    // Set the "home" position before the game starts
    this.field[0][0] = pathCharacter;
  }

  playGame() {
    let playing = true;
    while (playing) {
      this.print();
      this.askQuestion();
      if (!this.isInBounds()) {
        console.log('You fell out of bounds, game over!');
        playing = false;
        break;
      } else if (this.isHole()) {
        console.log('You fell in a hole! Better luck next time!');
        playing = false;
        break;
      } else if (this.isCarrot()) {
        console.log('You found your carrot! What do you think about that?');
        playing = false;
        break;
      }
      // Update the current location on the map
      this.field[this.column][this.row] = pathCharacter;
    }
  }

  askQuestion() {
    const answer = prompt('Which way? U, D, L, or R?').toUpperCase();
    switch (answer) {
      case 'U':
        this.column -= 1;
        break;
      case 'D':
        this.column += 1;
        break;
      case 'L':
        this.row -= 1;
        break;
      case 'R':
        this.row += 1;
        break;
      default:
        console.log('Enter U, D, L or R.');
        this.askQuestion();
        break;
    }
  }

  isInBounds() {
    return (
      this.column >= 0 &&
      this.row >= 0 &&
      this.column < this.field.length &&
      this.row < this.field[0].length
    );
  }

  isCarrot() {
    return this.field[this.column][this.row] === carrot;
  }

  isHole() {
    return this.field[this.column][this.row] === hole;
  }

  print() {
    const displayString = this.field.map(row => {
        return row.join('');
      }).join('\n');
    console.log(displayString);
  }

  static generateField(height, width, percentage = 0.1) {
    const field = new Array(height).fill(0).map(el => new Array(width));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const prob = Math.random();
        field[y][x] = prob > percentage ? fieldCharacter : hole;
      }
    }
    // Set the "carrot" location
    const carrotLocation = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };
    // Make sure the "carrot" is not at the starting point
    while (carrotLocation.x === 0 && carrotLocation.y === 0) {
      carrotLocation.x = Math.floor(Math.random() * width);
      carrotLocation.y = Math.floor(Math.random() * height);
    }
    field[carrotLocation.y][carrotLocation.x] = carrot;
    return field;
  }
}

const myfield = new Field(Field.generateField(20, 20, 0.1));
myfield.playGame();
