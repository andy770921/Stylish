const navBarWords = ['女裝','男裝','配件'];

for (let i = 0; i < navBarWords.length; i++) {
    document.getElementsByClassName(`barItem-${i+1}`)[0].textContent = navBarWords[i];
}

const imgTextContent = {
    poet1: ['於是', '我也想要給你', '一個那麼美好的自己。', '不朽《與自己和好如初》'], 
    poet2: ['A', 'B', 'A', 'B']
};
for (let i = 0; i < imgTextContent.poet1.length; i++) {
    if (i<imgTextContent.poet1.length-1){
    let p = document.getElementsByClassName('imgWords-1')[0]
    p.innerHTML += `${imgTextContent.poet1[i]}`;
    p.appendChild(document.createElement("br")); 
    } else {
    let pp = document.getElementsByClassName('imgWords-2')[0]
    pp.appendChild(document.createElement("br")); 
    pp.innerHTML += `${imgTextContent.poet1[i]}`;
    }
}