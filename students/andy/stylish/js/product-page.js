
let pageNow = 0;
let idLastClickAddCart = 0;
let colorNow = 0;
let sizeNow = 0;
let remainStocks = -10;
let remainStocksAfterBuy = -10;
let userAmount = 0;
let userOrder = new orderList("", "", 0, "", "", "", 0);

ajax(`${productDetailURL}${getQueryValueByName('id')}`, setDetail);

function setDetail(parsedData) {
  pageNow = `${productDetailURL}${getQueryValueByName('id')}`;
  idLastClickAddCart = 0;
  colorNow = 0;
  sizeNow = 0;
  remainStocks = -10;
  remainStocksAfterBuy = -10;

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
  }
}

// 送出指令給server，得到解析後的JSON後，取得庫存的函數如下

function getStocks(parsedData) {
  const colorNameRef = parsedData.data.colors;
  parsedData.data.variants.forEach((element) => {
    if (element.color_code == colorNow && element.size == sizeNow) {
      //取得 sever 端庫存 element.stock ，再扣掉目前購物車內有的數量
      remainStocks = element.stock;
      remainStocksAfterBuy = element.stock - checkCartRemains(parsedData.data.id, element.color_code, element.size, orderJSON.list);
      console.log('R');
      console.log(remainStocksAfterBuy);

      // 如果庫存為 0，先讓購物車按鈕不能按
      checkRmainsDisableBtn(remainStocks, '.add-3x2');
      // 如果多餘一個數字的<p>，先清除數字
      if (document.querySelectorAll('.remains-3x2 p').length > 0) {
        removeAppendText('remains-3x2', 'p');
      }
      // 再加入數字與庫存字樣
      document.querySelector('.remains-3x2').innerText = '庫存：';
      createAppendText('remains-3x2', 'p', remainStocksAfterBuy);
      // 清除畫面顯示的欲購買數量，以及設定user點選加或減的值為 0
      userAmount = 0;
      document.querySelector('.amount-3x2').innerText = 0;
      
      // 將訂購產品資訊，除訂購數量外，加入user order物件。要先判斷顏色的中文名稱
      let colorName = "";
      colorNameRef.forEach((el) => { if (element.color_code == el.code) { colorName = el.name; }});
      userOrder = new orderList(parsedData.data.id, parsedData.data.title, parsedData.data.price, 
        element.color_code, colorName, element.size, 0);
    }
  });
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
  // 加入切換class函數，讓點選後保持顏色
  clickSetOnlyOneClass('color-highlight', 'color-3x2', e);

  if (e.target.tagName !== 'UL') {
    colorNow = rgb2hex(e.target.style.backgroundColor).toUpperCase();
    // 加入判斷式，取出庫存數值
    if (sizeNow != 0) {
      ajax(`${productDetailURL}${getQueryValueByName('id')}`, getStocks);
    }
  }
});

// 點選尺寸後，切換顯示圖像，並取出資料。給變數sizeNow
const sizeUl = document.getElementsByClassName('size-3x2')[0];

sizeUl.addEventListener('click', (e) => {
  // 加入切換class函數，讓點選後保持顏色
  clickSetOnlyOneClass('size-highlight', 'size-3x2', e);

  if (e.target.tagName !== 'UL') {
    sizeNow = e.target.innerText;
    // 加入判斷式，取出庫存數值
    if (colorNow != 0) {
      ajax(`${productDetailURL}${getQueryValueByName('id')}`, getStocks);
    }
  }
});


// 點選加減鈕後，要取資料出來，預先準備使用的函數

function checkCartRemains(searchProductID, searchedColor, searchedSize, dataArray) {
  let foundRemains = 0;
  dataArray.forEach((el) => { if (searchProductID == el.id && searchedColor == el.color.code && searchedSize == el.size) { foundRemains = el.qty; } });
  return foundRemains;
}

function checkRmainsDisableBtn(remains, btnClassName) {
  // 如果庫存為0，先讓購物車按鈕不能按
  if (remains == 0) {
     document.querySelector(btnClassName).disabled = true;
   }
  else {
  // 如果庫存不為0，啟動購物車按鈕
    document.querySelector(btnClassName).disabled = false;
  }
}

