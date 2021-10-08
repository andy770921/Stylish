// --- step1: 引入相關程式碼，套件及初始變數 -----
TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox');
var fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '4242 4242 4242 4242'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: '01 / 23'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: '123'
    }
}
TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'black'
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
            'letter-spacing': '0.4px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
            'letter-spacing': '0.4px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
            'letter-spacing': '0.4px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'black'
            }
        }
    }
});

// --- step2: 在打信用卡資訊時，時刻監控信用卡資訊有沒正確，正確會出現"A"， .canGetPrime 值為 true ，不正確會出現"B" -----

// TPDirect.card.onUpdate(function (update) {
//     const submitButton = document.querySelector('.add-3x2');
//     if (update.canGetPrime) {
//         // Enable submit Button to get prime.
//         //submitButton.removeAttribute('disabled');
//         console.log("A");
//     } else {
//         // Disable submit Button to get prime.
//         //submitButton.setAttribute('disabled', true);
//         console.log("B");
//     }
// });


// --- step3:  若 .canGetPrime 值為 true ，觸發此函數時，會得到一串 Prime (result.card.prime)  -----

function sendOrder() {
    //event.preventDefault();

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();


    // ----  先加入其他表單欄位資訊的判斷式，檢查表格是否空白，若過程中有問題，會回傳 false。 -----
    // ----  不為空白則回傳 userInfoObj 物件 -----
    let userInfoObj = {};
    if (checkUserInfoAndReturn("payment-method", "receiver-name", "phone", "email", "address", "receiving-time", orderJSON) === false) {
        return;
    } else {
        userInfoObj = checkUserInfoAndReturn("payment-method", "receiver-name", "phone", "email", "address", "receiving-time", orderJSON);
    }

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('信用卡資訊有誤喔');
        return;
    }

    // 最後確認送出訂單
    let r = confirm("您確定要送出訂單嗎");
    if (r === true) {
        //加入 loading 畫面效果
        document.getElementById('loading').classList.remove("display-none");

        // Get prime ， 以及送出訂單
        TPDirect.card.getPrime((result) => {
            if (result.status !== 0) {
                alert('get prime error ' + result.msg);

                //移除 loading 畫面效果
                document.getElementById('loading').classList.add("display-none");
                return;
            }
            //alert('get prime 成功，prime: ' + result.card.prime);


            // -----  sendFinalOrder 函數說明: 若資料輸入函數後，會回傳移除圖片連結及庫存之後的物件。-----
            const finalJsonObj = sendFinalOrder(userInfoObj, result.card.prime, orderJSON);

            function jumpToThanksWithOrderNum(parsedData) {
                window.location.href = `thankyou.html?orderNumber=${parsedData.data.number}`;
            }

            if (finalJsonObj) {
                //alert('收件人資料及信用卡資料正確，已送出訂單' + JSON.stringify(finalJsonObj));

                //清除 local storage;
                localStorage.removeItem('orderJSONinLocal');

                if (localStorage.getItem('accessTokenJSON') !== {} && localStorage.getItem('accessTokenJSON') !== null) {
                    //有會員的狀態
                    alert('收件人、信用卡、會員資料皆正確，已送出訂單');
                    const accessToken = JSON.parse(localStorage.getItem('accessTokenJSON'));
                    const serverToken = accessToken.serverAccessToken;
                    postAjaxWithToken(sentBuyDetailURL, finalJsonObj, serverToken, jumpToThanksWithOrderNum);

                } else {
                    //無會員的狀態
                    alert('收件人資料及信用卡資料正確，但是需要先登入才能購買喔');
                    // postAjax(sentBuyDetailURL, finalJsonObj, jumpToThanksWithOrderNum);
                    
                    //移除 loading 畫面效果
                    document.getElementById('loading').classList.add("display-none");  
                }
            }

            return;
            // send prime to your server, to pay with Pay by Prime API .
            // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api 

        })
    } else {
        //移除 loading 畫面效果
        document.getElementById('loading').classList.add("display-none");      
        return;
    }
}
