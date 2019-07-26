
const hostName = "api.appworks-school.tw";
const ApiVersion = "1.0";
const productListURL = `https://${hostName}/api/${ApiVersion}/products`;
const bulletURL = `https://${hostName}/api/${ApiVersion}/marketing/campaigns`;
const productDetailURL = `https://${hostName}/api/${ApiVersion}/products/details?id=`;
const sentBuyDetailURL = `https://${hostName}/api/${ApiVersion}/order/checkout`;
let pageIndicator = "all";
let extPageURL = "";
let pageNumberNow = 0;

// product page parameter
let pageNow = 0;
let colorNow = 0;
let sizeNow = 0;
let remainStocks = -10;
let remainStocksMinusCart = -10;
let userAmount = 0;


// cart page parameter
let shippingFee = 40;

// orderList Object
let orderJSON = { "prime": "", "order": {"list": [] } };
class orderList {
  constructor(id, name, price, colorCode, colorName, size, quantity, imgSrc, stock) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.color = {
      "code": colorCode,
      "name": colorName
    };
    this.size = size;
    this.qty = quantity;
    this.imgSrc = imgSrc;
    this.stock = stock;
  }
};
class shippingInfo {
  constructor(shipping, payment, subtotal, freight, total, name, phone, email, address, time) {
    this.shipping = shipping;
    this.payment = payment;
    this.subtotal = subtotal;
    this.freight = freight;
    this.total = total;
    this.recipient = {
      "name": name,
      "phone": phone,
      "email": email,
      "address": address,
      "time": time,
    };
  }
};

let userOrder = new orderList("", "", 0, "", "", "", 0);

//let userInfo = new shippingInfo("delivery", "credit_card", 1234, 60, 1300, "Luke", "0987654321", "email@email", "市政府站", "morning");
//let userOrder = new orderList("201807202157", "活力花紋長筒牛仔褲", 1299, "DDF0FF", "淺藍", "M", 1);

//----HTML文字設定---

const navBarWords = ['女裝', '男裝', '配件'];

for (let i = 0; i < navBarWords.length; i++) {
  document.getElementsByClassName(`barItem-${i + 1}`)[0].textContent = navBarWords[i];
  document.getElementsByClassName(`barItem-${i + 1}`)[1].textContent = navBarWords[i];
}


//當localStorage有資料陣列，先讀取，並顯示在購物車圓點
if (localStorage.getItem('orderJSONinLocal') !== `{"prime":"","order":{"list":[]}}` && localStorage.getItem('orderJSONinLocal') !== null) {
  orderJSON = JSON.parse(localStorage.getItem('orderJSONinLocal'));
  createCartNumIcon('cart', 'cart-num', orderJSON.order.list.length);
}

//----與連線遠端，取得JSON相關----

function ajax(src, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == 200) {
      //如果JSON可讀值，但是回收的JSON錯誤，加入判斷式
      if (JSON.parse(xhr.responseText) == "Wrong Request") {
        //console.log('something wrong in ajax function response');
        //console.log(xhr.responseText);
      } else {
        callback(JSON.parse(xhr.responseText));
      }
    }
  };
  xhr.open('GET', src);
  xhr.send();
}

function postAjax(src, sentObj, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", src, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.onload = function () {
    var parsedData = JSON.parse(xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == "200") {
      callback(parsedData);
    } else {
      console.error(parsedData);
    }
  }
  var sentJSON = JSON.stringify(sentObj);
  xhr.send(sentJSON);
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
  const parent = document.querySelector(`.${parentClassName}`);
  const childP = document.createElement(childElementType);
  childP.innerHTML = text;
  parent.appendChild(childP);
}

function removeAppendText(parentClassName, childElementType) {
  const parent = document.querySelector(`.${parentClassName}`);
  const childP = document.querySelector(`.${parentClassName} ${childElementType}`);
  parent.removeChild(childP);
}