// 數量為0時，讓減號不能再讓數字低於 0。 數量等於庫存時，讓加號不能加超過庫存
function clickPlusMinusCalculate(number, remains, clickEvent){
  let numberAfter = number;
  if(clickEvent.target.id == 'plus' && number <= remains -1 ) { numberAfter = number + 1; } 
  else if (clickEvent.target.id == 'minus' && number >= 1) { numberAfter = number - 1; }
  return numberAfter; 
}

// 點選加減鈕後，切換顯示圖像，並取出資料

const amountDiv = document.getElementsByClassName('item-3x2-a')[0];

amountDiv.addEventListener('click', (e) => {
  if (e.target.className !== 'amount-3x2' && colorNow !== 0 && sizeNow !== 0) {
      //設定css 變色class
      clickSetOnlyOneClass('amount-highlight', 'item-3x2-a',  e ); 
      //先刷新螢幕顯示值，再更新userAmount參數
      let userAmountAfterClick = clickPlusMinusCalculate(userAmount, remainStocksAfterBuy, e);
      document.querySelector ('.amount-3x2').innerText = userAmountAfterClick;
      userAmount = userAmountAfterClick;
    } 
   else if(colorNow == 0 || sizeNow == 0 ){ 
      alert("please select color and size first");
    }
});

// 點選購物車後，讓庫存數量減少，並創物件，取出資料
// 要在顯示Remain庫存那邊，秀出來之前先掃過orderList JSON，然後再顯示

const addBtn = document.getElementsByClassName('add-3x2')[0];

addBtn.addEventListener('click', (e) => {
  
  //---與使用者購買數量相關---
  //將訂購數量，加入user order物件，再將user order加入orderJSON物件
  let x = orderJSON.list.length;
  let haveSameItem = false;
  // if (idLastClickAddCart == userOrder.id) {  //若原先就有物件，將local JSON數量，加進使用者數字

  // } else  //將創造的物件，指定進local JSON
  // { 
  //   userOrder.qty = userAmount;
  //   orderJSON.list[x] = userOrder;
  //   console.log("b");
  //   console.log(orderJSON.list[x]);
  //   console.log(orderJSON.list[x].qty);
  // }
  for (let i = 0; i < x; i++){
    if (orderJSON.list[i].id == userOrder.id && orderJSON.list[i].color.code == colorNow && orderJSON.list[i].size == sizeNow) { //若原先就有物件，將local JSON數量，加進使用者數字
        orderJSON.list[i].qty = orderJSON.list[i].qty + userAmount;
        console.log("a");
        console.log(orderJSON.list);
        console.log(orderJSON.list[i]);
        console.log(orderJSON.list[i].qty);
        haveSameItem = true;
      }
    } 
    
  if (!haveSameItem){  //將創造的物件，指定進local JSON
      userOrder.qty = userAmount;
      orderJSON.list[x] = userOrder;
      console.log("b");
      console.log(orderJSON.list);
      console.log(orderJSON.list[x]);
      console.log(orderJSON.list[x].qty);
    }
    
  //---與剩餘庫存相關---

  //先將庫存數字扣掉，存進remainStocksAfterBuy全域變數，後續按鈕點擊加減的event監聽要用到 (amountDiv.addEventListener)
  remainStocksAfterBuy = document.querySelector('.remains-3x2 p').innerText - userAmount;
  //用扣完後的庫存數字，刷新螢幕顯示值，再更新userAmount參數
  document.querySelector('.remains-3x2 p').innerText = remainStocksAfterBuy;
  // 如果庫存為0，讓購物車按鈕不能按
  checkRmainsDisableBtn(remainStocksAfterBuy, '.add-3x2');


  //---與清除使用者購買數量相關---
  //清除使用者數字
  userAmount = 0;
  document.querySelector ('.amount-3x2').innerText = 0;
    
  //加入
  idLastClickAddCart = userOrder.id;
  //清除使用者訂單---不能清，否則馬上重複購買會有問題
  //userOrder = new orderList("", "", 0, "", "", "", 0);

});