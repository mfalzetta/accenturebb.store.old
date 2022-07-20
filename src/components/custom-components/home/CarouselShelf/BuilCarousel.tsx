const buildCarouselShelfs = (
  itemPerPage: number,
  arrows: boolean,
  items: number
) => {
  const parent = document.querySelector('ul[data-fs-product-shelf-items]')
  const widthP = parent ? parent.clientWidth : 0
  const width = arrows && widthP > 920 ? widthP - 64 : widthP
  let itemsW = width / itemPerPage

  if (widthP < 920) {
    itemsW = (width - 64) / itemPerPage
    let margin = itemsW - 144

    while (margin <= 0 && itemPerPage > 1) {
      itemPerPage -= 1
      itemsW = (width - 64) / itemPerPage
      margin = widthP > 920 ? itemsW - 194 : itemsW - 144
    }
  }

  const cardWidth = itemsW
  const maxWidth = width
  const dots = Math.ceil(items / itemPerPage)

  return { cardWidth, itemPerPage, maxWidth, dots }
}

export default buildCarouselShelfs
