// Copyright 2024, Trystan Goetze 
// A dice roller extension for Google Sheets, which reports results according to the rules of _The Wildsea_, by Felix Isaacs
// Intended for use with the Wildsea Virtual Play Surface https://docs.google.com/spreadsheets/d/1LmRh8cXnqyB7vVjNx4U6LgOlbrxmdbZ7ykqIhFw9Tus/edit?gid=1272508559#gid=1272508559
// Licence: MIT https://opensource.org/license/MIT
// Repository: https://github.com/errantcanadian/WildseaDiceRoller/

// Build Action Roll menu
function onOpen() {
  SpreadsheetApp.getUi()
  .createMenu('Action Roll')
    .addItem('Zero Dice', 'Roll0D6')
    .addItem('1d6', 'Roll1D6')
    .addItem('2d6', 'Roll2D6')
    .addItem('3d6', 'Roll3D6')
    .addItem('4d6', 'Roll4D6')
    .addItem('5d6', 'Roll5D6')
    .addItem('6d6', 'Roll6D6')
    .addToUi();
}

// Dice Roller
function getRndInt(min,max){
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// Workhorse function
function RollD6(numDice) {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Get username for output
  // Pulls the currently active sheet name and records it as the roller - ensure you have the character's sheet selected
  let rollerIn = ss.getActiveSheet();
  let roller = rollerIn.getSheetName();
  // Check for cuts
  let cutsIn = ui.prompt('How many dice to cut?', ui.ButtonSet.OK);
  let cuts = Number();
  let CutsSet = [];
  if (cutsIn.getResponseText() == ''){
    cuts = 0;
  }
  else {
    if (isNaN(Number(cutsIn.getResponseText()))) {
      ui.alert('When entering cuts, please input a number or leave blank.');
      Logger.log('Error: user did not enter number or empty string');
      return;
    }
    else {
      cuts = Number(cutsIn.getResponseText());
    }
  }
  Logger.log(`Roll is cut by ${cuts} dice`);
  // Check if number of dice is Zero after cuts - If yes, go to RollZeroDice()
  if ((numDice - cuts) < 1){
    for (i = 0; i < cuts; i++) {
      CutsSet.push(i);
    }
    RollZeroDice(roller,numDice,CutsSet);
    Logger.log('Cuts reduced number of dice to zero or fewer');
    return;
  }
  // Roll the dice if more than zero
  let RollResult = new Array();
    for (d=1; d<numDice+1; d++){
      let roll = getRndInt(1,6);
      Logger.log('User rolled a '+roll);
      RollResult.push(roll);
    }
    Logger.log('Roll result is '+RollResult);
    RollResult.sort();
    Logger.log('Sorted result is '+RollResult);
  // Roll cuts
  for (i=0; i<cuts; i++){
    CutsSet.push(RollResult.pop());
  }
  Logger.log('Dice cut:'+CutsSet);
  Logger.log('With cuts, result is '+RollResult);
  // Build result report
  let message = `You rolled ${numDice}d6 with ${cuts} cuts: `;
  if (cuts == 0) {
    message = message.concat(`${RollResult}`);
  }
  else {
    message = message.concat(`${RollResult} // ${CutsSet}`)
  }
  // Interpret result
  let highest = Math.max(...RollResult);
  let outcome = Number(); // 0 = Disaster, 1 = Conflict, 2 = Triumph
  let twist = false; // false = no twist, true = yes twist
  if (highest == 6){
    message = message.concat('\nTriumph!');
    outcome = 2;
    Logger.log('Rolled a 6: Triumph');
  }
  else if (highest == 5 || highest == 4){
    message = message.concat('\nConflict!');
    outcome = 1;
    Logger.log('Rolled a 4/5: Conflict');
  }
  else {
    message = message.concat('\nDisaster!');
    outcome = 0;
    Logger.log('Rolled a 1-3: Disaster');
  }
  // Check for doubles
  if (Doubles(RollResult)){
    message = message.concat('\n...with a Twist!');
    twist = true;
    Logger.log('Doubles: a twist occurs');
  }
  else{
    twist = false;
    Logger.log('No doubles, no twist');
  }
  WriteResult(roller, RollResult, outcome, twist, CutsSet)
  ui.alert(message);
}

// Checks if there is a twist
function Doubles(a){
  for (i=0; i<a.length; i++){
    for (j=0; j<a.length; j++){
      if (i != j){
        if (a[i] == a[j]){
          Logger.log('Found doubles');
          return true;
        }
      }
    }
  }
  Logger.log('Found no doubles');
  return false;
}

// Writes the result to the sheet
function WriteResult(u, r, o, t, c){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Rolls') == null){
    ss.insertSheet('Rolls');
    let NewRollSheet = ss.getSheetByName('Rolls');
    NewRollSheet.appendRow(['Roller', 'Roll', 'Result']);
  }
  let rollSheet = ss.getSheetByName('Rolls');
  let outcome = String();
  if (o == 2){
    outcome = 'Triumph!';
  }
  else if (o == 1){
    outcome = 'Conflict!';
  }
  else {
    outcome = 'Disaster!';
  }
  if (t){
    outcome = outcome.concat(' ...with a Twist!');
  }
  let rollEntry = String(r);
  if (c.length > 0) {
    rollEntry = rollEntry.concat(' // '+c)
  }
  rollSheet.appendRow([u, rollEntry, outcome]);
}

// Rolls zero dice
function RollZeroDice(u, d, c){
  const ui = SpreadsheetApp.getUi();
  Logger.log('User is rolling zero dice');
  let roll = getRndInt(1,6); // main roll
  Logger.log(`User rolled a ${roll}`);
  let message = `You rolled ${d} dice with ${c.length} cuts: ${roll}`; // start building message
  let outcome = Number();
  if (roll > 3){
    message = message.concat('\nConflict!');
    outcome = 1;
    Logger.log('User got a Conflict');
  }
  else {
    message = message.concat('\nDisaster!');
    outcome = 0;
    Logger.log('User got a Disaster');
  }
  WriteResult(u, roll, outcome, false, []);
  ui.alert(message);
}

// The following six functions are necessary because for some reason Google Apps Scripts don't allow ui menu items to call functions with arguments
function Roll1D6() {
  RollD6(1);
}

function Roll2D6() {
  RollD6(2);
}

function Roll3D6() {
  RollD6(3);
}

function Roll4D6() {
  RollD6(4);
}

function Roll5D6() {
  RollD6(5);
}

function Roll6D6() {
  RollD6(6);
}

// Handles a straight zero dice roll, rather than a roll where all dice are cut
function Roll0D6() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Get username for output
  // Pulls the currently active sheet name and records it as the roller - ensure you have the character's sheet selected
  // Comment out this section if you want to prompt for roller names each time instead
  let rollerIn = ss.getActiveSheet();
  let roller = rollerIn.getSheetName();
  RollZeroDice(roller,'zero', []);
}
