
function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
// deleteCookie("fblo_" + fbAppId); // fblo_yourFBAppId. example: fblo_444499089231295

//--- 以下為 FB SDK

const fbAppId = '862956427419338';

window.fbAsyncInit = function () {
    FB.init({
        appId: 'fbAppId',
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
    }, true);
}



function checkLoginStatePromise() {

    return new Promise(function (resolve, reject) {
        FB.getLoginStatus(function (response) {
            resolve(response);
        }, true);
    });
}

// 此為 FB.getLoginStatus() 呼叫後執行的程式碼，alert 訊息會在 fb 跳出登入畫面，關閉 fb 畫面之後顯示
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);

    if (response.status === 'connected') {
        getFbInfoAPI();
    } else if (response.status === 'not_authorized') {
        // alert('可以給我名字、信箱、跟本人帥照/美照嗎？ 拜託拜託');
    } else {
        alert('要先登入並同意基本資料許可，才能使用本站會員功能喔');
        //重新整理網頁，重整後會在 login in 時刪除 cookie 避免判斷 "not_authorized" 成 "unknown" 錯誤
        deleteCookie(`fblo_${fbAppId}`);
        window.location.reload();
    }
}

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function getFbInfoAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', 'GET', { "fields": "id,name,picture.width(500),email" }, function (response) {  //可逗號加入 user_birthday 從 fb server 得到個人資料
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


// 此為判斷 fb 登入狀態的程式碼，alert 訊息會在 fb 跳出登入畫面前顯示
function memberLogin() {
    // 刪除若上次取消登入，自動產生的 cookie ，避免判斷 "not_authorized" 成 "unknown" 錯誤
    deleteCookie(`fblo_${fbAppId}`);

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
                alert('您已經成功登出會員');
                //再重新整理網頁，才不會 status 判斷成 "connected" 導致拿資料錯誤
                window.location.reload();
            }
            else {
                alert('很像有點問題，無法登出');
            }
        }
        else {
            alert('您已經登出了喔');
        }
    });
    // FB.logout(function (response) {
    //     statusChangeCallback(response);
    // });
}


// ---- 加入點擊會員圖示監聽函數，點擊後跳轉到會員頁面 -----

// async function getFbLoginFeedback() {
//   let feedbackWords = await checkLoginStatePromise();
//   console.log(feedbackWords);
//   return feedbackWords;
// }

const memberIcon1 = document.getElementsByClassName('member')[0];
const memberIcon2 = document.getElementsByClassName('member')[1].parentNode;

memberIcon1.addEventListener('click', () => {
    //刪除 cookie 避免判斷"not_authorized"錯誤
    deleteCookie(`fblo_${fbAppId}`);

    let promise = checkLoginStatePromise();
    promise.then(function (fbResponse) {
        console.log(fbResponse);
        if (fbResponse.status === "connected") {
            alert('已登入會員');
            let promise2 = getFbInfoAPIPromise();
            promise2.then(function (fbReturnObj) { console.log(fbReturnObj); });

            //location.href = 'profile.html';

        } else if (fbResponse.status === "not_authorized") {
            alert('需要取得您的名字、信箱、跟本人帥照/美照，才能登入會員喔');
            //再點一次    
            //FB.getLoginStatus(function (response) { console.log(response); });
            console.log('A');
            memberLogin();

        } else if (fbResponse.status === "unknown") {
            alert('這個應該是，不授權後要進來的。可能是登入取消、或是授權取消');
            //memberLogin();
        }
    });
});

memberIcon2.addEventListener('click', () => {
    let promise = checkLoginStatePromise();
    promise.then(function (fbStatus) {
        console.log(fbStatus);
        if (fbStatus === "connected") {
            const fbReturnObj = getFbInfoAPI();
            console.log(fbReturnObj);
            //location.href = 'profile.html';
        } else {
            memberLogin();
        }
    });
});


// log out 後要重新載入網頁，否則 status: "connected" 會判斷錯