function saveSummary() {
  var summary = document.querySelector('#summary');
  var summaryTextarea = document.querySelector('#summaryTextarea');
  var summaryText = summaryTextarea.value;
  var summaryButton = document.querySelector('#summaryButton');

  summaryButton.classList.add('hidden');

  var text = document.createTextNode(summaryText);
  var pElement = document.createElement('p');
  pElement.appendChild(text);

  summary.appendChild(pElement);

  summaryTextarea.parentNode.removeChild(summaryTextarea);
}

function saveRecommendation() {
  var recommendation = document.querySelector('#recommendation');
  var recommendationTextarea = document.querySelector('#recommendationTextarea');
  var recommendationText = recommendationTextarea.value;
  var recommendationButton = document.querySelector('#recommendationButton');

  recommendationButton.classList.add('hidden');

  var text = document.createTextNode(recommendationText);
  var pElement = document.createElement('p');
  pElement.appendChild(text);

  recommendation.appendChild(pElement);

  recommendationTextarea.parentNode.removeChild(recommendationTextarea);
}
