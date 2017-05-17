/**
 * Sparar ApiAccess-objekt i array som returneras
 * @param docs
 * @returns {Array}
 */
function convertToAPIArray(docs) {
  var accessObjects = [];
  docs.forEach(function (doc) {
    accessObjects.push(doc._doc);
  });

  return accessObjects;
}

module.exports = convertToAPIArray;
