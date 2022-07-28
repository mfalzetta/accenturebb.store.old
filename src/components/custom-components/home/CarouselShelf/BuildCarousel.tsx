interface BuildProps {
  widthP: number
  itemsW: number
  width: number
  itemPerPage: number
}

const buildSmall = ({ widthP, itemsW, width, itemPerPage }: BuildProps) => {
  const screen = window.innerWidth

  if (screen < 920) {
    itemsW = (width - 64) / itemPerPage
    let margin = itemsW - 144

    while (margin <= 0 && itemPerPage > 1) {
      itemPerPage -= 1
      itemsW = (width - 64) / itemPerPage
      margin = itemsW - 144 > 0 ? itemsW - 144 : 0
    }
  } else if (itemsW > widthP || itemsW < 194) {
    itemsW = width / itemPerPage
    let margin = itemsW - 194

    while (margin <= 0 && itemPerPage > 1) {
      itemPerPage -= 1
      itemsW = width / itemPerPage
      margin = itemsW - 194
    }
  }

  itemPerPage = Math.floor(width / itemsW) > 0 ? Math.floor(width / itemsW) : 1

  return { itemsW, width, itemPerPage }
}

const buildBig = ({ widthP, itemsW, width, itemPerPage }: BuildProps) => {
  if (widthP < 760) {
    itemsW = width - 120
    if (itemsW > 576) {
      while (itemsW > 576) {
        width -= 20
        itemsW = width - 120
      }
    }

    itemPerPage = 1
  } else {
    itemsW = (width - 64) / 2
    itemPerPage = 2
    if (itemsW > 425) {
      while (itemsW > 425) {
        width -= 10
        itemsW = width - 120
      }
    }
  }

  width = widthP > 920 ? widthP - 64 : widthP
  itemPerPage = Math.floor(width / itemsW) > 0 ? Math.floor(width / itemsW) : 1

  if (itemsW < 250) {
    width = widthP
    itemsW = width - 30
  }

  return { itemsW, width, itemPerPage }
}

const autoSmall = ({ widthP, itemsW, width, itemPerPage }: BuildProps) => {
  const screen = window.innerWidth

  if (widthP > 400) {
    while (itemsW > 280) {
      itemPerPage += 1
      itemsW = screen < 920 ? (width - 64) / itemPerPage : width / itemPerPage
    }
  } else if (itemsW > 144) {
    while (itemsW > widthP * 0.8 && itemsW > 144) {
      itemPerPage += 1
      itemsW = widthP < 920 ? (width - 64) / itemPerPage : width / itemPerPage
    }
  }

  return { itemsW, width, itemPerPage }
}

const autoBig = ({ widthP, itemsW, width, itemPerPage }: BuildProps) => {
  if (widthP > 600) {
    while (itemsW > 420) {
      itemPerPage += 1
      itemsW = (width - 120) / itemPerPage
    }
  } else {
    while (itemsW > widthP) {
      itemPerPage += 1
      itemsW = (width - 120) / itemPerPage
    }
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
  } else {
    const build = buildBig({ widthP, itemsW, width, itemPerPage })

    itemsW = build.itemsW
    width = build.width
    itemPerPage = build.itemPerPage
  }

  if (itemsW > width * 0.5) {
    if (size === 'small') {
      const smallAuto = autoSmall({ widthP, itemsW, width, itemPerPage })

      itemsW = smallAuto.itemsW
      width = smallAuto.width
      itemPerPage = smallAuto.itemPerPage
    } else {
      const buildAuto = autoBig({ widthP, itemsW, width, itemPerPage })

      itemsW = buildAuto.itemsW
      width = buildAuto.width
      itemPerPage = buildAuto.itemPerPage
    }
  }

  const cardWidth = itemsW
  const maxWidth = width
  const dots = Math.ceil(items / itemPerPage)

  return { cardWidth, itemPerPage, maxWidth, dots }
}

export default BuildCarousel
