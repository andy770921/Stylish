

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
  document.getElementsByClassName('img-4x2')[0].src = parsedData.data[0].products[0].images[1];
  //設定產品名稱
  document.getElementsByClassName('text-4x1')[0].innerHTML = `${parsedData.data[0].title}`;
}

function createImg(url) {
  const body = document.getElementsByTagName('body')[0];
  const img = document.createElement('img');
  img.src = url;
  body.appendChild(img);
}