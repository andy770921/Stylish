window.fbAsyncInit = function () {
    FB.init({
        appId: '862956427419338',
        cookie: true,
        xfbml: true,
        version: 'v3.3'
    });

    FB.AppEvents.logPageView();

};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState() {
    FB.getLoginStatus(function (response) {
        console.log(response);
        statusChangeCallback(response);
    });
}

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into Facebook.';
    }
}

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', 'GET', { "fields": "id,name,picture,email" }, function (response) {  //可逗號加入 user_birthday 從 fb server 得到個人資料
        console.log(response);
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';
    });
    FB.api(
        '/oauth/access_token',
        'GET',
        {"grant_type":"fb_exchange_token",
         "client_id":"{your-app-id}",
         "client_secret":"{your-app-secret}",
         "fb_exchange_token":"{your-short-lived-access-token}"},
        function(response) {
            console.log(response);// Insert your code here
        }
      );

}

function memberLogin() {
    FB.login(function (response) {
        statusChangeCallback(response);
    }, {
            scope: 'public_profile,email' //可email後，逗號加入 user_birthday 要求用戶提供
        });

}
function memberLogout() {
    FB.logout(function (response) {
        statusChangeCallback(response);
    });
}
