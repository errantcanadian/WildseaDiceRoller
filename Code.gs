// Copyright 2024, Trystan Goetze 
// A dice roller extension for Google Sheets, which reports results according to the rules of _The Wildsea_, by Felix Isaacs
// Intended for use with the Wildsea Virtual Play Surface https://docs.google.com/spreadsheets/d/1LmRh8cXnqyB7vVjNx4U6LgOlbrxmdbZ7ykqIhFw9Tus/edit?gid=1272508559#gid=1272508559
// Licence: MIT https://opensource.org/license/MIT
// Repository: https://github.com/errantcanadian/WildseaDiceRoller/

function onOpen() {
  SpreadsheetApp.getUi()
  .createMenu('Action Roll')
    .addItem('1d6', 'Roll1D6')
    .addItem('2d6', 'Roll2D6')
    .addItem('3d6', 'Roll3D6')
    .addItem('4d6', 'Roll4D6')
    .addItem('5d6', 'Roll5D6')
    .addItem('6d6', 'Roll6D6')
    .addToUi();
}

function getRndInt(min,max){
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function RollD6(numDice) {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Get username for output
  // Pulls the currently active sheet name and records it as the roller - ensure you have the character's sheet selected
  // Comment out this section if you want to prompt for roller names each time instead
  var rollerIn = ss.getActiveSheet();
  var roller = rollerIn.getSheetName();
  // Uncomment the below if you want to prompt for roller names each time
  // var rollerIn = ui.prompt('Who\'s rolling?', ui.ButtonSet.OK);
  // var roller = String();
  // if (rollerIn.getResponseText() == ''){
  //   roller = 'NoName';
  //   Logger.log('User did not enter a name');
  // }
  // else {
  //   roller = String(rollerIn.getResponseText());
  //   Logger.log(`User is ${roller}`);
  // }
  // Check for cuts
  var cutsIn = ui.prompt('How many dice to cut?', ui.ButtonSet.OK);
  var cuts = Number();
  if (cutsIn.getResponseText() == ''){
    cuts = 0;
  }
  else {
    try{
      cuts = Number(cutsIn.getResponseText());
    } catch (error) {
      ui.alert('When entering cuts, please input a number or leave blank.');
      Logger.log('Error: user did not enter number or empty string');
    }
  }
  Logger.log(`Roll is cut by ${cuts} dice`);
  // Roll the dice
  let RollResult = new Array();
    for (d=1; d<numDice+1; d++){
      var roll = getRndInt(1,6);
      Logger.log('User rolled a '+roll);
      RollResult.push(roll);
    }
    Logger.log('Roll result is '+RollResult);
    RollResult.sort();
    Logger.log('Sorted result is '+RollResult);
  // Apply cuts
  for (i=0; i<cuts; i++){
    RollResult.pop();
  }
  Logger.log('With cuts, result is '+RollResult);
  // Build result report
  var message = `You rolled ${numDice}d6 with ${cuts} cuts: ${RollResult}`;
  // Interpret result
  var highest = Math.max(...RollResult);
  var outcome = 0; // 0 = Disaster, 1 = Conflict, 2 = Triumph
  var twist = false; // false = no twist, true = yes twist
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
  WriteResult(roller, RollResult, outcome, twist)
  ui.alert(message);
}

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

function WriteResult(u, r, o, t){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Rolls') == null){
    ss.insertSheet('Rolls');
    let NewRollSheet = ss.getSheetByName('Rolls');
    NewRollSheet.appendRow(['Roller', 'Roll', 'Result']);
  }
  var rollSheet = ss.getSheetByName('Rolls');
  var outcome = String();
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
  rollSheet.appendRow([u, String(r), outcome]);
}

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
