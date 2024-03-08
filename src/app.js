const IMAGE_DEFAULT_SIZE = 20; // ex: width: 20vw
const IMAGE_MARGIN_DEFAULT = 2; // ex: margin: 0 2vw
const ITEMS_PER_PAGE = 3;
const UNIT_DEFAULT = 'vw';
const PAGE_OFFSET = (IMAGE_DEFAULT_SIZE * ITEMS_PER_PAGE) + ((IMAGE_MARGIN_DEFAULT * 2 ) * ITEMS_PER_PAGE); // total = 72vw
const TOTAL_PAGES = 4;
const SWIPE_DISTANCE_X_DEFAULT = 20;

// State Variables
let carouselItems = [];
let selectedImgIndex = null;
let pageIndex = 0;
let xValue = 0;
let swipeStartX = 0;
let swipeEndX = 0;

// DOM Elements
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');
const imagesListDiv = document.getElementById('images-list-content');
const selectedImgDiv = document.getElementById('selected-img');
const pagesListContainer = document.getElementById('pages-list-container');

// Sets the configurable styles for container and slider images.
const applySliderConfigurableStyles = () =>{
  const imageListContainerDiv = document.querySelector('.image-list-container');
  const sliderImages = document.querySelectorAll('.slider-img');

  imageListContainerDiv.style.width = `${PAGE_OFFSET}${UNIT_DEFAULT}`;
  sliderImages.forEach((imgElement) => {
    imgElement.style.width = `${IMAGE_DEFAULT_SIZE}${UNIT_DEFAULT}`;
    imgElement.style.height = `${IMAGE_DEFAULT_SIZE}${UNIT_DEFAULT}`;
    imgElement.style.margin = `0 ${IMAGE_MARGIN_DEFAULT}${UNIT_DEFAULT}`;
  });
}

const render = async () => {
  await getCarouselItems();
  renderCarouselImagesList();
  renderPagesCircleList();
  updateDirectionButtonsState();
}

// Runs when the DOM is fully loaded (similar to useEffect or componentDidMount in React).
document.addEventListener('DOMContentLoaded',() => {
  leftButton.addEventListener('click',()=> reRender(render, handleLeftButtonClick));
  rightButton.addEventListener('click', ()=> reRender(render, handleRightButtonClick));

  // Swipe events (Desktop and Mobile)
  imagesListDiv.addEventListener('mousedown', handleSwipeStart);
  imagesListDiv.addEventListener('touchstart', handleSwipeStart);
  imagesListDiv.addEventListener('mouseup', handleSwipeEnd);
  imagesListDiv.addEventListener('touchend', handleSwipeEnd);

  document.addEventListener('keydown', (e)=> {
    if (e.key === 'ArrowLeft') {
      reRender(render, handleLeftButtonClick);
    }

    if(e.key === 'ArrowRight'){
      reRender(render, handleRightButtonClick);
    }
  });
});

const handleSwipeStart = (e) => {
  if (e.type === 'mousedown') {
    swipeStartX = e.clientX;
  } else if (e.type === 'touchstart') {
    swipeStartX = e.changedTouches[0].clientX;
  }
}

const handleSwipeEnd = (e) =>  {
  if (e.type === 'mouseup') {
    swipeEndX = e.clientX;
  } else if (e.type === 'touchend') {
    swipeEndX = e.changedTouches[0].clientX;
  }

  handleSwipe();
}

function handleSwipe() {
  const currentSwipeDistanceX = swipeEndX - swipeStartX;

  if (currentSwipeDistanceX > SWIPE_DISTANCE_X_DEFAULT) {
    reRender(render, handleLeftButtonClick);
  }

  if (currentSwipeDistanceX < -SWIPE_DISTANCE_X_DEFAULT) {
    reRender(render, handleRightButtonClick);
  }

  swipeStartX = 0;
  swipeEndX = 0;
}

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
  imagesListDiv.style.transform = `translateX(${xValue}${UNIT_DEFAULT})`;
  selectedImgDiv.innerHTML = '';
  selectedImgIndex = null;
}

const updateDirectionButtonsState = () => {
  // toggle js function -> adds or removes class based on provided condition.
  leftButton.classList.toggle('disabled-button', pageIndex === 0);
  rightButton.classList.toggle('disabled-button', pageIndex === TOTAL_PAGES - 1);
}

const handleImageClick = (updatedSelectedImgIndex) => {
  selectedImgIndex = updatedSelectedImgIndex;
  selectedImgDiv.innerHTML = carouselItems[selectedImgIndex].name ?? '';
}

const handleLeftButtonClick = () => {
  if(pageIndex !== 0){
    updateSliderState(-((pageIndex-1) * PAGE_OFFSET), pageIndex - 1);
  }
}

const handleRightButtonClick = () => {
  if(pageIndex !== TOTAL_PAGES - 1){
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
        className: index === selectedImgIndex ? 'slider-img selected-img' : 'slider-img',
        onclick: () => reRender(render, ()=> handleImageClick(index))
      })
  )});

  applySliderConfigurableStyles();
}

const renderPagesCircleList = () => {
  pagesListContainer.innerHTML = '';

  for (let i = 0; i <= TOTAL_PAGES - 1; i++) {
    pagesListContainer.appendChild(
      Object.assign(document.createElement('button'),
      {
        className: pageIndex === i ? 'circle selected-circle' : 'circle',
        onclick: () => reRender(render, ()=> updateSliderState(-((i) * PAGE_OFFSET), i))
      })
    )
  }
}

// IIFE added to avoid error "await is only valid at the top level bodies of modules"
(async () => {
  await render();
})();
