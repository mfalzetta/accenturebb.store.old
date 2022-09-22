import type { CarouselfProps } from './CarouselShelf'

interface CarouselSlideProps {
  e: React.TouchEvent<HTMLDivElement>
  type: string
  children: number
  card: CarouselfProps
  moveCarousel: boolean
  carouselPosition: number
  movePosition: number
  moveStart: number
}

const CarouselSlide = ({
  e,
  type,
  children,
  card,
  moveCarousel,
  carouselPosition,
  movePosition,
  moveStart,
}: CarouselSlideProps) => {
  const getPosition =
    type === 'end'
      ? e.nativeEvent.changedTouches[0].clientX
      : e.nativeEvent.touches[0].clientX

  const screen = document.documentElement.clientWidth
  const itemW = card.cardWidth
  const maxMove =
    itemW * (children - card.itemPerPage) -
    (screen - 32 - itemW * card.itemPerPage)

  if (type === 'move') {
    if (!moveCarousel) {
      return { moveCarousel, carouselPosition, moveStart, movePosition }
    }

    const x = getPosition - moveStart

    if (getPosition < 0 || getPosition > screen) {
      return {
        moveCarousel: false,
        carouselPosition,
        moveStart,
        movePosition,
      }
    }

    if (Math.abs(carouselPosition) >= maxMove && x < 0) {
      return {
        moveCarousel,
        carouselPosition: -maxMove,
        moveStart,
        movePosition,
      }
    }

    const move =
      movePosition + x > 0 || (x > 0 && carouselPosition === 0)
        ? 0
        : movePosition + x * 1.25

    return {
      moveCarousel,
      carouselPosition: move,
      moveStart,
      movePosition,
    }
  }

  if (type === 'start') {
    const startPosition = getPosition > screen ? screen : getPosition
    const newMoveStart = getPosition < 0 ? 0 : startPosition

    return {
      moveCarousel: true,
      carouselPosition,
      moveStart: newMoveStart,
      movePosition,
    }
  }

  if (type === 'end') {
    if (carouselPosition > 0 || Math.abs(carouselPosition) >= maxMove) {
      const moveNewPosition = carouselPosition > 0 ? 0 : -maxMove

      return {
        moveCarousel,
        carouselPosition: moveNewPosition,
        moveStart,
        movePosition: moveNewPosition,
      }
    }

    const itemPP = Math.round(carouselPosition / itemW)
    const finalPosition =
      itemW * itemPP === carouselPosition ? carouselPosition : itemW * itemPP

    return {
      moveCarousel,
      carouselPosition: finalPosition,
      moveStart,
      movePosition: finalPosition,
    }
  }

  return { moveCarousel, carouselPosition, moveStart, movePosition }
}

export default CarouselSlide
