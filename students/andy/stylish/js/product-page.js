
// -- Ajax相關函數宣告 --

function setDetail(parsedData) {
  pageNow = `${productDetailURL}${getQueryValueByName('id')}`;
  colorNow = 0;
  sizeNow = 0;
  remainStocks = -10;
  remainStocksMinusCart = -10;

  if (parsedData.data) {

    // 加入所有圖片，.slice(0, 2)，為只選前兩張圖

    createAppendImg('item-3x1', `${parsedData.data.main_image}`);
    parsedData.data.images.slice(0, 2).forEach((src) => { createAppendImg('item-4x3', `${src}`) });

    // 加入所有文字

    createAppendText('name-3x2', 'p', parsedData.data.title);
    createAppendText('id-3x2', 'p', parsedData.data.id);
    createAppendText('price-3x2', 'span', parsedData.data.price);
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

      //取得 sever 端庫存 element.stock ，再扣掉目前購物車內有的數量。
      remainStocks = element.stock;
      remainStocksMinusCart = element.stock - getCartRemains(parsedData.data.id, element.color_code, element.size, orderJSON.order.list);

      // 如果庫存為 0，先讓購物車按鈕不能按
      checkRmainsDisableBtn(remainStocksMinusCart, '.add-3x2');
      // 如果多於一個數字的<p>，先清除數字
      if (document.querySelectorAll('.remains-3x2 span').length > 0) {
        removeAppendText('remains-3x2', 'span');
      }
      // 再加入數字與庫存字樣
      document.querySelector('.remains-3x2').innerText = '庫存：';
      createAppendText('remains-3x2', 'span', remainStocksMinusCart);
      // 畫面顯示的購買數量設定為0，以及設定user點選加或減的值為 0
      userAmount = 0;
      document.querySelector('.amount-3x2').innerText = 0;
      
      // 將訂購產品資訊，加入user order物件，將訂購數量設為0。要先判斷顏色的中文名稱，才有值加入user order物件
      let colorName = "";
      colorNameRef.forEach((el) => { if (element.color_code == el.code) { colorName = el.name; }});
      userOrder = new orderList(parsedData.data.id, parsedData.data.title, parsedData.data.price, 
        element.color_code, colorName, element.size, 0, parsedData.data.main_image, element.stock);
  
      //購物車數量圓點更新，含判斷有無圓點創出
      setCartNum('cart-num', orderJSON.order.list);
    }
  });
}

//  -- Ajax相關函數執行 --

ajax(`${productDetailURL}${getQueryValueByName('id')}`, setDetail);

// ---- 創造元素相關 -----

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

function getCartRemains(searchProductID, searchedColor, searchedSize, dataArray) {
  let foundRemains = 0;
  let foundObject = dataArray.filter((el) => { return (searchProductID == el.id && searchedColor == el.color.code && searchedSize == el.size)})[0];
  if (foundObject !== undefined) { foundRemains = foundObject.qty}
  // 上面兩行 可換成dataArray.forEach((el) => { if (searchProductID == el.id && searchedColor == el.color.code && searchedSize == el.size) { foundRemains = el.qty; } });
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

const plusBtn = document.getElementById('plus');
const minusBtn = document.getElementById('minus');

function handleClickPlusMinus(e) {
  if (colorNow !== 0 && sizeNow !== 0) {
    //設定css 變色class
    clickSetOnlyOneClass('amount-highlight', 'item-3x2-a',  e ); 
    //先刷新螢幕顯示值，再更新userAmount參數
    let userAmountAfterClick = clickPlusMinusCalculate(userAmount, remainStocksMinusCart, e);
    document.querySelector ('.amount-3x2').innerText = userAmountAfterClick;
    userAmount = userAmountAfterClick;
  } 
 else if(colorNow == 0 || sizeNow == 0 ){ 
    alert("please select color and size first");
  }
}

plusBtn.addEventListener('click', (e) => { handleClickPlusMinus(e) });
minusBtn.addEventListener('click',(e) => { handleClickPlusMinus(e) });

// 點選購物車後，讓庫存數量減少，並創物件，取出資料。庫存減掉放進購物車的，即時顯示在畫面
// 若切換不同型號或產品，再回到原先產品，秀出來之前先掃過orderList JSON，然後再顯示。此功能在getStocks裡

const addBtn = document.getElementsByClassName('add-3x2')[0];

addBtn.addEventListener('click', (e) => {
  
  //---與使用者購買數量相關---
  //將訂購數量，加入user order物件，再將user order加入orderJSON物件
  let haveSameItem = false;

  for (let i = 0; i < orderJSON.order.list.length; i++){
    if (orderJSON.order.list[i].id == userOrder.id && orderJSON.order.list[i].color.code == colorNow && orderJSON.order.list[i].size == sizeNow) { //若原先就有物件，將local JSON數量，加進使用者數字
        orderJSON.order.list[i].qty = orderJSON.order.list[i].qty + userAmount;
        haveSameItem = true;
      }
    } 
    
  if (!haveSameItem) {  //將創造的物件，指定進local JSON
      userOrder.qty = userAmount;
      orderJSON.order.list.push(userOrder);

      //--- 創造購物車圓點、重設數字 ---
    if (document.querySelectorAll('.cart-num p').length == 0) {
      createCartNumIcon('cart', 'cart-num', 1);
      }
      setCartNum('cart-num', orderJSON.order.list);
    }

  //將訂購的物件，存入localStorage
    localStorage.setItem('orderJSONinLocal', JSON.stringify(orderJSON));


  //--- 與剩餘庫存相關 ---

  //先將庫存數字扣掉，存進remainStocksMinusCart全域變數，後續按鈕點擊加減的event監聽要用到 (amountDiv.addEventListener)
  remainStocksMinusCart = document.querySelector('.remains-3x2 span').innerText - userAmount;
  //用扣完後的庫存數字，刷新螢幕顯示值，再更新userAmount參數
  document.querySelector('.remains-3x2 span').innerText = remainStocksMinusCart;
  // 如果庫存為0，讓購物車按鈕不能按
  checkRmainsDisableBtn(remainStocksMinusCart, '.add-3x2');


  //---與清除使用者購買數量相關---
  //清除使用者數字
  userAmount = 0;
  document.querySelector ('.amount-3x2').innerText = 0;

  //清除使用者訂單---不能清，否則馬上重複購買會有問題
  //userOrder = new orderList("", "", 0, "", "", "", 0);
});