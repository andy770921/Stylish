

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

ajax("https://api.appworks-school.tw/api/1.0/marketing/hots", setJSONObject);

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
  createColor(`#${parsedData.data[0].products[0].colors[0].code}`);
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

  document.getElementsByClassName('text-product')[6].innerHTML = `${parsedData.data[0].products[0].title}`;
  document.getElementsByClassName('text-product')[6].appendChild(document.createElement("br")); 
  document.getElementsByClassName('text-product')[6].innerHTML += `TWD.${parsedData.data[0].products[0].price}`;
}

function createImg(url) {
  const body = document.getElementsByTagName('body')[0];
  const img = document.createElement('img');
  img.src = url;
  body.appendChild(img);
}

function createColor(colorNumber) {
  const ul = document.getElementsByClassName('color-product')[0];
  const li = document.createElement('li');
  li.style.backgroundColor = colorNumber;
  ul.appendChild(li);
}