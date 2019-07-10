
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

ajax("https://api.appworks-school.tw/api/1.0/marketing/hots", getJSONObject);

function getJSONObject(parsedData) {
  //console.log(parsedData.data[0].products[0].images[0]);
  a = parsedData.data[0].products[0].images[0];
  createImg(a);
}

function createImg(url) {
  const body = document.getElementsByTagName('body')[0];
  const img = document.createElement('img');
  img.src = url;
  body.appendChild(img);
}