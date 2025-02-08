
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
button.addEventListener("click", zoomIn); // attach zoomIn to button click

const highlightBar = document.querySelector(".highlight-bar");
highlightBar.addEventListener("click", appear(event)); 

function appear(event){
  console.log('mouse coordinates:', event.clientX, event.clientY);
}
