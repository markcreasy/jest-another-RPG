const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

function Game() {
  this.roundNumber = 0;
  this.isPlayerTurn = false;
  this.enemies = [];
  this.currentEnemy;
  this.player;

  Game.prototype.initializeGame = function() {

    // initialize enemy data
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'axe'));
    this.currentEnemy = this.enemies[0];

    // prompt user for name via inquirer
    inquirer
      .prompt({
        type: 'text',
        name: 'name',
        message: 'What is your name?'
      })
      // destructure name from the prompt object
      .then(({ name }) => {
        this.player = new Player(name);

        this.startNewBattle();
      });
  };

  Game.prototype.startNewBattle = function() {
    if (this.player.agility > this.currentEnemy.agility) {
      this.isPlayerTurn = true;
    } else {
      this.isPlayerTurn = false;
    }

    // Player info
    console.log('Your stats are as follows:');
    console.table(this.player.getStats());

    // enemy info
    console.log(this.currentEnemy.getDescription());

    // start the start the battle
    this.battle();
  };

  Game.prototype.battle = function(){

    if(this.isPlayerTurn){
      // prompt user to choose an action
      inquirer
        .prompt({
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: ['Attack','Use Potion']
        })
        // destructure name from the prompt object
        .then(({ action }) => {
          if (action === 'Use potion') {

            if (!this.player.getInventory()) {
              console.log("You don't have any potions!");
              return;
            }

            inquirer
              .prompt({
                type: 'list',
                message: 'Which potion would you like to use?',
                name: 'action',
                choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
              })
              .then(({ action }) => {
                const potionDetails = action.split(': ');

                this.player.usePotion(potionDetails[0] - 1);
                console.log(`You used a ${potionDetails[1]} potion.`);
              });

          } else {

            const damage = this.player.getAttackValue();
            this.currentEnemy.reduceHealth(damage);

            console.log(`You attacked the ${this.currentEnemy.name}`);
            console.log(this.currentEnemy.getHealth());

          }
        });
    }else{
      const damage = this.currentEnemy.getAttackValue();
      this.player.reduceHealth(damage);

      console.log(`You were attacked by the ${this.currentEnemy.name}`);
      console.log(this.player.getHealth());
    }

  }
}

module.exports = Game;
