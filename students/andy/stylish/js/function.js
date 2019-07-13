
const hostName = "api.appworks-school.tw";
const ApiVersion = "1.0";
const productListURL = `https://${hostName}/api/${ApiVersion}/products`;
const bulletURL = `https://${hostName}/api/${ApiVersion}/marketing/campaigns`;

//加入新產品Icon
createNewIcon();

//與連線遠端，取得JSON相關

function ajax(src, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.open('GET', src);
  xhr.send();
}

ajax(`${productListURL}/all`, setProduct);
ajax(`${bulletURL}`, setBulletImg);

function getWomenProduct() {
  ajax(`${productListURL}/women`, setProduct);
}
function getMenProduct() {
  ajax(`${productListURL}/men`, setProduct);
}
function getAccProduct() {
  ajax(`${productListURL}/accessories`, setProduct);
}


function setProduct(parsedData) {
  //console.log(parsedData);
  //console.log(parsedData.data[0].colors[0].code);
  for (let i = 0; i < parsedData.data.length; i++) {
    // 加入產品圖片
    const img = document.getElementsByClassName(`img-4x${i + 1}`)[0];
    img.src = parsedData.data[i].main_image;

    // 加入產品顏色，兩步驟 1.先移除所有產品顏色 2.再新增顏色
    // 1. 先移除所有產品顏色
    const colorClassName = `color-4x${i + 1}`;
    const noColorUl = document.getElementsByClassName(colorClassName)[0];
    const li = document.querySelectorAll(`.${colorClassName} li`);
    li.forEach((element) => { noColorUl.removeChild(element); });

    // 2.再新增所有產品顏色
    for (let j = 0; j < parsedData.data[i].colors.length; j++) {
      const colorCode = parsedData.data[i].colors[j].code;
      createColor(colorClassName, colorCode);
    }

    // 加入產品文字及價錢
    const text = document.getElementsByClassName(`text-4x${i + 1}`)[0]
    text.innerHTML = `${parsedData.data[i].title}`;
    text.appendChild(document.createElement("br"));
    text.innerHTML += `TWD. ${parsedData.data[i].price}`;
  }

  // 當產品數量小於6，清除圖片、顏色、文字

  const numOfItem = 6;
  if (parsedData.data.length < numOfItem) {
    for (let i = 0; i < numOfItem - parsedData.data.length; i++) {
      // 移除多餘產品圖片
      const noImg = document.getElementsByClassName(`img-4x${parsedData.data.length + i + 1}`)[0];
      noImg.src = "";
      // 移除多餘產品顏色
      const noColorUl = document.getElementsByClassName(`color-4x${parsedData.data.length + i + 1}`)[0];
      const li = document.querySelectorAll(`.color-4x${parsedData.data.length + i + 1} li`);
      li.forEach((element) => { noColorUl.removeChild(element); });
      // 移除多餘產品文字及價錢
      const text = document.getElementsByClassName(`text-4x${parsedData.data.length + i + 1}`)[0]
      text.innerHTML = "";
    }
  }

  // 當產品數量等於0(無任何顏色框框): 顯示字"未搜尋到關鍵字"，及移除產品圖示。大於0，移除字
  let totalLi = 0;
  for (var i = 0; i < document.querySelectorAll(`.color-product`).length; i++) {
    totalLi += document.querySelectorAll(`.color-4x${i + 1} li`).length;
  }
  //console.log(totalLi);

  if (totalLi == 0 && document.querySelectorAll('.container-4 span').length == 0) {
    createText('未搜尋到關鍵字');
    removeAllNewIcon();
  }
  else if (totalLi > 0 || document.querySelectorAll('.container-4 span').length > 0) {
    removeAllSpanText();
  }
}

function setBulletImg(parsedData) {
  for (let i = 0; i < parsedData.data.length; i++) {
    // 加入發燒產品圖片
    const bulletImg = document.getElementsByClassName('container-3')[0];
    bulletImg.style.backgroundImage = `url("https://${hostName}${parsedData.data[i].picture}")`;
  }
}





