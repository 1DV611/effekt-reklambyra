function convertToAPIArray(docs) {
  var accessObjects = [];
  docs.forEach(function (doc) {
    accessObjects.push(doc._doc);
  });

  return accessObjects;
}

module.exports = convertToAPIArray;
