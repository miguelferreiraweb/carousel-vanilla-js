const isMobileView = () => window.innerWidth < 768;

const getItemsPerPage = () => isMobileView() ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP;

const getPageOffset = () => {
  const itemsPerPage = getItemsPerPage();
  return INCLUDE_MARGINS_IN_OFFSET ?
    (getImageDefaultSize() * itemsPerPage) + ((IMAGE_MARGIN_DEFAULT * 2 ) * itemsPerPage) :
    (getImageDefaultSize() * itemsPerPage);
};

const getImageDefaultSize = () => isMobileView() ? IMAGE_DEFAULT_SIZE_MOBILE : IMAGE_DEFAULT_SIZE_DESKTOP;