/*  實驗之函數
//ajax("https://api.appworks-school.tw/api/1.0/marketing/hots", setJSONObject);

function setJSONObject(parsedData) {
  //console.log(parsedData.data[0].products[0].images[0]);
  //a = parsedData.data[0].products[0].images[1];
  //createImg(a);
  console.log(parsedData);
  console.log(parsedData.data[0].products[0].main_image);
  //設定主頁宣傳圖
  document.getElementsByClassName('container-3')[0].style.backgroundImage = `url(${parsedData.data[0].products[0].main_image})`;
  //設定產品圖
  //document.getElementsByClassName('img-4x2')[0].src = parsedData.data[0].products[0].images[1];
  //設定產品顏色
  //createColor(`#${parsedData.data[0].products[0].colors[0].code}`);
  //設定產品名稱與價錢
  document.getElementsByClassName('text-product')[0].innerHTML = `${parsedData.data[0].products[0].title}`;
  document.getElementsByClassName('text-product')[0].appendChild(document.createElement("br"));
  document.getElementsByClassName('text-product')[0].innerHTML += `TWD.${parsedData.data[0].products[0].price}`;

  document.getElementsByClassName('text-product')[1].innerHTML = `${parsedData.data[0].products[0].title}`;
  document.getElementsByClassName('text-product')[1].appendChild(document.createElement("br"));
  document.getElementsByClassName('text-product')[1].innerHTML += `TWD.${parsedData.data[0].products[0].price}`;

  document.getElementsByClassName('text-product')[2].innerHTML = `${parsedData.data[0].products[0].title}`;
  document.getElementsByClassName('text-product')[2].appendChild(document.createElement("br"));
  document.getElementsByClassName('text-product')[2].innerHTML += `TWD.${parsedData.data[0].products[0].price}`;

  document.getElementsByClassName('text-product')[3].innerHTML = `${parsedData.data[0].products[0].title}`;
  document.getElementsByClassName('text-product')[3].appendChild(document.createElement("br"));
  document.getElementsByClassName('text-product')[3].innerHTML += `TWD.${parsedData.data[0].products[0].price}`;

  document.getElementsByClassName('text-product')[4].innerHTML = `${parsedData.data[0].products[0].title}`;
  document.getElementsByClassName('text-product')[4].appendChild(document.createElement("br"));
  document.getElementsByClassName('text-product')[4].innerHTML += `TWD.${parsedData.data[0].products[0].price}`;

  document.getElementsByClassName('text-product')[5].innerHTML = `${parsedData.data[0].products[0].title}`;
  document.getElementsByClassName('text-product')[5].appendChild(document.createElement("br"));
  document.getElementsByClassName('text-product')[5].innerHTML += `TWD.${parsedData.data[0].products[0].price}`;

}

function createImg(url) {
  const body = document.getElementsByTagName('body')[0];
  const img = document.createElement('img');
  img.src = url;
  body.appendChild(img);
}

const resetCursor = (event) => {
  event.target.style.cursor = "default";
};

*/

function createColor(colorClassName, colorNumber) {
  const ul = document.getElementsByClassName(`${colorClassName}`)[0];
  const li = document.createElement('li');
  li.style.backgroundColor = `#${colorNumber}`;
  ul.appendChild(li);
}

function createNewIcon() {
  const newProduct = document.getElementsByClassName('item-4x2')[0];
  const newIconDiv = document.createElement('div');
  newIconDiv.className = 'new-icon';
  newProduct.appendChild(newIconDiv);
  const newIconP = document.createElement('p');
  newIconP.className = 'new-icon-text';
  newIconP.innerText = '新品';
  newIconDiv.appendChild(newIconP);
  newProduct.appendChild(newIconDiv);
}

function removeAllNewIcon() {
  const newIcon = document.querySelectorAll('.new-icon');
  newIcon.forEach((element) => { element.parentNode.removeChild(element); });
}

function createText(text) {
  const parent = document.getElementsByClassName('container-4')[0];
  const childText = document.createElement('span');
  childText.innerText = text;
  parent.appendChild(childText);
}

function removeAllSpanText() {
  const parent = document.getElementsByClassName('container-4')[0];
  const childText = document.querySelectorAll('.container-4 span');
  childText.forEach((element) => { parent.removeChild(element); });
}

// ---- 加入事件監聽函數 -----

// 點選產品後，取得產品資料，並顯示

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

// 打搜尋字串，再滑鼠點選放大鏡後，使用AJAX撈資料並顯示

const searchBarBtn = document.getElementsByClassName('img-1x4')[0];

searchBarBtn.addEventListener('click', () => {
  userValue = document.getElementsByClassName('search-bar')[0].value;
  console.log('userValue Updated');
  console.log(userValue);
  ajax(`${productListURL}/search?keyword=${userValue}`, setProduct);

});

// 滑動到底時，使用AJAX再撈資料，顯示多撈到的產品

function doSomething() {
  let windowHeight = window.innerHeight;
  let footerRemains = document.getElementsByClassName('container-5')[0].getBoundingClientRect().top;
  if (footerRemains - windowHeight  < 0 ) {
    console.log('hi');
  }
}

let ticking = false;
window.addEventListener('scroll', function(e) {
  if (!ticking) {
    window.requestAnimationFrame(function() {
      doSomething();
      ticking = false;
    });
  }
  ticking = true;
});