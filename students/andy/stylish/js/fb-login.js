
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
        const tokenFromFbResponse = fbResponse.authResponse.accessToken;
        let accessToken = new Object();
        accessToken.fbAccessToken = tokenFromFbResponse;

        // 用 fb access Token 換 server access Token
        getAjaxLoginToken(getServerTokenURL, tokenFromFbResponse, (parsedData) => {
            // 用 fb access Token 換 server access Token，再存入 local storage
            accessToken.serverAccessToken = parsedData.data.access_token;
            localStorage.setItem('accessTokenJSON', JSON.stringify(accessToken));
        });

        getFbInfoAPI();
    } else if (response.status === 'not_authorized') {
        // alert('可以給我名字、信箱、跟本人帥照/美照嗎？ 拜託拜託');
    } else {
        alert('要先登入並同意基本資料許可，才能使用本站會員功能喔');
        //重新整理網頁，重整後會在 login in 時刪除 cookie 避免判斷 "not_authorized" 成 "unknown" 錯誤
        window.location.reload();
    }
}


function handleFbResponse(response) {
    console.log(response);
    console.log('Successful login for: ' + response.name);
    const userDataObj = {
        userName: response.name,
        userEmail: response.email,
        userPictureUrl: response.picture.data.url
    };
    console.log(userDataObj);
    //取得使用者資料後，存入 localStorage
    localStorage.setItem('userData', JSON.stringify(userDataObj));
    location.href = 'profile.html';
}


function getFbInfoAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', 'GET', { "fields": "id,name,picture.width(500),email" }, function (response) {  //可逗號加入 user_birthday 從 fb server 得到個人資料
        handleFbResponse(response);
    });
}

function getFbInfoAPIPromise() {
    return new Promise(function (resolve, reject) {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', 'GET', { "fields": "id,name,picture.width(500),email" }, function (response) {  //可逗號加入 user_birthday 從 fb server 得到個人資料
            handleFbResponse(response);
            resolve(response);
        });
    });
}



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
                alert('您已經成功登出');
                localStorage.removeItem('userData');
                localStorage.removeItem('accessTokenJSON');
                //再重新整理網頁，才不會 status 判斷成 "connected" 導致拿資料錯誤
                window.location.reload();
            }
            else {
                alert('很像有點問題，無法登出');
            }
        }
        else {
            //alert('您已經登出了喔');
            //這個很像有點奇怪
            console.log("已經登出，或 fb 登入");
            FB.getLoginStatus(function (response) {
                console.log(response);
                if (response.status === 'connected') {
                    console.log("重按檢查狀態一次");
                    memberLogout();
                }
            }, true);
        }
    });
}


// ---- 加入點擊會員圖示監聽函數，點擊後跳轉到會員頁面 -----

// async function getFbLoginFeedback() {
//   let feedbackWords = await checkLoginStatePromise();
//   console.log(feedbackWords);
//   return feedbackWords;
// }

const memberIcon1 = document.getElementsByClassName('member')[0];
const memberIcon2 = document.getElementsByClassName('member')[1].parentNode;

// 此為判斷 fb 登入狀態的程式碼，alert 訊息會在 fb 跳出登入畫面前顯示

function handleMemberClick() {
    //在檢查狀態前 ( 以及login in 前 ) 刪除 cookie 避免判斷 "not_authorized" 成 "unknown" 錯誤
    deleteCookie(`fblo_${fbAppId}`);

    let promise = checkLoginStatePromise();
    promise.then(function (fbResponse) {
        console.log(fbResponse);
        if (fbResponse.status === "connected") {
            alert ('已登入會員');
            // alert ('已登入會員，或是剛剛移除權限但保持登入');
            let promise2 = getFbInfoAPIPromise();
            promise2.then(function (fbReturnObj) { console.log(fbReturnObj); });

            // location.href = 'profile.html';

        } else if (fbResponse.status === "not_authorized") {
            alert('需要取得您的名字、信箱、跟本人帥照/美照，才能登入會員喔');
            memberLogin();
        } else if (fbResponse.status === "unknown") {
            alert('需要先登入臉書才能使用會員功能喔。');
            memberLogin();
        }
    });
}

memberIcon1.addEventListener('click', () => {
    handleMemberClick();
});

memberIcon2.addEventListener('click', () => {
    handleMemberClick();
});



// log out ( 取消權限 ) 後要重新載入網頁，否則 status: "connected" 會判斷錯
