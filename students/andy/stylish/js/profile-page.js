if (localStorage.getItem('userData') !== `{"prime":"","order":{"list":[]}}` && localStorage.getItem('userData') !== null) {
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

//   createAppendText('item-3x2', 'p', userDataList.userName);
//   createAppendText('item-3x2', 'p', userDataList.userEmail);
//   createAppendImg('item-3x1', userDataList.userPictureUrl);
//createAppendDiv(parentClassName, childElementType, className);


