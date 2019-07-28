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
        //statusChangeCallback(response);
    });
}

function checkLoginStatePromise() {
    return new Promise(function (resolve, reject) {
        FB.getLoginStatus(function (response) {
            resolve(response.status);
        });
    });
}

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);

    if (response.status === 'connected') {
        getFbInfoAPI();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        alert('可以給我名字、信箱、跟本人帥照/美照嗎？ 拜託拜託');
        //document.getElementById('status').innerHTML = 'Please log ' +
        //    'into this app.';
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        alert('要先登入臉書，才能使用本站會員功能喔');
        //document.getElementById('status').innerHTML = 'Please log ' +
        //    'into Facebook.';
    }
}

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function getFbInfoAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', 'GET', { "fields": "id,name,picture,email" }, function (response) {  //可逗號加入 user_birthday 從 fb server 得到個人資料
        console.log(response);
        console.log('Successful login for: ' + response.name);
        //document.getElementById('status').innerHTML =
        //    'Thanks for logging in, ' + response.name + '!';
    });
}

function getFbInfoAPIPromise() {
    return new Promise(function (resolve, reject) {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', 'GET', { "fields": "id,name,picture,email" }, function (response) {  //可逗號加入 user_birthday 從 fb server 得到個人資料
        console.log(response);
        console.log('Successful login for: ' + response.name);
        resolve(response);
        //document.getElementById('status').innerHTML =
        //    'Thanks for logging in, ' + response.name + '!';
    });
    });
}


function memberLogin() {
    FB.login(function (response) {
        statusChangeCallback(response);
    }, {
            scope: 'public_profile,email' //可email後，逗號加入 user_birthday 要求用戶提供
        });

}
function memberLogout() {

    FB.api('/me/permissions', 'delete', function (res) {
        console.log(res);
        if (res && !res.error) {
            if (res) {
                alert('Permission revoked.');
            }
            else {
                alert('Permissions delete error.');
            }
        }
        else {
            alert('Try again later.');
        }
    });
    // FB.logout(function (response) {
    //     statusChangeCallback(response);
    // });
}
