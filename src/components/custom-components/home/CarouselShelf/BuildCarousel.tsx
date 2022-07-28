interface BuildProps {
  widthP: number
  itemsW: number
  width: number
  itemPerPage: number
}

const buildSmall = ({ widthP, itemsW, width, itemPerPage }: BuildProps) => {
  if (widthP < 920) {
    itemsW = (width - 64) / itemPerPage
    let margin = itemsW - 144

    while (margin <= 0 && itemPerPage > 1) {
      itemPerPage -= 1
      itemsW = (width - 64) / itemPerPage
      margin = itemsW - 144 > 0 ? itemsW - 144 : 0
    }
  } else if (itemsW > widthP || itemsW < 194 || itemsW) {
    itemsW = width / itemPerPage
    let margin = itemsW - 194

    while (margin <= 0 && itemPerPage > 1) {
      itemPerPage -= 1
      itemsW = width / itemPerPage
      margin = itemsW - 194
    }
  }

  return { itemsW, width, itemPerPage }
}

const buildBig = ({ widthP, itemsW, width, itemPerPage }: BuildProps) => {
  if (widthP < 760) {
    itemsW = width - 100
    if (itemsW > 576) {
      while (itemsW > 576) {
        width -= 20
        itemsW = width - 100
      }
    }

    itemPerPage = 1
  } else {
    itemsW = (width - 64) / 2
    itemPerPage = 2
    if (itemsW > 425) {
      while (itemsW > 425) {
        width -= 10
        itemsW = width - 100
      }
    }
  }

  if (itemsW < 250) {
    width = widthP
    itemsW = width - 30
  }

  return { itemsW, width, itemPerPage }
}

const BuildCarousel = (
  itemPerPage: number,
  arrows: boolean,
  items: number,
  size: string
) => {
  const screen = window.innerWidth
  const parent = document.querySelector('ul[data-fs-product-shelf-items]')
  const widthP = parent ? parent.clientWidth : 0
  let width = arrows && screen > 920 ? widthP - 64 : widthP
  let itemsW =
    size === 'small' ? width / itemPerPage : (width - 120) / itemPerPage

  if (size === 'small') {
    const small = buildSmall({ widthP, itemsW, width, itemPerPage })

    itemsW = small.itemsW
    width = small.width
    itemPerPage = small.itemPerPage
  } else if (screen < 920) {
    const build = buildBig({ widthP, itemsW, width, itemPerPage })

    itemsW = build.itemsW
    width = build.width
    itemPerPage = build.itemPerPage
  } else if (itemsW > widthP || itemsW < 368) {
    itemsW = (width - 120) / itemPerPage
    let margin = itemsW - 368

    while (margin <= 0 && itemPerPage > 1) {
      itemPerPage -= 1
      itemsW = (width - 120) / itemPerPage
      margin = itemsW - 368
    }
  }

  if (itemsW > width * 0.5) {
    if (size === 'small') {
      if (widthP > 400) {
        while (itemsW > 280) {
          itemPerPage += 1
          itemsW =
            widthP < 920 ? (width - 64) / itemPerPage : width / itemPerPage
        }
      } else if (itemsW > 144) {
        while (itemsW > widthP * 0.8 && itemsW > 144) {
          itemPerPage += 1
          itemsW =
            widthP < 920 ? (width - 64) / itemPerPage : width / itemPerPage
        }
      }
    } else if (widthP > 600) {
      while (itemsW > 420) {
        itemPerPage += 1
        itemsW =
          widthP < 920
            ? (width - 100) / itemPerPage
            : (width - 120) / itemPerPage
      }
    } else {
      while (itemsW > widthP) {
        itemPerPage += 1
        itemsW =
          widthP < 920
            ? (width - 100) / itemPerPage
            : (width - 120) / itemPerPage
      }
    }
  }

  const cardWidth = itemsW
  const maxWidth = width
  const dots = Math.ceil(items / itemPerPage)

  return { cardWidth, itemPerPage, maxWidth, dots }
}

export default BuildCarousel
