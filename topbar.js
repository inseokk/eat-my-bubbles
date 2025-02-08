const button = document.querySelector(".button");
function zoomIn(){
  scale += 0.2;
  renderPage(pageNum);
}
function zoomOut(){
  if (scale > 0.4){
    scale -= 0.2;
    renderPage(pageNum);
  }
}
<button onclick="changeSize()">Click</button>
