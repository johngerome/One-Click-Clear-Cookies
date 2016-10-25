function GetDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf('://') > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}


function ReloadPage() {
    chrome.tabs.getSelected(null, function(tab) {
      var code = 'window.location.reload();';
      chrome.tabs.executeScript(tab.id, {code: code});
    });
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('One Click Clear Cookies loaded!');

    var tabUrl = '';
    // var siteName = document.getElementById('site_name');
    var btnClear = document.getElementById('btn_clear');

    //
    btnClear.addEventListener('click', function(e) {
        chrome.cookies.getAll({ 'domain': tabUrl }, function(cookies) {
            for( var i in cookies ) {
                chrome.cookies.remove({ 'url': "http" + (cookies[i].secure ? "s" : "") + "://" + cookies[i].domain + cookies[i].path, 'name': cookies[i].name });
            }
        });

        // Show Message for 5 sec.
        document.getElementById('alert_message').style.display = 'block';

        setTimeout(function() {
            document.getElementById('alert_message').style.display = 'none';
        }, 2000);

        // Reload tab
        ReloadPage();

        e.preventDefault();
    }, false);

    chrome.tabs.getSelected(null,function(tab) {
        tabUrl = GetDomain(tab.url);
        console.log('tabs' + tabUrl);
        document.getElementById('site_name').innerHTML = tabUrl;
    });

}, false);
