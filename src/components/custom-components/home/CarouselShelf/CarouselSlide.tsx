import type { CarouselfProps } from './CarouselShelf'

interface CarouselSlideProps extends MoveCarouselProps {
  e: React.TouchEvent<HTMLDivElement>
  type: string
  card: CarouselfProps
  children: number
}

interface MoveCarouselProps {
  moveCarousel: boolean
  moveStart: number
  carouselPosition: number
  movePosition: number
}

interface MoveProps {
  carousel: MoveCarouselProps
  getPosition: number
  screen: number
  maxMove: number
}

const MoveCarousel = ({
  carousel,
  getPosition,
  screen,
  maxMove,
}: MoveProps) => {
  const { moveCarousel, carouselPosition, moveStart, movePosition } = carousel

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

  return { moveCarousel, carouselPosition: move, moveStart, movePosition }
}

const CarouselSlide = ({
  e,
  type,
  card,
  children,
  moveCarousel,
  moveStart,
  carouselPosition,
  movePosition,
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

  const carousel = { moveCarousel, carouselPosition, moveStart, movePosition }

  switch (type) {
    case 'move':
      return MoveCarousel({ carousel, getPosition, screen, maxMove })

    case 'start': {
      const startPosition = getPosition > screen ? screen : getPosition
      const moveS = getPosition < 0 ? 0 : startPosition

      return {
        moveCarousel: true,
        carouselPosition,
        moveStart: moveS,
        movePosition,
      }
    }

    case 'end': {
      if (carouselPosition > 0 || Math.abs(carouselPosition) >= maxMove) {
        const move = carouselPosition > 0 ? 0 : -maxMove

        return {
          moveCarousel,
          carouselPosition: move,
          moveStart,
          movePosition: move,
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

    default:
      return { moveCarousel, carouselPosition, moveStart, movePosition }
  }
}

export default CarouselSlide
