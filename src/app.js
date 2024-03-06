const IMAGE_DEFAULT_VW = 20;
const ITEMS_PER_PAGE = 3;
const PAGE_OFFSET = IMAGE_DEFAULT_VW * ITEMS_PER_PAGE;
const TOTAL_PAGES = 3;

// State Variables
let carouselItems = [];
let selectedImgIndex = null;
let pageIndex = 0;
let xValue = 0;

// DOM Elements
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');
const imagesListDiv = document.getElementById('images-list-content');

const render = async () => {
  await getCarouselItems();
  renderCarouselImagesList();
}

// Runs when the DOM is fully loaded (similar to useEffect or componentDidMount in React).
document.addEventListener('DOMContentLoaded',() => {
  leftButton.addEventListener('click',()=> reRender(render, handleLeftButtonClick));
  rightButton.addEventListener('click', ()=> reRender(render, handleRightButtonClick));
});

const getCarouselItems = async () => {
  try{
    if(!carouselItems.length){
      const response = await fetch('./resources/carouselItems.json');
      carouselItems = (await response.json())?.items ?? [];
    }
  } catch {
    console.log('Error attempting to get file: carouselItems.json');
  }
};

const updateSliderState = (updatedXValue, updatedPageIndex) => {
  xValue = updatedXValue;
  pageIndex = updatedPageIndex;
  imagesListDiv.style.transform = `translateX(${xValue}vw)`;
}

const handleImageClick = (updatedSelectedImgIndex) => {
  selectedImgIndex = updatedSelectedImgIndex;
}

const handleLeftButtonClick = () => {
  if(pageIndex !== 0){
    updateSliderState(-((pageIndex-1) * PAGE_OFFSET), pageIndex - 1);
  }
}

const handleRightButtonClick = () => {
  if(pageIndex !== TOTAL_PAGES ){
    updateSliderState(-((pageIndex+1) * PAGE_OFFSET), pageIndex + 1);
  }
}

const renderCarouselImagesList = () => {
  // important step for cases when we wish to re-render the list.
  // (ex: calls the render method without duplicating the list on handleImageClick)
  imagesListDiv.innerHTML = '';

  carouselItems.forEach((item, index) => {
    imagesListDiv.appendChild(
      Object.assign(document.createElement('img'),
      {
        src: `./resources/images/${item.file}.jpg`,
        alt: `${item.name} Image`,
        className: index === selectedImgIndex ? 'img--selected' : '',
        onclick: () => reRender(render, ()=> handleImageClick(index))
      }),
  )});
}

// IIFE added to avoid error "await is only valid at the top level bodies of modules"
(async () => {
  await render();
})();
