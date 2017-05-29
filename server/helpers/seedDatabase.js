'use strict';
var fs = require('fs');

/**
 * Används som helper för att samla historisk data när en användare lägger till en ny access.
 */

// inehåller en array med timestamps från 1 Januari 2016, därefter varje månad till Maj 2017
var timeStamps = JSON.parse(fs.readFileSync(__dirname + '/timestamps.json', 'utf8'));
var cronJob = require('../cronJob');

/**
 *
 * @param unixTimeStamp att lägga till
 * lägger till ett datum. Används av schemaläggaren för att lägga till framtida daturm så att databasen
 * alltid byggs med alla hela månander.
 */

function addDate(date) {
  timeStamps.dates.push(date);
  var json = JSON.stringify(timeStamps);
  fs.writeFileSync(__dirname + '/timestamps.json', json);
}

/**
 *
 * @param access ett access Objekt från databasen.
 * Går igenom alla datum i arrayen och anropar APIerna
 * Anropar samma funktion som när
 */

function seedDatabase(access) {
  timeStamps.dates.forEach(function (timestamp) {
    cronJob.updateEach(access, timestamp)
  })
}

exports.seed = seedDatabase;
exports.addDate = addDate;