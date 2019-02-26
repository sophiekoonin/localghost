document.addEventListener('DOMContentLoaded', function() {
  if (
    document.cookie.split(';').filter(function(item) {
      return item.trim().indexOf('cookies_accepted=true') == 0;
    }).length
  ) {
    // cookies are A-OK! init the scripts
    $.getScript('https://platform.twitter.com/widgets.js');
  } else if (
    document.cookie.split(';').filter(function(item) {
      return item.trim().indexOf('cookies_accepted=') == 0;
    }).length
  ) {
    // show the banner
    document.getElementById('cookie-banner').classList.add('visible');
  }
});

function acceptCookies() {
  document.cookie = 'cookies_accepted=true';
}

function declineCookies() {
  document.cookie = 'cookies_accepted=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}
