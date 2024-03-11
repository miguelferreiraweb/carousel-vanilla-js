const IMAGE_DEFAULT_SIZE = 15; // ex: width: 15vw
const IMAGE_MARGIN_DEFAULT = 2; // ex: margin: 0 2vw
const ITEMS_PER_PAGE = 4;
const UNIT_DEFAULT = 'vw';
const SWIPE_MIN_DISTANCE_X = 20;
const LOAD_IMAGES_FROM_URL = false;
const INCLUDE_MARGINS_IN_OFFSET = true;
const PAGE_OFFSET = INCLUDE_MARGINS_IN_OFFSET ?
  (IMAGE_DEFAULT_SIZE * ITEMS_PER_PAGE) + ((IMAGE_MARGIN_DEFAULT * 2 ) * ITEMS_PER_PAGE) :
  (IMAGE_DEFAULT_SIZE * ITEMS_PER_PAGE);
