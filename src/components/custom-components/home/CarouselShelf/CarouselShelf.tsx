import { useEffect, useState } from 'react'

import BtnCarouselShelf from './BtnCarouselShelf'
import BuildCarousel from './BuildCarousel'
import './CarouselShelf.scss'

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  react-hooks/exhaustive-deps */
/* eslint-disable  vtex/prefer-early-return */

export interface CarouselShelfProps {
  children: any
  itemsPerPage?: number
  arrows?: boolean
  size?: string
}

export interface CarouselfProps {
  cardWidth: number
  itemPerPage: number
  maxWidth: number
  dots: number
}

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

const CarouselShelf = ({
  children,
  itemsPerPage = 1,
  arrows = false,
  size = 'small',
}: CarouselShelfProps) => {
  const [card, setCard] = useState<CarouselfProps>()
  const [carouselIndex, setCarouselIndex] = useState(1)
  const [carouselPosition, setCarouselPosition] = useState(0)
  const [moveCarousel, setMoveCarousel] = useState(false)
  const [movePosition, setMovePosition] = useState(0)
  const [moveStart, setMoveStart] = useState(0)

  const build = () => {
    setCarouselIndex(1)
    setMovePosition(0)
    setCarouselPosition(0)
    setCard(BuildCarousel(itemsPerPage, arrows, children.length, size))
  }

  useEffect(() => {
    if (children) {
      build()
      window.addEventListener('resize', build)
    }
  }, [children, itemsPerPage, arrows])

  if (!card?.itemPerPage) {
    return <></>
  }

  const moveCarouselCard = (
    e: React.TouchEvent<HTMLDivElement>,
    type: string
  ) => {
    const carouselMove = CarouselSlide({
      e,
      type,
      card,
      children: children.length,
      moveCarousel,
      moveStart,
      carouselPosition,
      movePosition,
    })

    setMoveCarousel(carouselMove.moveCarousel)
    setCarouselPosition(carouselMove.carouselPosition)
    setMovePosition(carouselMove.movePosition)
    setMoveStart(carouselMove.moveStart)
  }

  const moveDot = (index: number) => {
    setCarouselIndex(index)
    if (card) {
      const itemW = card.cardWidth
      let position = (index - 1) * itemW * card.itemPerPage

      if (index === card.dots) {
        const itemsWidth = itemW * card.itemPerPage
        const last = card.maxWidth - itemsWidth

        if (last > 0) {
          const maxSlide = card.cardWidth * children.length - itemsWidth

          position = maxSlide - last
        }
      }

      setCarouselPosition(-position)
    }
  }

  const nextSlide = () => {
    if (carouselIndex < card.dots) {
      moveDot(carouselIndex + 1)
    } else {
      moveDot(1)
    }
  }

  const prevSlide = () => {
    if (carouselIndex > 1) {
      moveDot(carouselIndex - 1)
    } else {
      moveDot(card.dots)
    }
  }

  return (
    <div className="carouselShelf">
      {arrows && (
        <>
          <BtnCarouselShelf moveSlide={prevSlide} direction="prev" />
        </>
      )}
      <div
        className="carouselShelf--list"
        style={{ minWidth: `${card?.maxWidth}px` }}
      >
        <div
          className={
            size === 'small'
              ? 'small--card carouselShelf--container'
              : 'carouselShelf--container'
          }
          draggable
          onTouchStart={(e) => moveCarouselCard(e, 'start')}
          onTouchMove={(e) => moveCarouselCard(e, 'move')}
          onTouchEnd={(e) => moveCarouselCard(e, 'end')}
          style={{
            transform: `translateX(${carouselPosition}px)`,
            minWidth: 'fit-content',
          }}
        >
          {children.map((product: any, index: number) => (
            <div
              key={index}
              className="carousel--item"
              style={{ minWidth: `${card?.cardWidth}px` }}
            >
              {product}
            </div>
          ))}
        </div>
      </div>
      {arrows && (
        <>
          <BtnCarouselShelf moveSlide={nextSlide} direction="next" />
        </>
      )}
      <div className="container-dots">
        {Array.from({ length: card.dots }).map((_, index: number) => (
          <div
            aria-hidden="true"
            key={index}
            onClick={() => moveDot(index + 1)}
            className={carouselIndex === index + 1 ? 'dot active' : 'dot'}
          />
        ))}
      </div>
    </div>
  )
}

export default CarouselShelf
