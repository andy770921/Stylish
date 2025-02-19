// -- Ajax相關函數宣告 --

function setProduct(parsedData) {

  pageNumberNow = 0;
  if (parsedData.data) {
    for (let i = 0; i < parsedData.data.length; i++) {

      //加入新產品Icon
      createNewIcon();
      // 加入產品圖片
      const img = document.getElementsByClassName(`img-4x${i + 1}`)[0];
      img.src = parsedData.data[i].main_image;

      // 加入產品超連結
      const productA = document.querySelector(`.item-4x${i + 1} a`);
      productA.href = `product.html?id=${parsedData.data[i].id}`;

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
        // 移除多餘產品超連結
        const noA = document.querySelector(`.item-4x${parsedData.data.length + i + 1} a`);
        noA.href = "";
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

  // 若有下一頁，加入瀏覽器卷軸滑動到底時，定出下頁的URL，並加入卷軸監聽。若在首頁發現無下頁，則設定URL為空，並不加入卷軸監聽
  if (parsedData.paging !== undefined) {
    extPageURL = `${productListURL}/${pageIndicator}?paging=${parsedData.paging}`;
    window.addEventListener('scroll', handleScroll);
  } else {
    extPageURL = '';
  }

}


function setBullet(parsedData) {
  for (let i = 0; i < parsedData.data.length; i++) {
    
    const bulletA = document.querySelectorAll('.item-3x3 a')[i];
    const bulletTextDiv = document.querySelectorAll('.item-3x1 div')[i];

    // 設定發燒產品id，給相應超連結a的href，及文字

    bulletA.href = `product.html?id=${parsedData.data[i].product_id}`;
    bulletTextDiv.setAttribute('onclick', `javascript:location.href='product.html?id=${parsedData.data[i].product_id}'`);

    // 加入發燒產品圖片
    bulletA.querySelector('div').style.backgroundImage = `url("${parsedData.data[i].picture}")`;

    // 加入發燒產品文字
    const imgContentArray = parsedData.data[i].story.split("\r\n");

    createPoet(imgContentArray, bulletTextDiv);
  }
}

//  -- Ajax相關函數執行 --

switch (getQueryValueByName("section")) {
  case "women":
    ajax(`${productListURL}/women`, setProduct);
    pageIndicator = "women";
    break;
  case "men":
    ajax(`${productListURL}/men`, setProduct);
    pageIndicator = "men";
    break;
  case "accessories":
    ajax(`${productListURL}/accessories`, setProduct);
    pageIndicator = "accessories";
    break;
  case "search":
    ajax(`${productListURL}/search?keyword=${getQueryValueByName("keyword")}`, setProduct);
    pageIndicator = `search?keyword=${getQueryValueByName("keyword")}`;
    break;
  default:
    ajax(`${productListURL}/all`, setProduct);
}

ajax(`${bulletURL}`, setBullet);


// ----創造與移除元素----

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



// ---- 加入事件監聽函數 -----


// 先監聽滑動事件，滑動到底時，使用AJAX再撈資料，顯示多撈到的產品，並取消監聽滑動事件
// 要監聽時，再加入 window.addEventListener('scroll', handleScroll);
// 要移除監聽時，再加入 window.removeEventListener('scroll', handleScroll);

let ticking = false;

function handleScroll(e) {
  if (!ticking) {
    window.requestAnimationFrame(function () {
      let windowHeight = window.innerHeight;
      let footerRemains = document.getElementsByClassName('container-5')[0].getBoundingClientRect().top;
      if (footerRemains - windowHeight < 0) {
        // 先移除卷軸監聽。若有下頁資料，再在setExtProduct函數中加回卷軸監聽
        window.removeEventListener('scroll', handleScroll);
        // 抓下頁資料
        ajax(extPageURL, setExtProduct);
      }
      ticking = false;
    });
  }
  ticking = true;
}


function setExtProduct(parsedData) {
  pageNumberNow++;
  // 加入瀏覽器卷軸滑動到底時，要引入下頁的URL，並加入已被移除的卷軸監聽。若無下頁，則設定URL為空
  if (parsedData.paging !== undefined) {
    if (pageIndicator.substr(0,6) == "search"){
      extPageURL = `${productListURL}/${pageIndicator}&paging=${parsedData.paging}`;
    } else {
      extPageURL = `${productListURL}/${pageIndicator}?paging=${parsedData.paging}`;
    }    
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
    const newItemA = document.createElement('a');
    const newItemImg = document.createElement('img');
    newItemImg.setAttribute('class', `img-4x${numOfItem + i + 1} img-product`);
    const newColorUl = document.createElement('ul');
    newColorUl.setAttribute('class', `color-4x${numOfItem + i + 1} color-product`);
    const newText = document.createElement('p');
    newText.setAttribute('class', `text-4x${numOfItem + i + 1} text-product`);
    Parent.appendChild(newItemDiv);
    newItemDiv.appendChild(newItemA);
    newItemA.appendChild(newItemImg);
    newItemDiv.appendChild(newColorUl);
    newItemDiv.appendChild(newText);

    // 加入產品圖片

    const img = document.getElementsByClassName(`img-4x${numOfItem + i + 1}`)[0];
    img.src = parsedData.data[i].main_image;

    // 加入產品超連結
    const productA = document.querySelector(`.item-4x${numOfItem + i + 1} a`);
    productA.href = `product.html?id=${parsedData.data[i].id}`;

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
    getPropertyValue('--bullet-img-display-time').slice(1).split('s')[0];

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


// ---加入點擊跑馬燈圖片監聽，可設定跳轉後頁面的AJAX網址，展開寫法，目前直接加在第一次讀取的迴圈中---

/*
for (let i = 0; i < document.querySelectorAll('.item-3x3 a').length; i++) {
  const bulletA = document.querySelectorAll('.item-3x3 a')[i];
  const bulletTextDiv = document.querySelectorAll('.item-3x1 div')[i];
  bulletA.addEventListener('click', (e) => {
    bulletA.href = `product.html?id=${bulletA.id}`;
  });

  bulletTextDiv.addEventListener('click', (e) => {
    window.location.href=`product.html?id=${bulletA.id}`;
  });
}
*/