function changeHref() {
  var previewButton = document.querySelector('#previewButton');
  var href = '/user/report/' + months.value + '/' + years.value + '?customer=' + customer.value;

  //Koppla till alla feature-checkboxar från dashboarden:

  var adwordsClick = document.querySelector('#adwords-click');
  var adwordsCpc = document.querySelector('#adwords-cpc');
  var adwordsViews = document.querySelector('#adwords-views');

  var facebookLikes = document.querySelector('#facebook-likes');

  var youtubeViews = document.querySelector('#youtube-views');

  var tyntCopied = document.querySelector('#tynt-copied');

  var addthisClick = document.querySelector('#addthis-click');

  var twitterViews = document.querySelector('#twitter-views');

  var analyticsViews = document.querySelector('#analytics-views');
  var analyticsUniqueViews = document.querySelector('#analytics-unique-views');
  var analyticsStrongestRedirects = document.querySelector('#analytics-4-strongest-redirects');
  var analyticsMostVisitedPages = document.querySelector('#analytics-4-most-visited-pages');
  var analyticsAverageTime = document.querySelector('#analytics-average-time');
  var analyticsAverageVisitedPerPages = document.querySelector('#analytics-average-visited-per-pages');

  var linkedinFollowers = document.querySelector('#linkedin-followers');
  var linkedinInteractions = document.querySelector('#linkedin-interactions');

  var mozKeywords = document.querySelector('#moz-keywords');

  // Vilka medier och features som blivit iklickade på dashboard-sidan:

  if (adwords.checked)
      href += '&adwords=active';
  if (adwordsClick.checked)
      href += '&adwordsClick=active';
  if (adwordsCpc.checked)
      href += '&adwordsCpc=active';
  if (adwordsViews.checked)
      href += '&adwordsViews=active';

  if (facebook.checked)
      href += '&facebook=active';
  if (facebookLikes.checked)
      href += '&facebookLikes=active';

  if (youtube.checked)
    href += '&youtube=active';
  if (youtubeViews.checked)
      href += '&youtubeViews=active';

  if (tynt.checked)
      href += '&tynt=active';
  if (tyntCopied.checked)
      href += '&tyntCopied=active';

  if (addthis.checked)
      href += '&addthis=active';
  if (addthisClick.checked)
      href += '&addthisClick=active';

  if (twitter.checked)
      href += '&twitter=active';
  if (twitterViews.checked)
      href += '&twitterViews=active';

  if (analytics.checked)
      href += '&analytics=active';
  if (analyticsViews.checked)
      href += '&analyticsViews=active';
  if (analyticsUniqueViews.checked)
      href += '&analyticsUniqueViews=active';
  if (analyticsStrongestRedirects.checked)
      href += '&analyticsStrongestRedirects=active';
  if (analyticsMostVisitedPages.checked)
      href += '&analyticsMostVisitedPages=active';
  if (analyticsAverageTime.checked)
      href += '&analyticsAverageTime=active';
  if (analyticsAverageVisitedPerPages.checked)
      href += '&analyticsAverageVisitedPerPages=active';

  if (linkedin.checked)
      href += '&linkedin=active';
  if (linkedinFollowers.checked)
      href += '&linkedinFollowers=active';
  if (linkedinInteractions.checked)
      href += '&linkedinInteractions=active';

  if (moz.checked)
      href += '&moz=active';
  if (mozKeywords.checked)
      href += '&mozKeywords=active';

  // Lägger till datan som ska skickas med på preview-knappen på dashboarden:
  previewButton.href = href;
}
