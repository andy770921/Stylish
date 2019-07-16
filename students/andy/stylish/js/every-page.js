
const navBarWords = ['女裝','男裝','配件'];

for (let i = 0; i < navBarWords.length; i++) {
    document.getElementsByClassName(`barItem-${i+1}`)[0].textContent = navBarWords[i];
    document.getElementsByClassName(`barItem-${i+1}`)[1].textContent = navBarWords[i];
}

// ---- Hover換圖網址函數 -----

function hover(element, url) {
    element.setAttribute('src', url);
  }
  
  function unhover(element, url) {
    element.setAttribute('src', url);
  }

// 點選放大鏡後，顯示搜尋Bar，按header外其他位置，隱藏搜尋Bar


function showSearchBar() {
  const searchBarDiv = document.getElementsByClassName('item-1x4')[0];
  searchBarDiv.style.display = 'flex';
}

function hideSearchBar() {
  const searchBarDiv = document.getElementsByClassName('item-1x4')[0];
  searchBarDiv.style.display = 'none';
}

const magnifier = document.getElementsByClassName('item-1x2')[0];

magnifier.addEventListener('click', () => {
  showSearchBar();
  document.getElementsByTagName('main')[0].addEventListener('click', () => {
    hideSearchBar();
  });
});

// 改變視窗大小時，搜尋Bar會因相對應大小，正確顯示or消失
function mq() {
  var query = Modernizr.mq('(max-width: 1149px)');
  if (query) {
    hideSearchBar();
  } else {
    showSearchBar();
  }
};
window.onresize = function () {
  mq();
};
