
const hostName = "api.appworks-school.tw";
const ApiVersion = "1.0";
const productListURL = `https://${hostName}/api/${ApiVersion}/products`;
const bulletURL = `https://${hostName}/api/${ApiVersion}/marketing/campaigns`;
let pageIndicator = "all";
let extPageURL = "";
let pageNumberNow = "0";

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
ajax(`${bulletURL}`, setBullet);

function getWomenProduct() {
  ajax(`${productListURL}/women`, setProduct);
  pageIndicator = "women";
}
function getMenProduct() {
  ajax(`${productListURL}/men`, setProduct);
  pageIndicator = "men";
}
function getAccProduct() {
  ajax(`${productListURL}/accessories`, setProduct);
  pageIndicator = "accessories";
}


function setProduct(parsedData) {
  //console.log(parsedData);
  //console.log(parsedData.data[0].colors[0].code);
  pageNumberNow = 0;
  if (parsedData.data) {
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
    // 清除第7個以上，展開的產品
    const presentItem = document.querySelectorAll('.item-product');
    if (presentItem.length > numOfItem) {
      for (let i = numOfItem; i < presentItem.length; i++) {
        // 移除產品Div
        document.querySelector('.container-4').removeChild(presentItem[i]);
      }
    }
  }
  // 當產品數量等於0(無任何顏色框框): 顯示字"未搜尋到關鍵字"，及移除產品圖示。大於0，移除字
  let totalLi = 0;
  for (var i = 0; i < document.querySelectorAll(`.color-product`).length; i++) {
    totalLi += document.querySelectorAll(`.color-4x${i + 1} li`).length;
  }
  //console.log(totalLi);

  if (totalLi == 0) {
    createText('未搜尋到關鍵字');
    removeAllNewIcon();
  }
  else if (totalLi > 0) {
    removeAllSpanText();
  }
  // 加入監聽瀏覽器卷軸
  window.addEventListener('scroll', handleScroll);

  // 加入瀏覽器卷軸滑動到底時，要引入下頁的URL，並加入已被移除的卷軸監聽。若無下頁，則設定URL為空，並移除卷軸監聽
  if (parsedData.paging !== undefined) {
    extPageURL = `${productListURL}/${pageIndicator}?paging=${parsedData.paging}`;
    window.addEventListener('scroll', handleScroll);
  } else {
    extPageURL = '';
    window.removeEventListener('scroll', handleScroll);
  }

}


function setBullet(parsedData) {
  for (let i = 0; i < parsedData.data.length; i++) {
    // 加入發燒產品圖片
    const bulletA = document.querySelectorAll('.item-3x3 a')[i];
    const bulletTextDiv = document.querySelectorAll('.item-3x1 div')[i];

    // 設定發燒產品id，給相應超連結a的href，及文字
    bulletA.href = `#product?id=${parsedData.data[i].product_id}`;
    bulletTextDiv.setAttribute('onclick', `window.location='#product?id=${parsedData.data[i].product_id}'`);

    // 加入發燒產品圖片
    bulletA.querySelector('div').style.backgroundImage = `url("https://${hostName}${parsedData.data[i].picture}")`;

    // 加入發燒產品文字
    const imgContentArray = parsedData.data[i].story.split("\r\n");

    createPoet(imgContentArray, bulletTextDiv);
  }
}

