
const hostName = "api.appworks-school.tw";
const ApiVersion = "1.0";
const productListURL = `https://${hostName}/api/${ApiVersion}/products`;
const bulletURL = `https://${hostName}/api/${ApiVersion}/marketing/campaigns`;
const productDetailURL = `https://${hostName}/api/${ApiVersion}/products/details?id=`;
let pageIndicator = "all";
let extPageURL = "";
let pageNumberNow = 0;

let orderJSON = {"prime": "", "order": {}, "list": []};
class orderList {
  constructor(id, name, price, colorCode, colorName, size, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.color = {
      "code": colorCode,
      "name": colorName
    };
    this.size = size;
    this.qty = quantity;
  }
};
  //let userOrder = new orderList("201807202157", "活力花紋長筒牛仔褲", 1299, "DDF0FF", "淺藍", "M", 1);

  
//----HTML文字設定---

const navBarWords = ['女裝','男裝','配件'];

for (let i = 0; i < navBarWords.length; i++) {
    document.getElementsByClassName(`barItem-${i+1}`)[0].textContent = navBarWords[i];
    document.getElementsByClassName(`barItem-${i+1}`)[1].textContent = navBarWords[i];
}

//----與連線遠端，取得JSON相關----

function ajax(src, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == 200) {
      //如果JSON可讀值，但是回收的JSON錯誤，加入判斷式
      if (JSON.parse(xhr.responseText) == "Wrong Request") {
        console.log('something wrong in ajax function response');
        console.log(xhr.responseText);
      } else {
        callback(JSON.parse(xhr.responseText));
      }
    }
  };
  xhr.open('GET', src);
  xhr.send();
}

//----取得網址後問號的Query字串相關----

function getQueryValueByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// query string: ?foo=lorem&bar=&baz
//var foo = getQueryValueByName('foo'); // "lorem"
//var bar = getQueryValueByName('bar'); // "" (present with empty value)
//var baz = getQueryValueByName('baz'); // "" (present with no value)
//var qux = getQueryValueByName('qux'); // null (absent)

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

//----創建元素相關----

function createColor(colorClassName, colorNumber) {
  const ul = document.getElementsByClassName(`${colorClassName}`)[0];
  const li = document.createElement('li');
  li.style.backgroundColor = `#${colorNumber}`;
  ul.appendChild(li);
}

function createAppendText(parentClassName, childElementType, text) {
  const parent = document.getElementsByClassName(parentClassName)[0];
  const childP = document.createElement(childElementType);
  childP.innerHTML = text;
  parent.appendChild(childP);
}

function removeAppendText(parentClassName, childElementType) {
  const parent = document.getElementsByClassName(parentClassName)[0];
  const childP = document.querySelector(`.${parentClassName} ${childElementType}`);
  parent.removeChild(childP);
}

function createAppendImg(parentClassName, src) {
  const parent = document.getElementsByClassName(parentClassName)[0];
  const childImg = document.createElement('img');
  childImg.src = src;
  parent.appendChild(childImg);
}

function addNewClassName(parentClassName, newName) {
  const parent = document.getElementsByClassName(parentClassName)[0];
  parent.setAttribute('class', newName);
}

// Nav Bar 相關

// 點選產品後，跳轉到首頁，並附帶 query string，在首頁取得產品資料，並顯示

function getWomenProduct() {
  location.href='index.html?section=women';
}
function getMenProduct() {
  location.href='index.html?section=men';
}
function getAccProduct() {
  location.href='index.html?section=accessories';
}


const womenNavBar = document.getElementsByClassName('item-2x1')[0];
const womenNavBar2 = document.getElementsByClassName('item-2x1')[1];

womenNavBar.addEventListener('click', () => {
  getWomenProduct();
});

womenNavBar2.addEventListener('click', () => {
  getWomenProduct();
});

const menNavBar = document.getElementsByClassName('item-2x2')[0];
const menNavBar2 = document.getElementsByClassName('item-2x2')[1];

menNavBar.addEventListener('click', () => {
  getMenProduct();
});

menNavBar2.addEventListener('click', () => {
  getMenProduct();
});

const accNavBar = document.getElementsByClassName('item-2x3')[0];
const accNavBar2 = document.getElementsByClassName('item-2x3')[1];

accNavBar.addEventListener('click', () => {
  getAccProduct();
});

accNavBar2.addEventListener('click', () => {
  getAccProduct();
});

// 打搜尋字串，再滑鼠點選放大鏡後，跳轉到首頁並附帶 query string
// 在首頁使用AJAX撈資料並顯示。因為頁面跳轉，不需清除input text

const searchBarForm = document.getElementsByClassName('item-1x4')[0];

searchBarForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let userInput = document.getElementsByClassName('search-bar')[0];
  userValue = userInput.value;
  location.href=`index.html?section=search&keyword=${userValue}`
});