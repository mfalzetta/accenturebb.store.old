import { useEffect, useState } from 'react'

import BtnCarouselShelf from './BtnCarouselShelf'
import BuildCarousel from './BuildCarousel'
import './CarouselShelf.scss'
import CarouselSlide from './CarouselSlide'

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
