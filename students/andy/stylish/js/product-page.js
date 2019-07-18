
let pageNow = 0;
let colorNow = 0;
let sizeNow = 0;
let remainStocks = -10;

ajax(`${productDetailURL}${getQueryValueByName('id')}`, setDetail);

function setDetail(parsedData) {
  pageNow = `${productDetailURL}${getQueryValueByName('id')}`;
  colorNow = 0;
  sizeNow = 0;
  remainStocks = -10;

  if (parsedData.data) {

    // 加入所有圖片

    createAppendImg('item-3x1', `${parsedData.data.main_image}`);
    parsedData.data.images.forEach((src) => { createAppendImg('item-4x3', `${src}`) });

    // 加入所有文字

    createAppendText('name-3x2', 'p', parsedData.data.title);
    createAppendText('id-3x2', 'p', parsedData.data.id);
    createAppendText('price-3x2', 'p', parsedData.data.price);
    createAppendText('item-4x2', 'p', parsedData.data.story);

    const detailText = `<br> 
      ${parsedData.data.texture}<br> 
      ${parsedData.data.description.replace(/\r\n/g, "<br />")}<br> 
      <br> 
      清洗：${parsedData.data.wash}<br> 
      產地：${parsedData.data.place}`;

    createAppendText('item-3x2-d', 'p', detailText);


    // 加入產品顏色，兩步驟 1.先移除產品顏色、尺寸 2.再新增顏色、尺寸
    // 1. 先移除產品顏色、尺寸

    const colorClassName = `color-3x2`;
    const noColorUl = document.getElementsByClassName(colorClassName)[0];
    const colorLi = document.querySelectorAll(`.${colorClassName} li`);
    colorLi.forEach((element) => { noColorUl.removeChild(element); });

    const sizeClassName = `size-3x2`;
    const noSizeUl = document.getElementsByClassName(sizeClassName)[0];
    const sizeLi = document.querySelectorAll(`.${sizeClassName} li`);
    sizeLi.forEach((element) => { noSizeUl.removeChild(element); });

    // 2.再新增所有產品顏色、尺寸
    for (let i = 0; i < parsedData.data.colors.length; i++) {
      const colorCode = parsedData.data.colors[i].code;
      createColor(colorClassName, colorCode);
    }
    for (let j = 0; j < parsedData.data.sizes.length; j++) {
      const sizeCode = parsedData.data.sizes[j];
      createSize(sizeClassName, sizeCode);
    }

    // 加入產品文字及價錢
    // const text = document.getElementsByClassName(`text-4x${i + 1}`)[0]
    // text.innerHTML = `${parsedData.data[i].title}`;
    // text.appendChild(document.createElement("br"));
    // text.innerHTML += `TWD. ${parsedData.data[i].price}`;
  }

}


function createSize(sizeClassName, sizeNumber) {
  const ul = document.getElementsByClassName(`${sizeClassName}`)[0];
  const li = document.createElement('li');
  li.innerText = `${sizeNumber}`;
  ul.appendChild(li);
}


// ---- 轉換色碼函數，無井字號 -----

var hexDigits = new Array
  ("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");

//Function to convert rgb color to hex format

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

// ---- 加入事件監聽函數 -----

// 點選顏色後，標出色塊，並取出資料。轉成色碼後，給變數colorNow

const colorUl = document.getElementsByClassName('color-3x2')[0];

function clickSetOnlyOneClass(setClassName, parentClassName, clickEvent) {
  if (clickEvent.target.className !== parentClassName) {
    if (document.getElementsByClassName(setClassName).length === 0) {
      clickEvent.target.setAttribute('class', setClassName);
    } else {
      for (let i = 0; i < event.target.parentNode.childElementCount; i++) {
        clickEvent.target.parentNode.children[i].classList.remove(setClassName);
      }
    }
    clickEvent.target.setAttribute('class', setClassName);
  }
}



colorUl.addEventListener('click', (e) => {
  clickSetOnlyOneClass('color-highlight', 'color-3x2', e);
  colorNow = rgb2hex(e.target.style.backgroundColor).toUpperCase();
  // 加入判斷式，取出庫存數值
  if (sizeNow != 0) {
    ajax(`${productDetailURL}${getQueryValueByName('id')}`, getStocks);
  }
});

// 點選尺寸後，切換顯示圖像，並取出資料。給變數sizeNow
const sizeUl = document.getElementsByClassName('size-3x2')[0];

sizeUl.addEventListener('click', (e) => {
  clickSetOnlyOneClass('size-highlight', 'size-3x2', e);
  sizeNow = e.target.innerText;
  // 加入判斷式，取出庫存數值
  if (colorNow != 0) {
    ajax(`${productDetailURL}${getQueryValueByName('id')}`, getStocks);
  }

});

function getStocks(parsedData) {
  parsedData.data.variants.forEach((element) => {
    if (element.color_code == colorNow && element.size == sizeNow) {
      remainStocks = element.stock;
      console.log(remainStocks);
      if (document.querySelectorAll('.remains-3x2 p').length > 0) { 
        removeAppendText('remains-3x2', 'p'); 
      }
      document.querySelector('.remains-3x2').innerText = '庫存：';
      createAppendText('remains-3x2', 'p', remainStocks);
    }
  });
}




// 點選加減鈕後，切換顯示圖像，並取出資料

const amountDiv = document.getElementsByClassName('item-3x2-a')[0];

amountDiv.addEventListener('click', (e) => {
  if (e.target.className !== 'amount-3x2') {
    clickSetOnlyOneClass('amount-highlight', 'item-3x2-a', e);
  }
});

