const hostName = "api.appworks-school.tw";
const ApiVersion = "1.0";
const productListURL = `https://${hostName}/api/${ApiVersion}/products`;
let productId = 201807242228;

ajax(`${productListURL}/details?id=${productId}`, setDetail);

function setDetail(parsedData) {
  console.log(parsedData);
  console.log(parsedData.data.colors[0].code);
  if (parsedData.data) {

      // 加入產品圖片
      //const img = document.getElementsByClassName(`img-4x${i + 1}`)[0];
      //img.src = parsedData.data[i].main_image;

      // 加入產品顏色，兩步驟 1.先移除產品顏色、尺寸 2.再新增顏色、尺寸
      // 1. 先移除產品顏色、尺寸
      const colorClassName = `color-3x2`;
      const noColorUl = document.getElementsByClassName(colorClassName)[0];
      const colorLi = document.querySelectorAll(`.${colorClassName} li`);
      colorLi.forEach((element) => { noColorUl.removeChild(element); });

      const sizeClassName = `size-3x2`;
      const noSizeUl = document.getElementsByClassName(sizeClassName)[0];
      const sizeLi = document.querySelectorAll(`.${sizeClassName} li`);
      sizeLi.forEach((element) => { noSizeUl.removeChild(element); });
      // 2.再新增所有產品顏色、尺寸
      for (let i = 0; i < parsedData.data.colors.length; i++) {
        const colorCode = parsedData.data.colors[i].code;
        createSize(colorClassName, colorCode);
      }
      for (let i = 0; i < parsedData.data.colors.length; i++) {
        const sizeCode = parsedData.data.sizes[i];
        createSize(sizeClassName, sizeCode);
      }

      // 加入產品文字及價錢
      // const text = document.getElementsByClassName(`text-4x${i + 1}`)[0]
      // text.innerHTML = `${parsedData.data[i].title}`;
      // text.appendChild(document.createElement("br"));
      // text.innerHTML += `TWD. ${parsedData.data[i].price}`;
    }

}


function createSize(sizeClassName, sizeNumber) {
  const ul = document.getElementsByClassName(`${sizeClassName}`)[0];
  const li = document.createElement('li');
  li.innerText = `${sizeNumber} `;
  ul.appendChild(li);
}