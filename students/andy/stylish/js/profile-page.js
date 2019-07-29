if (localStorage.getItem('userData') !== `{"prime":"","order":{"list":[]}}` && localStorage.getItem('userData') !== null) {
    userDataList = JSON.parse(localStorage.getItem('userData'));
  }

  createAppendText('item-3x2', 'p', userDataList.userName);
  createAppendText('item-3x2', 'p', userDataList.userEmail);
  createAppendImg('item-3x1', userDataList.userPictureUrl);
 //createAppendDiv(parentClassName, childElementType, className);