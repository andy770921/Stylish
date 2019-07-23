let shippingFee = 40;

function setTotalPrice(additionalFee) {
    let noFeeTotal = 0;
    orderJSON.list.forEach((element) => { noFeeTotal += element.price * element.qty; });
    document.querySelector('.product-sum').lastElementChild.innerText = noFeeTotal;
    document.querySelector('.all-sum').lastElementChild.innerText = noFeeTotal + additionalFee;
}


document.querySelector(`.text-3x1x2 > div`).innerText = `購物車 (${orderJSON.list.length})`;

for (let i in orderJSON.list) {

    createAppendDiv("item-3x2", "div", `cart-product-${Number(i) + 1} cart-product`);
    createAppendDiv(`cart-product-${Number(i) + 1}`, "div", "row-or-column-1");
    createAppendDiv(`cart-product-${Number(i) + 1}`, "div", "row-or-column-2");

    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-1`, "div", `cart-product-1x1`);
    createAppendImg(`cart-product-${Number(i) + 1} .row-or-column-1 .cart-product-1x1`, orderJSON.list[`${i}`].imgSrc);
    document.querySelector(`.cart-product-${Number(i) + 1} .row-or-column-1 .cart-product-1x1 img`).setAttribute("class", "img-product");

    let detailText = `${orderJSON.list[i].name} <br><br> 
    ${orderJSON.list[i].id}<br><br> 
    顏色 | ${orderJSON.list[i].color.name}<br> 
    尺寸 | ${orderJSON.list[i].size}`;

    orderJSON.list[`${i}`].name;
    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-1`, "div", `cart-product-1x2`);
    createAppendText(`cart-product-${Number(i) + 1} .row-or-column-1 .cart-product-1x2`, "p", detailText);
    document.querySelector(`.cart-product-${Number(i) + 1} .row-or-column-1 .cart-product-1x2 p`).setAttribute("class", "text-product");

    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-2`, "div", `cart-product-1x3`);
    createAppendText(`cart-product-${Number(i) + 1} .row-or-column-2 .cart-product-1x3`, "p", "數量");
    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-2 .cart-product-1x3`, "select", `qty-${Number(i) + 1} qty-product`);
    createAppendOption(`qty-${Number(i) + 1}`, orderJSON.list[`${i}`].stock, orderJSON.list[`${i}`].qty);

    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-2`, "div", `cart-product-1x4`);
    createAppendText(`cart-product-${Number(i) + 1} .row-or-column-2 .cart-product-1x4`, "p", "單價");
    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-2 .cart-product-1x4`, "div", `price-${Number(i) + 1} price-product`);
    document.querySelector(`.price-${Number(i) + 1}`).innerText = `NT. ${orderJSON.list[i].price}`;

    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-2`, "div", `cart-product-1x5`);
    createAppendText(`cart-product-${Number(i) + 1} .row-or-column-2 .cart-product-1x5`, "p", "小計");
    createAppendDiv(`cart-product-${Number(i) + 1} .row-or-column-2 .cart-product-1x5`, "div", `pxq-${Number(i) + 1} pxq-product`);
    let chosenQty = document.querySelector(`.qty-${Number(i) + 1} option:checked`).value;
    document.querySelector(`.pxq-${Number(i) + 1}`).innerText = `NT. ${orderJSON.list[i].price * chosenQty}`;

    createAppendDiv(`cart-product-${Number(i) + 1}`, "div", `cart-product-1x6`);
    createAppendImg(`cart-product-${Number(i) + 1} .cart-product-1x6`, "./image/cart-remove.png");
    document.querySelector(`.cart-product-${Number(i) + 1} .cart-product-1x6 img`).setAttribute("class", `trash-can-${Number(i) + 1} trash-can-product`);
    document.querySelector(`.trash-can-${Number(i) + 1}`).setAttribute("onmouseover", "hover(this, './image/cart-remove-hover.png')");
    document.querySelector(`.trash-can-${Number(i) + 1}`).setAttribute("onmouseout", "hover(this, './image/cart-remove.png')");

    // ---- 加入刪除數量事件監聽函數 -----
    document.querySelector(`.trash-can-${Number(i) + 1}`).addEventListener('click', (e) => {
        const productParent = e.target.parentNode.parentNode;
        const listNumber = productParent.className.substr(13, 1);
        // ---- 刪除物件元素與local storage -----
        orderJSON.list.splice(Number(listNumber - 1), 1);
        localStorage.setItem('orderJSONinLocal', JSON.stringify(orderJSON));
        // ---- 刪除UI -----
        productParent.parentNode.removeChild(productParent);
        // ---- 設定UI金額 -----
        setTotalPrice(shippingFee);
        //設定購物車圓點
        if (orderJSON.list.length > 0) {
            setCartNum('cart-num', orderJSON.list);
        } else {
            removeCartIcon('cart-num');
            //如果購物車無商品，顯示無商品字樣
            createAppendText('item-3x2', 'p', '都被你刪光光了，無商品喔');
        }


    });
}

function putShippingFee(fee) {
    const shippingFeeNode = document.querySelector('.shipping-fee').lastElementChild;
    shippingFeeNode.innerText = fee;
}

putShippingFee(shippingFee);
setTotalPrice(shippingFee);

// ---- 加入點選數量事件監聽函數 -----

for (let i = 0; i < document.querySelectorAll('select').length; i++) {
    document.querySelectorAll('select')[i].addEventListener('change', (e) => {
        let chosenQty = e.target.value;
        const price = e.target.parentNode.parentNode.children[1].children[1].innerText.substr(4);
        const parentDiv = e.target.parentNode.parentNode.children[2].children[1];
        parentDiv.innerText = `NT. ${price * chosenQty}`;

        // 檢查event發生在何者產品，之後更新orderJSON數量，與瀏覽器 local storage
        const textDetailArray = e.target.parentNode.parentNode.previousElementSibling.children[1].children[0].innerText.split(/\n/ig);
        const ID = textDetailArray[2];
        const color = textDetailArray[4].substr(5);
        const size = textDetailArray[5].substr(5);
        for (let j = 0; j < orderJSON.list.length; j++) {
            if (orderJSON.list[j].id == ID && orderJSON.list[j].color.name == color && orderJSON.list[j].size == size) {
                orderJSON.list[j].qty = Number(e.target.value);
                // 設定瀏覽器 local storage
                localStorage.setItem('orderJSONinLocal', JSON.stringify(orderJSON));
                // ---- 設定UI金額 -----
                setTotalPrice(shippingFee);
            }
        }
        //設定購物車圓點
        if (orderJSON.list.length > 0) {
            setCartNum('cart-num', orderJSON.list);
        } else {
            removeCartIcon('cart-num');
            //如果購物車無商品，顯示無商品字樣
            createAppendText('item-3x2', 'p', '都被你刪光光了，無商品喔');
        }
    });
}

