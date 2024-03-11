// State Variables
let carouselItems = null;
let totalPages = null;
let selectedImgIndex = null;
let sliderPageIndex = 0;
let containerXvalue = 0;
let swipeStartX = 0;
let swipeEndX = 0;

// DOM Elements
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');
const imagesListDiv = document.getElementById('images-list-content');
const selectedImgTitle = document.getElementById('selected-img-title');
const pagesListContainer = document.getElementById('pages-list-container');

// Sets the configurable styles for container and slider images.
const applySliderConfigurableStyles = () =>{
  const imageListContainerDiv = document.querySelector('.image-list-container');
  const sliderImages = document.querySelectorAll('.slider-img');

  imageListContainerDiv.style.width = `${PAGE_OFFSET}${UNIT_DEFAULT}`;
  sliderImages.forEach((imgElement) => {
    imgElement.style.width = `${IMAGE_DEFAULT_SIZE}${UNIT_DEFAULT}`;
    imgElement.style.height = `${IMAGE_DEFAULT_SIZE}${UNIT_DEFAULT}`;
    if(INCLUDE_MARGINS_IN_OFFSET){
      imgElement.style.margin = `0 ${IMAGE_MARGIN_DEFAULT}${UNIT_DEFAULT}`;
    }

  });
}

const render = () => {
  calculateTotalPagesAndCarouselItems();
  renderCarouselImagesList();
  renderPagesCircleList();
  updateDirectionButtonsState();
}

// A simple wrapper function to render and avoid having multiple functions calling
// the same render method. Takes the callbackFn to be executed before and N
// arguments of the callbackFn.
const reRender = (callback, ...args) => {
  callback(...args);
  render();
}

// Calculates the total pages and carousel items based on ITEMS_PER_PAGE value.
// The carouselItems result is based on if the length of carouselImages.items is
// (or not) a multiple of ITEMS_PER_PAGE.
const calculateTotalPagesAndCarouselItems = () => {
  if(!totalPages && !carouselItems){
    carouselItems = carouselImages.items.length % ITEMS_PER_PAGE === 0 ?
      carouselImages.items : carouselImages.items.slice(0, -1);
    totalPages = Math.floor(carouselItems.length / ITEMS_PER_PAGE);
  }
}

// Runs when the DOM is fully loaded (similar to useEffect or componentDidMount in React).
document.addEventListener('DOMContentLoaded',() => {
  leftButton.addEventListener('click',()=> reRender(handleLeftButtonClick));
  rightButton.addEventListener('click', ()=> reRender(handleRightButtonClick));

  // Swipe events (Desktop and Mobile)
  imagesListDiv.addEventListener('mousedown', handleSwipeStart);
  imagesListDiv.addEventListener('touchstart', handleSwipeStart);
  imagesListDiv.addEventListener('mouseup', handleSwipeEnd);
  imagesListDiv.addEventListener('touchend', handleSwipeEnd);

  document.addEventListener('keydown', (e)=> {
    if (e.key === 'ArrowLeft') {
      reRender(handleLeftButtonClick);
    }

    if(e.key === 'ArrowRight'){
      reRender(handleRightButtonClick);
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

const handleSwipe = () =>  {
  const currentSwipeDistanceX = swipeEndX - swipeStartX;

  if (currentSwipeDistanceX > SWIPE_MIN_DISTANCE_X) {
    reRender(handleLeftButtonClick);
  }

  if (currentSwipeDistanceX < -SWIPE_MIN_DISTANCE_X) {
    reRender(handleRightButtonClick);
  }

  swipeStartX = 0;
  swipeEndX = 0;
}

const updateSliderState = (updatedContainerXvalue, updatedSliderPageIndex) => {
  containerXvalue = updatedContainerXvalue;
  sliderPageIndex = updatedSliderPageIndex;
  imagesListDiv.style.transform = `translateX(${containerXvalue}${UNIT_DEFAULT})`;
  selectedImgTitle.innerHTML = '';
  selectedImgIndex = null;
}

const updateDirectionButtonsState = () => {
  // toggle js function -> adds or removes class based on provided condition.
  leftButton.classList.toggle('disabled-button', sliderPageIndex === 0);
  rightButton.classList.toggle('disabled-button', sliderPageIndex === totalPages - 1);
}

const handleImageClick = (updatedSelectedImgIndex) => {
  selectedImgIndex = updatedSelectedImgIndex;
  selectedImgTitle.innerHTML = carouselItems[selectedImgIndex].name ?? '';
}

const handleLeftButtonClick = () => {
  if(sliderPageIndex !== 0){
    updateSliderState(-((sliderPageIndex-1) * PAGE_OFFSET), sliderPageIndex - 1);
  }
}

const handleRightButtonClick = () => {
  if(sliderPageIndex !== totalPages - 1){
    updateSliderState(-((sliderPageIndex+1) * PAGE_OFFSET), sliderPageIndex + 1);
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
        src: !LOAD_IMAGES_FROM_URL ? `./resources/images/${item.file}.jpg` : item.url,
        alt: `${item.name} Image`,
        className: index === selectedImgIndex ? 'slider-img selected-img' : 'slider-img',
        onclick: () => reRender(()=> handleImageClick(index))
      })
  )});

  applySliderConfigurableStyles();
}

const renderPagesCircleList = () => {
  pagesListContainer.innerHTML = '';

  for (let i = 0; i <= totalPages - 1; i++) {
    pagesListContainer.appendChild(
      Object.assign(document.createElement('button'),
      {
        className: sliderPageIndex === i ? 'circle selected-circle' : 'circle',
        onclick: () => reRender(()=> updateSliderState(-((i) * PAGE_OFFSET), i))
      })
    )
  }
}

render();
