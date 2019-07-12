
const hostName = "api.appworks-school.tw";
const ApiVersion = "1.0";
const productListURL = `https://${hostName}/api/${ApiVersion}/products`;

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

function setProduct(parsedData) {
  console.log(parsedData);
  console.log(parsedData.data[0].colors[0].code);
  for (let i = 0; i < parsedData.data.length; i++) {
    // 加入產品圖片
    const img = document.getElementsByClassName(`img-4x${i + 1}`)[0];
    img.src = parsedData.data[i].main_image;
    // 加入產品顏色
    const colorClassName = `color-4x${i + 1}`;
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
}

function getWomenProduct() {
  ajax(`${productListURL}/women`, setProduct);
}





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

function createColor(colorClassName, colorNumber) {
  const ul = document.getElementsByClassName(`${colorClassName}`)[0];
  const li = document.createElement('li');
  li.style.backgroundColor = `#${colorNumber}`;
  ul.appendChild(li);
}

function createNewIcon(colorNumber) {
  const ul = document.getElementsByClassName('color-product')[0];
  const li = document.createElement('li');
  li.style.backgroundColor = colorNumber;
  ul.appendChild(li);
}



const resetCursor = (event) => {  
  event.target.style.cursor = "default";
};

const womenNavBar = document.getElementsByClassName('color-product')[0];
mainTitle.addEventListener('click', (event) => {
  mainTitle.textContent = 'Have a good time!';
  resetCursor(event);
});
getWomenProduct();