function createAppendImg(parentClassName, src) {
  const parent = document.querySelector(`.${parentClassName}`);
  const childImg = document.createElement('img');
  childImg.src = src;
  parent.appendChild(childImg);
}

function createAppendDiv(parentClassName, childElementType, className) {
  const parent = document.querySelector(`.${parentClassName}`);
  const childP = document.createElement(childElementType);
  childP.setAttribute('class', className);
  parent.appendChild(childP);
}

function createAppendOption(parentClassName, maxNumber, selectedNumber) {
  const parent = document.querySelector(`.${parentClassName}`);
  for (i = 0; i < maxNumber; i++) {
    const childP = document.createElement('option');
    childP.setAttribute('value', i + 1);
    childP.innerText = i + 1;
    parent.appendChild(childP);
    if (i + 1 == selectedNumber) { childP.setAttribute('selected', 'selected'); }
  }
}

function addNewClassName(parentClassName, newName) {
  const parent = document.getElementsByClassName(parentClassName)[0];
  parent.setAttribute('class', newName);
}

// 創建購物車圓點數量

function createCartNumIcon(parentClassName, iconClassName, initialNum) {
  for (let i = 0; i < document.getElementsByClassName(parentClassName).length; i++) {
    const parent = document.getElementsByClassName(parentClassName)[i];
    const newIconDiv = document.createElement('div');
    newIconDiv.className = iconClassName;
    parent.appendChild(newIconDiv);

    const newIconP = document.createElement('p');
    newIconP.className = 'addCursor';
    newIconP.innerText = initialNum;
    newIconDiv.appendChild(newIconP);
  }
}

// 掃描local storage JSON，若圓點被創出，則重設購物車圓點數量

function setCartNum(cartClassName, dataArray) {
  let num = 0;
  if (dataArray.length !== undefined) {
    num = dataArray.length;
    if (document.querySelector(`.${cartClassName} p`) !== null) {
      for (let i = 0; i < document.querySelectorAll(`.${cartClassName} p`).length; i++) {
        const pChild = document.querySelectorAll(`.${cartClassName} p`)[i];
        pChild.innerText = num;
      }
    } else {
      //console.log("no cart number icon, so don't need to set cart number");
    }
  }
}

function removeCartIcon(cartClassName) {
  for (let i = 0; i < document.querySelectorAll(`.${cartClassName}`).length; i++) {
    const pChild = document.querySelectorAll(`.${cartClassName}`)[i];
    pChild.parentNode.removeChild(pChild);
  }
}


// Nav Bar 相關

// 點選產品後，跳轉到首頁，並附帶 query string，在首頁取得產品資料，並顯示

function getWomenProduct() {
  location.href = 'index.html?section=women';
}
function getMenProduct() {
  location.href = 'index.html?section=men';
}
function getAccProduct() {
  location.href = 'index.html?section=accessories';
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


// ---- 加入搜尋字串監聽函數 -----


// 打搜尋字串，再滑鼠點選放大鏡後，跳轉到首頁並附帶 query string
// 在首頁使用AJAX撈資料並顯示。因為頁面跳轉，不需清除input text

const searchBarForm = document.getElementsByClassName('item-1x4')[0];

searchBarForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let userInput = document.getElementsByClassName('search-bar')[0];
  let userValue = userInput.value;
  if (userValue !== "") {
    location.href = `index.html?section=search&keyword=${userValue}`;
  } else {
    hideSearchBar();
  }
});

// ---- 加入點擊購物車監聽函數，點擊後跳轉到購物車頁面 -----

const cartIcon1 = document.getElementsByClassName('cart')[0];
const cartIcon2 = document.getElementsByClassName('cart')[1].parentNode;

cartIcon1.addEventListener('click', (e) => {
  location.href = 'cart.html';
});

cartIcon2.addEventListener('click', (e) => {
  location.href = 'cart.html';
});