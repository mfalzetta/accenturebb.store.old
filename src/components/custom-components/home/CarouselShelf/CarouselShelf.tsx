import { useEffect, useState } from 'react'

import './CarouselShelf.scss'
import BtnCarouselShelf from './BtnCarouselShelf'
import BuildCarousel from './BuildCarousel'

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  react-hooks/exhaustive-deps */
/* eslint-disable  vtex/prefer-early-return */
/* eslint-disable  react/self-closing-comp */

export interface CarouselShelfProps {
  children: any
  itemsPerPage?: number
  arrows?: boolean
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
}: CarouselShelfProps) => {
  const [card, setCard] = useState<CarouselfProps>()
  const [carouselIndex, setCarouselIndex] = useState(1)
  const [carouselPosition, setCarouselPosition] = useState(0)
  const [moveCarousel, setMoveCarousel] = useState(false)
  const [movePosition, setMovePosition] = useState(0)
  const [moveStart, setMoveStart] = useState(0)

  const build = () => {
    const items = children.length

    setMovePosition(0)
    setCarouselPosition(0)
    setCard(BuildCarousel(itemsPerPage, arrows, items))
  }

  useEffect(() => {
    if (children) {
      build()
      window.addEventListener('resize', () => {
        build()
      })
    }
  }, [children, itemsPerPage, arrows])

  if (!card?.itemPerPage) {
    return <></>
  }

  const carouselSlide = (e: React.TouchEvent<HTMLDivElement>, type: string) => {
    if (card) {
      const getPosition =
        type === 'end'
          ? e.nativeEvent.changedTouches[0].clientX
          : e.nativeEvent.touches[0].clientX

      const screen = document.documentElement.clientWidth
      const itemW = card.cardWidth
      const maxMove =
        itemW * (children.length - card.itemPerPage) - Math.abs(64 - itemW)

      if (type === 'move') {
        if (!moveCarousel) {
          return
        }

        const x = getPosition - moveStart

        if (getPosition < 0 || getPosition > screen) {
          setMoveCarousel(false)
        } else if (Math.abs(carouselPosition) >= maxMove && x < 0) {
          setCarouselPosition(-maxMove)
        } else {
          setCarouselPosition(
            movePosition + x > 0 || (x > 0 && carouselPosition === 0)
              ? 0
              : movePosition + x * 1.25
          )
        }
      }

      if (type === 'start') {
        setMoveCarousel(true)
        const startPosition = getPosition > screen ? screen : getPosition

        setMoveStart(getPosition < 0 ? 0 : startPosition)
      }

      if (type === 'end') {
        if (carouselPosition > 0 || Math.abs(carouselPosition) >= maxMove) {
          setMovePosition(carouselPosition > 0 ? 0 : -maxMove)
          setCarouselPosition(carouselPosition > 0 ? 0 : -maxMove)
        } else {
          const itemPP = Math.round(carouselPosition / itemW)
          const finalPosition =
            itemW * itemPP === carouselPosition
              ? carouselPosition
              : itemW * itemPP

          setMovePosition(finalPosition)
          setCarouselPosition(finalPosition)
        }
      }
    }
  }

  const moveDot = (index: number) => {
    setCarouselIndex(index)
    if (card) {
      let position = (index - 1) * card?.maxWidth

      if (index === card.dots) {
        const lastItem = children.length % card.itemPerPage

        if (lastItem > 0) {
          position = (index - 2) * card.maxWidth + lastItem * card.cardWidth
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
          className="carouselShelf--container"
          draggable
          onTouchStart={(e) => carouselSlide(e, 'start')}
          onTouchMove={(e) => carouselSlide(e, 'move')}
          onTouchEnd={(e) => carouselSlide(e, 'end')}
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
          ></div>
        ))}
      </div>
    </div>
  )
}

export default CarouselShelf
