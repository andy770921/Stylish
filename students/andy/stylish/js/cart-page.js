// function scanAllFindImg(imgID) {
//     let imgURL = 0;
//     let nextPage = -10;
//     ajax(`${productListURL}/all?paging=0`, (parsedData) => {
//         for (let i in parsedData.data) {
//             if (parsedData.data[i].id == imgID) { imgURL = parsedData.data[i].main_image; }
//             console.log(imgURL);
//         }
//         nextPage = parsedData.paging;
//     });
//     // while (nextPage !== undefined && imgURL == 0) {
//     //     ajax(`${productListURL}/all?paging=${nextPage}`, (parsedData) => {
//     //         for (let i in parsedData.data) {
//     //             if (parsedData.data[i].id == imgID) { imgURL = parsedData.data[i].main_image; }
//     //         }
//     //         nextPage = parsedData.paging;
//     //     });
//     // }
//     return imgURL;
// }

document.querySelector(`.text-3x1x2`).innerText = `購物車 (${orderJSON.list.length})`;

for (let i in orderJSON.list) {

    createAppendDiv("item-3x2", "div", `cart-product-${Number(i) + 2} cart-product`);
    createAppendDiv(`cart-product-${Number(i) + 2}`, "div", "row-or-column-1");
    createAppendDiv(`cart-product-${Number(i) + 2}`, "div", "row-or-column-2");

    createAppendDiv(`cart-product-${Number(i) + 2} .row-or-column-1`, "div", `cart-product-1x1`);
    createAppendImg(`cart-product-${Number(i) + 2} .row-or-column-1 .cart-product-1x1`, orderJSON.list[`${i}`].imgSrc);
    document.querySelector(`.cart-product-${Number(i) + 2} .row-or-column-1 .cart-product-1x1 img`).setAttribute("class", "img-product");

    let detailText = `${orderJSON.list[i].name} <br><br> 
    ${orderJSON.list[i].id}<br><br> 
    顏色 | ${orderJSON.list[i].color.name}<br> 
    尺寸 | ${orderJSON.list[i].size}`;

    orderJSON.list[`${i}`].name;
    createAppendDiv(`cart-product-${Number(i) + 2} .row-or-column-1`, "div", `cart-product-1x2`);
    createAppendText(`cart-product-${Number(i) + 2} .row-or-column-1 .cart-product-1x2`, "p", detailText);
    document.querySelector(`.cart-product-${Number(i) + 2} .row-or-column-1 .cart-product-1x2 p`).setAttribute("class", "text-product");

    createAppendDiv(`cart-product-${Number(i) + 2} .row-or-column-2`, "div", `cart-product-1x3`);
    createAppendText(`cart-product-${Number(i) + 2} .row-or-column-2 .cart-product-1x3`, "p", "數量");
    createAppendDiv(`cart-product-${Number(i) + 2} .row-or-column-2 .cart-product-1x3`, "select", `qty-${Number(i) + 2} qty-product`);
    createAppendOption(`qty-${Number(i) + 2}`, orderJSON.list[`${i}`].stock, orderJSON.list[`${i}`].qty);

    createAppendDiv(`cart-product-${Number(i) + 2} .row-or-column-2`, "div", `cart-product-1x4`);
    createAppendText(`cart-product-${Number(i) + 2} .row-or-column-2 .cart-product-1x4`, "p", "單價");
    createAppendDiv(`cart-product-${Number(i) + 2} .row-or-column-2 .cart-product-1x4`, "div", `price-${Number(i) + 2} price-product`);
    document.querySelector(`.price-${Number(i) + 2}`).innerText = `NT. ${orderJSON.list[i].price}`;

    createAppendDiv(`cart-product-${Number(i) + 2} .row-or-column-2`, "div", `cart-product-1x5`);
    createAppendText(`cart-product-${Number(i) + 2} .row-or-column-2 .cart-product-1x5`, "p", "小計");
    createAppendDiv(`cart-product-${Number(i) + 2} .row-or-column-2 .cart-product-1x5`, "div", `pxq-${Number(i) + 2} pxq-product`);
    let chosenQty = document.querySelector(`.qty-${Number(i) + 2} option:checked`).value;
    document.querySelector(`.pxq-${Number(i) + 2}`).innerText = `NT. ${orderJSON.list[i].price * chosenQty}`;

    createAppendDiv(`cart-product-${Number(i) + 2}`, "div", `cart-product-1x6`);
    createAppendImg(`cart-product-${Number(i) + 2} .cart-product-1x6`, "./image/cart-remove.png");
    document.querySelector(`.cart-product-${Number(i) + 2} .cart-product-1x6 img`).setAttribute("class", `trash-can-${Number(i) + 2} trash-can-product`);
}


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
        for (let j = 0 ; j < orderJSON.list.length ; j++) {
            if (orderJSON.list[j].id == ID && orderJSON.list[j].color.name == color && orderJSON.list[j].size == size){
                orderJSON.list[j].qty = Number(e.target.value);
                // 設定瀏覽器 local storage
                localStorage.setItem('orderJSONinLocal', JSON.stringify(orderJSON));
            }
        }

    });
}