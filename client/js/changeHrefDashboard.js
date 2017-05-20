function changeHref() {
  var previewButton = document.querySelector('#previewButton');
  var href = '/user/report/' + months.value + '/' + years.value + '?customer=' + customer.value;

  var youtubeViews = document.querySelector('#youtube-views');
  var analyticsViews = document.querySelector('#analytics-views');
  var analyticsUniqueViews = document.querySelector('#analytics-unique-views');
  var analyticsAverageTime = document.querySelector('#analytics-average-time');
  var analyticsAverageVisitedPerPages = document.querySelector('#analytics-average-visited-per-pages');

  if (youtube.checked)
      href += '&youtube=active';
  if (youtubeViews.checked)
      href += '&youtubeViews=active';
  if (analytics.checked)
      href += '&analytics=active';
  if (analyticsViews.checked)
      href += '&analyticsViews=active';
  if (analyticsUniqueViews.checked)
      href += '&analyticsUniqueViews=active';
  if (analyticsAverageTime.checked)
      href += '&analyticsAverageTime=active';
  if (analyticsAverageVisitedPerPages.checked)
      href += '&analyticsAverageVisitedPerPages=active';

  previewButton.href = href;
}