function createPoet(imgTextArray, HTMLelement) {
  for (let i = 0; i < imgTextArray.length; i++) {
    if (i < imgTextArray.length - 1) {
      let p = HTMLelement.querySelector('.imgWords-1');
      p.innerHTML += `${imgTextArray[i]}`;
      p.appendChild(document.createElement("br"));
    } else {
      let pp = HTMLelement.querySelector('.imgWords-2');
      pp.appendChild(document.createElement("br"));
      pp.innerHTML += `${imgTextArray[i]}`;
    }
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
 
function createSearchInput() {
  const parent = document.getElementsByClassName('container-1')[0];
  const childInput = document.createElement('input');
  parent.appendChild(childInput);
}

*/

function createColor(colorClassName, colorNumber) {
  const ul = document.getElementsByClassName(`${colorClassName}`)[0];
  const li = document.createElement('li');
  li.style.backgroundColor = `#${colorNumber}`;
  ul.appendChild(li);
}

function createNewIcon() {
  const newProduct = document.getElementsByClassName('item-4x1')[0];
  const newIconDiv = document.createElement('div');
  newIconDiv.className = 'new-icon';
  newProduct.appendChild(newIconDiv);
  const newIconP = document.createElement('p');
  newIconP.className = 'new-icon-text cancelCursor';
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

function showSearchBar() {
  const searchBarDiv = document.getElementsByClassName('item-1x4')[0];
  searchBarDiv.style.display = 'flex';
}

function hideSearchBar() {
  const searchBarDiv = document.getElementsByClassName('item-1x4')[0];
  searchBarDiv.style.display = 'none';
}

// ---- Hover換圖網址函數 -----

function hover(element, url) {
  element.setAttribute('src', url);
}

function unhover(element, url) {
  element.setAttribute('src', url);
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

// 點選放大鏡後，顯示搜尋Bar，按header外其他位置，隱藏搜尋Bar
const magnifier = document.getElementsByClassName('item-1x2')[0];

magnifier.addEventListener('click', () => {
  showSearchBar();
  document.getElementsByTagName('section')[0].addEventListener('click', () => {
    hideSearchBar();
  });
});

// 打搜尋字串，再滑鼠點選放大鏡後，使用AJAX撈資料並顯示。之後清除input text

const searchBarBtn = document.getElementsByClassName('img-1x4')[0];

searchBarBtn.addEventListener('click', () => {
  userValue = document.getElementsByClassName('search-bar')[0].value;
  console.log('userValue Updated');
  console.log(userValue);
  ajax(`${productListURL}/search?keyword=${userValue}`, setProduct);
  document.getElementsByClassName('search-bar')[0].value = '';   //打userValue =  ''; 無效??
});

// 先監聽滑動事件，滑動到底時，使用AJAX再撈資料，顯示多撈到的產品，並取消監聽滑動事件
// 要監聽時，再加入 window.addEventListener('scroll', handleScroll);
// 要移除監聽時，再加入 window.removeEventListener('scroll', handleScroll);

let ticking = false;

function handleScroll(e) {
  if (!ticking) {
    window.requestAnimationFrame(function () {
      doAjaxGetExt();
      ticking = false;
    });
  }
  ticking = true;
}

function doAjaxGetExt() {
  let windowHeight = window.innerHeight;
  let footerRemains = document.getElementsByClassName('container-5')[0].getBoundingClientRect().top;
  if (footerRemains - windowHeight < 0) {
    ajax(extPageURL, setExtProduct);
    // 先移除卷軸監聽。若有下頁資料，再在setExtProduct函數中加回卷軸監聽
    window.removeEventListener('scroll', handleScroll);
  }
}


function setExtProduct(parsedData) {
  pageNumberNow++;
  // 加入瀏覽器卷軸滑動到底時，要引入下頁的URL，並加入已被移除的卷軸監聽。若無下頁，則設定URL為空
  if (parsedData.paging !== undefined) {
    extPageURL = `${productListURL}/${pageIndicator}?paging=${parsedData.paging}`;
    window.addEventListener('scroll', handleScroll);
  } else {
    extPageURL = '';
  }

  // 創造產品Div、加入JSON物件資料

  const numOfItem = 6 * pageNumberNow;
  const Parent = document.getElementsByClassName('container-4')[0];

  for (let i = 0; i < parsedData.data.length; i++) {

    // 創造產品Div，及其下子元素

    const newItemDiv = document.createElement('div');
    newItemDiv.setAttribute('class', `item-4x${numOfItem + i + 1} item-product`);
    const newItemImg = document.createElement('img');
    newItemImg.setAttribute('class', `img-4x${numOfItem + i + 1} img-product`);
    const newColorUl = document.createElement('ul');
    newColorUl.setAttribute('class', `color-4x${numOfItem + i + 1} color-product`);
    const newText = document.createElement('p');
    newText.setAttribute('class', `text-4x${numOfItem + i + 1} text-product`);
    Parent.appendChild(newItemDiv);
    newItemDiv.appendChild(newItemImg);
    newItemDiv.appendChild(newColorUl);
    newItemDiv.appendChild(newText);

    // 加入產品圖片

    const img = document.getElementsByClassName(`img-4x${numOfItem + i + 1}`)[0];
    img.src = parsedData.data[i].main_image;

    // 加入產品顏色，兩步驟 1.先移除所有產品顏色 2.再新增顏色
    // 1. 先移除所有產品顏色
    const colorClassName = `color-4x${numOfItem + i + 1}`;
    const noColorUl = document.getElementsByClassName(colorClassName)[0];
    const li = document.querySelectorAll(`.${colorClassName} li`);
    li.forEach((element) => { noColorUl.removeChild(element); });

    // 2.再新增所有產品顏色
    for (let j = 0; j < parsedData.data[i].colors.length; j++) {
      const colorCode = parsedData.data[i].colors[j].code;
      createColor(colorClassName, colorCode);
    }

    // 加入產品文字及價錢
    const text = document.getElementsByClassName(`text-4x${numOfItem + i + 1}`)[0]
    text.innerHTML = `${parsedData.data[i].title}`;
    text.appendChild(document.createElement("br"));
    text.innerHTML += `TWD. ${parsedData.data[i].price}`;
  }

}

// 加入跑馬燈圓圈事件監聽，點擊跑馬燈圓圈後，切換發燒圖片

const circleUl = document.querySelector('.dot ul');

circleUl.addEventListener('click', (e) => {
  const bulletImgA = document.querySelectorAll('.item-3x3 > a');
  const bulletWordsDiv = document.querySelectorAll('.item-3x1 > div');
  const dotLi = document.querySelectorAll('.dot > ul > li');

  const bulletImgDisplayTime = getComputedStyle(document.documentElement).
    getPropertyValue('--bullet-img-display-time').substring(1, 2);

  // 重設每張圖片(及文字)的delay time，讓動畫從點選的圖片開始撥放
  if (e.target.className.substring(0, 1) == 1) {
    bulletImgA[0].style.animationDelay = '0s';
    bulletImgA[1].style.animationDelay = `${bulletImgDisplayTime}s`;
    bulletImgA[2].style.animationDelay = `${bulletImgDisplayTime * 2}s`;

    bulletWordsDiv[0].style.animationDelay = '0s';
    bulletWordsDiv[1].style.animationDelay = `${bulletImgDisplayTime}s`;
    bulletWordsDiv[2].style.animationDelay = `${bulletImgDisplayTime * 2}s`;

    dotLi[0].style.animationDelay = '0s';
    dotLi[1].style.animationDelay = `${bulletImgDisplayTime}s`;
    dotLi[2].style.animationDelay = `${bulletImgDisplayTime * 2}s`;

  } else if (e.target.className.substring(0, 1) == 2) {
    bulletImgA[0].style.animationDelay = `-${bulletImgDisplayTime}s`;
    bulletImgA[1].style.animationDelay = '0s';
    bulletImgA[2].style.animationDelay = `${bulletImgDisplayTime}s`;

    bulletWordsDiv[0].style.animationDelay = `-${bulletImgDisplayTime}s`;
    bulletWordsDiv[1].style.animationDelay = '0s';
    bulletWordsDiv[2].style.animationDelay = `${bulletImgDisplayTime}s`;

    dotLi[0].style.animationDelay = `-${bulletImgDisplayTime}s`;
    dotLi[1].style.animationDelay = '0s';
    dotLi[2].style.animationDelay = `${bulletImgDisplayTime}s`;

  } else if (e.target.className.substring(0, 1) == 3) {
    bulletImgA[0].style.animationDelay = `-${bulletImgDisplayTime * 2}s`;
    bulletImgA[1].style.animationDelay = `-${bulletImgDisplayTime * 1}s`;
    bulletImgA[2].style.animationDelay = '0s';

    bulletWordsDiv[0].style.animationDelay = `-${bulletImgDisplayTime * 2}s`;
    bulletWordsDiv[1].style.animationDelay = `-${bulletImgDisplayTime * 1}s`;
    bulletWordsDiv[2].style.animationDelay = '0s';

    dotLi[0].style.animationDelay = `-${bulletImgDisplayTime * 2}s`;
    dotLi[1].style.animationDelay = `-${bulletImgDisplayTime * 1}s`;
    dotLi[2].style.animationDelay = '0s';
  }

  // 移除動畫的class，再新增完全一樣的class，讓動畫能重新撥放
  for (let i = 0; i < bulletImgA.length; i++) {
    // 1. 移除動畫的class
    bulletImgA[i].classList.remove("item-3x3-a");
    bulletWordsDiv[i].classList.remove("item-3x1-a");
    dotLi[i].classList.remove("dot-a");
    // 2. 網頁說明: 缺少下面这句不会运行。尝试删除这句，动画不会被再次触发
    bulletImgA[i].offsetWidth = bulletImgA[i].offsetWidth;
    bulletWordsDiv[i].offsetWidth = bulletWordsDiv[i].offsetWidth;
    dotLi[i].offsetWidth = dotLi[i].offsetWidth;
    // 3. 重新添加class
    bulletImgA[i].classList.add("item-3x3-a");
    bulletWordsDiv[i].classList.add("item-3x1-a");
    dotLi[i].classList.add("dot-a");
  }
});


