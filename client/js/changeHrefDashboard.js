function changeHref() {
  var previewButton = document.querySelector('#previewButton');
  var href = '/user/report/' + months.value + '/' + years.value + '?customer=' + customer.value;

  //Koppla till alla feature-checkboxar från dashboarden:

  var adwords = document.querySelector('#adwords');
  var adwordsClick = document.querySelector('#adwords-click');
  var adwordsCpc = document.querySelector('#adwords-cpc');
  var adwordsViews = document.querySelector('#adwords-views');

  var facebook = document.querySelector('#facebook');
  var facebookLikes = document.querySelector('#facebook-likes');

  var youtube = document.querySelector('#youtube');
  var youtubeViews = document.querySelector('#youtube-views');

  var tynt = document.querySelector('#tynt');
  var tyntCopied = document.querySelector('#tynt-copied');

  var addthis = document.querySelector('#addthis');
  var addthisClick = document.querySelector('#addthis-click');

  var twitter = document.querySelector('#twitter');
  var twitterViews = document.querySelector('#twitter-views');

  var analytics = document.querySelector('#analytics');
  var analyticsViews = document.querySelector('#analytics-views');
  var analyticsUniqueViews = document.querySelector('#analytics-unique-views');
  var analyticsStrongestRedirects = document.querySelector('#analytics-4-strongest-redirects');
  var analyticsMostVisitedPages = document.querySelector('#analytics-4-most-visited-pages');
  var analyticsAverageTime = document.querySelector('#analytics-average-time');
  var analyticsAverageVisitedPerPages = document.querySelector('#analytics-average-visited-per-pages');

  var linkedin = document.querySelector('#linkedin');
  var linkedinFollowers = document.querySelector('#linkedin-followers');
  var linkedinInteractions = document.querySelector('#linkedin-interactions');

  var moz = document.querySelector('#moz');
  var mozKeywords = document.querySelector('#moz-keywords');

  // Vilka medier och features som blivit iklickade på dashboard-sidan:

  /* Läggs till när det finns stöd för datan:
 if (adwords) {
   if (adwords.checked)
       href += '&adwords=active';
   if (adwordsClick.checked)
       href += '&adwordsClick=active';
   if (adwordsCpc.checked)
       href += '&adwordsCpc=active';
   if (adwordsViews.checked)
       href += '&adwordsViews=active';
 }

 if (facebook) {
   if (facebook.checked)
       href += '&facebook=active';
   if (facebookLikes.checked)
       href += '&facebookLikes=active';
 }
 */

  if (youtube) {
    if (youtube.checked)
        href += '&youtube=active';
    if (youtubeViews.checked)
        href += '&youtubeViews=active';
  }

  /* Läggs till när det finns stöd för datan:
  if (tynt) {
    if (tynt.checked)
        href += '&tynt=active';
    if (tyntCopied.checked)
        href += '&tyntCopied=active';
  }

  if (addthis) {
    if (addthis.checked)
        href += '&addthis=active';
    if (addthisClick.checked)
        href += '&addthisClick=active';
  }

  if (twitter) {
    if (twitter.checked)
        href += '&twitter=active';
    if (twitterViews.checked)
        href += '&twitterViews=active';
  }

  */

  if (analytics) {
    if (analytics.checked)
        href += '&analytics=active';
    if (analyticsViews.checked)
        href += '&analyticsViews=active';
    if (analyticsUniqueViews.checked)
        href += '&analyticsUniqueViews=active';
    /* Läggs till när det finns stöd för datan:
    if (analyticsStrongestRedirects.checked)
        href += '&analyticsStrongestRedirects=active';
    if (analyticsMostVisitedPages.checked)
        href += '&analyticsMostVisitedPages=active';
    */
    if (analyticsAverageTime.checked)
        href += '&analyticsAverageTime=active';
    if (analyticsAverageVisitedPerPages.checked)
        href += '&analyticsAverageVisitedPerPages=active';
  }

  /* Läggs till när det finns stöd för datan:
  if (linkedin) {
    if (linkedin.checked)
        href += '&linkedin=active';
    if (linkedinFollowers.checked)
        href += '&linkedinFollowers=active';
    if (linkedinInteractions.checked)
        href += '&linkedinInteractions=active';
  }

  if (moz) {
    href += '&moz=active';
    if (mozKeywords.checked)
        href += '&mozKeywords=active';
  }

  */

  // Lägger till datan som ska skickas med på preview-knappen på dashboarden:
  previewButton.href = href;
}
