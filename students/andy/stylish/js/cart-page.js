
function setTotalPrice(additionalFee) {
    let noFeeTotal = 0;
    orderJSON.order.list.forEach((element) => { noFeeTotal += element.price * element.qty; });
    document.querySelector('.product-sum').lastElementChild.innerText = noFeeTotal;
    document.querySelector('.all-sum').lastElementChild.innerText = noFeeTotal + additionalFee;
}

function putShippingFee(fee) {
    const shippingFeeNode = document.querySelector('.shipping-fee').lastElementChild;
    shippingFeeNode.innerText = fee;
}

// sendFinalOrder 函數說明: 若資料沒問題，函數會回傳移除圖片連結及庫存之後的物件。若過程中有問題，會回傳False

function sendFinalOrder(paymentEleID, nameEleID, phoneEleID, emailEleID, addressEleID, timeEleID, primeKey, JsonObj) {
    const paymentMethod = document.getElementById(paymentEleID).value;
    const name = document.getElementById(nameEleID).value;
    const phone = document.getElementById(phoneEleID).value;
    const email = document.getElementById(emailEleID).value;
    const address = document.getElementById(addressEleID).value;
    const timeInputList = document.getElementById(timeEleID).children;

    // 找出付款方式
    let time = 'no any delivery time selected';
    for (let i = 0; i < timeInputList.length; i++) {
        if (timeInputList[i].firstElementChild.checked) {
            time = timeInputList[i].firstElementChild.value;
        }
    }

    // 計算總價錢
    let noFeeTotal = 0;
    JsonObj.order.list.forEach((element) => { noFeeTotal += element.price * element.qty; });
    const addFeeTotal = noFeeTotal + shippingFee;

    // 加入判斷式，檢查表格是否空白
    if (addFeeTotal == shippingFee) {
        alert('沒買任何物品喔');
        return false;
    }
    if (name === "" || phone === "" || email === "" || address === "") {
        alert('還沒填完收件人資料喔');
        return false;
    }
    if (time == 'no any delivery time selected') {
        alert('還沒選配送時間喔');
        return false;
    }

    // 設定primeKey
    JsonObj.prime = primeKey;
    // 設定寄件資料
    // JsonObj.order = new shippingInfo("delivery", "credit_card", 1234, 60, 1300, "Luke", "0987654321", "email@email", "市政府站", "morning");
    const info = new shippingInfo("delivery", paymentMethod, noFeeTotal, shippingFee, addFeeTotal, name, phone, email, address, time);
    // 將原先物件與 info 物件合併
    JsonObj.order = {...info, ...JsonObj.order};
    // 移除產品圖片及庫存後，放入新物件
    let finalJsonObj = Object.assign({}, JsonObj);
    finalJsonObj.order.list.forEach((element) => { delete element.imgSrc; delete element.stock; });

    return finalJsonObj;

    // ----存入 local storage -----，也可不用存
    //localStorage.setItem('orderJSONinLocal', JSON.stringify(JsonObj));
}

document.querySelector(`.text-3x1x2 > div`).innerText = `購物車 (${orderJSON.order.list.length})`;

