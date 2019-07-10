function ajax(src){
    let obj = {};
    var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status == 200) {
            obj = JSON.parse(xhttp.responseText);
        }
      };
      xhr.open('GET', src);
      xhr.send();
      return obj;
  }
  const abc = ajax("https://api.appworks-school.tw/api/1.0/marketing/hots");