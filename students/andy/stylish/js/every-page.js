
const navBarWords = ['女裝','男裝','配件'];

for (let i = 0; i < navBarWords.length; i++) {
    document.getElementsByClassName(`barItem-${i+1}`)[0].textContent = navBarWords[i];
    document.getElementsByClassName(`barItem-${i+1}`)[1].textContent = navBarWords[i];
}

// ---- Hover換圖網址函數 -----

function hover(element, url) {
    element.setAttribute('src', url);
  }
  
  function unhover(element, url) {
    element.setAttribute('src', url);
  }