for (let i in orderJSON.order.list) {

    createAppendDiv("item-3x2", "div", `cart-product-${Number(i) + 1} cart-product`);
    createAppendDiv(`cart-product-${Number(i) + 1}`, "div", "row-or-column-1");
    createAppendDiv(`cart-product-${Number(i) + 1}`, "div", "row-or-column-2");

    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-1`, "div", `cart-product-1x1`);
    createAppendImg(`cart-product-${Number(i) + 1} .row-or-column-1 .cart-product-1x1`, orderJSON.order.list[`${i}`].imgSrc);
    document.querySelector(`.cart-product-${Number(i) + 1} .row-or-column-1 .cart-product-1x1 img`).setAttribute("class", "img-product");

    let detailText = `${orderJSON.order.list[i].name} <br><br> 
    ${orderJSON.order.list[i].id}<br><br> 
    顏色 | ${orderJSON.order.list[i].color.name}<br> 
    尺寸 | ${orderJSON.order.list[i].size}`;

    orderJSON.order.list[`${i}`].name;
    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-1`, "div", `cart-product-1x2`);
    createAppendText(`cart-product-${Number(i) + 1} .row-or-column-1 .cart-product-1x2`, "p", detailText);
    document.querySelector(`.cart-product-${Number(i) + 1} .row-or-column-1 .cart-product-1x2 p`).setAttribute("class", "text-product");

    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-2`, "div", `cart-product-1x3`);
    createAppendText(`cart-product-${Number(i) + 1} .row-or-column-2 .cart-product-1x3`, "p", "數量");
    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-2 .cart-product-1x3`, "select", `qty-${Number(i) + 1} qty-product`);
    createAppendOption(`qty-${Number(i) + 1}`, orderJSON.order.list[`${i}`].stock, orderJSON.order.list[`${i}`].qty);

    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-2`, "div", `cart-product-1x4`);
    createAppendText(`cart-product-${Number(i) + 1} .row-or-column-2 .cart-product-1x4`, "p", "單價");
    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-2 .cart-product-1x4`, "div", `price-${Number(i) + 1} price-product`);
    document.querySelector(`.price-${Number(i) + 1}`).innerText = `NT. ${orderJSON.order.list[i].price}`;

    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-2`, "div", `cart-product-1x5`);
    createAppendText(`cart-product-${Number(i) + 1} .row-or-column-2 .cart-product-1x5`, "p", "小計");
    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-2 .cart-product-1x5`, "div", `pxq-${Number(i) + 1} pxq-product`);
    let chosenQty = document.querySelector(`.qty-${Number(i) + 1} option:checked`).value;
    document.querySelector(`.pxq-${Number(i) + 1}`).innerText = `NT. ${orderJSON.order.list[i].price * chosenQty}`;

    createAppendDiv(`cart-product-${Number(i) + 1}`, "div", `cart-product-1x6`);
    createAppendImg(`cart-product-${Number(i) + 1} .cart-product-1x6`, "./image/cart-remove.png");
    document.querySelector(`.cart-product-${Number(i) + 1} .cart-product-1x6 img`).setAttribute("class", `trash-can-${Number(i) + 1} trash-can-product`);
    document.querySelector(`.trash-can-${Number(i) + 1}`).setAttribute("onmouseover", "hover(this, './image/cart-remove-hover.png')");
    document.querySelector(`.trash-can-${Number(i) + 1}`).setAttribute("onmouseout", "hover(this, './image/cart-remove.png')");

    // ---- 加入刪除數量事件監聽函數 -----
    document.querySelector(`.trash-can-${Number(i) + 1}`).addEventListener('click', (e) => {
        const colOfTrushCan = document.querySelectorAll('.trash-can-product');
        let trashCanNumMinusOne = -10;
        for ( let i = 0 ; i < colOfTrushCan.length ; i ++) {
            if (colOfTrushCan[i] == e.target) {trashCanNumMinusOne = i; }
        }
        
        // ---- 統計畫面中垃圾桶數量，刪除物件元素與local storage -----
        orderJSON.order.list.splice(trashCanNumMinusOne, 1);
        localStorage.setItem('orderJSONinLocal', JSON.stringify(orderJSON));
        // ---- 刪除UI -----
        const productParent = e.target.parentNode.parentNode;
        productParent.parentNode.removeChild(productParent);
        // ---- 設定UI金額 -----
        setTotalPrice(shippingFee);
        // ---- 重設UI購物車後面的括號 -----
        document.querySelector(`.text-3x1x2 > div`).innerText = `購物車 (${orderJSON.order.list.length})`;
        //設定購物車圓點
        if (orderJSON.order.list.length > 0) {
            setCartNum('cart-num', orderJSON.order.list);
        } else {
            removeCartIcon('cart-num');
            //如果購物車無商品，顯示無商品字樣
            createAppendText('item-3x2', 'p', '都被刪光光了，無商品喔');
        }
    });
}


putShippingFee(shippingFee);
setTotalPrice(shippingFee);

// ---- 加入點選數量事件監聽函數 -----

for (let i = 0; i < document.querySelectorAll('.cart-product-1x3 select').length; i++) {
    document.querySelectorAll('.cart-product-1x3 select')[i].addEventListener('change', (e) => {
        let chosenQty = e.target.value;
        const price = e.target.parentNode.parentNode.children[1].children[1].innerText.substr(4);
        const parentDiv = e.target.parentNode.parentNode.children[2].children[1];
        parentDiv.innerText = `NT. ${price * chosenQty}`;

        // 檢查event發生在何者產品，之後更新orderJSON數量，與瀏覽器 local storage
        const textDetailArray = e.target.parentNode.parentNode.previousElementSibling.children[1].children[0].innerText.split(/\n/ig);
        const ID = textDetailArray[2];
        const color = textDetailArray[4].substr(5);
        const size = textDetailArray[5].substr(5);
        for (let j = 0; j < orderJSON.order.list.length; j++) {
            if (orderJSON.order.list[j].id == ID && orderJSON.order.list[j].color.name == color && orderJSON.order.list[j].size == size) {
                orderJSON.order.list[j].qty = Number(e.target.value);
                // 設定瀏覽器 local storage
                localStorage.setItem('orderJSONinLocal', JSON.stringify(orderJSON));
                // ---- 設定UI金額 -----
                setTotalPrice(shippingFee);
            }
        }
        //設定購物車圓點
        if (orderJSON.order.list.length > 0) {
            setCartNum('cart-num', orderJSON.order.list);
        } else {
            removeCartIcon('cart-num');
            //如果購物車無商品，顯示無商品字樣
            createAppendText('item-3x2', 'p', '都被你刪光光了，無商品喔');
        }
    });
}

