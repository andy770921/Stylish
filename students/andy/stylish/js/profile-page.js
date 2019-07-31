
function showMember() {
    if (localStorage.getItem('userData') !== '{}' && localStorage.getItem('userData') !== null) {
        userDataList = JSON.parse(localStorage.getItem('userData'));
        // 加入產品圖片
        const img = document.getElementsByClassName("img-3x1")[0];
        img.src = userDataList.userPictureUrl;

        // 加入文字
        const text1 = document.getElementsByClassName('input-user-name')[0]
        text1.innerHTML = userDataList.userName;
        const text2 = document.getElementsByClassName('input-user-email')[0]
        text2.innerHTML = userDataList.userEmail;
    }
}

showMember();

const loginIcon = document.getElementById('FB_login');
loginIcon.addEventListener('click', () => {
    handleMemberClick();
});

const logoutIcon = document.getElementById('FB_logout');
logoutIcon.addEventListener('click', () => {
    document.getElementById('loading').classList.remove("display-none");
    memberLogout();
});


