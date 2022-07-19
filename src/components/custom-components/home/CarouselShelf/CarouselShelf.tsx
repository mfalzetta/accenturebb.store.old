import { useEffect, useState } from 'react'

import './CarouselShelf.scss'
import BtnCarouselShelf from './BtnCarouselShelf'
import buildCarouselShelf from './BuilCarousel'

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  react-hooks/exhaustive-deps */
/* eslint-disable  vtex/prefer-early-return */

export interface CarouselShelfProps {
  children: any
  itemsPerPage?: number
  arrows?: boolean
}

export interface CarouselfProps {
  cardWidth: number
  itemPerPage: number
  maxWidth: number
}

const CarouselShelf = ({
  children,
  itemsPerPage = 1,
  arrows = false,
}: CarouselShelfProps) => {
  const [itemsPage, setItemsPage] = useState(0)
  const [card, setCard] = useState<CarouselfProps>()
  const [carouselDots, setCarouselDots] = useState(3)
  const [carouselIndex, setCarouselIndex] = useState(1)
  const [carouselPosition, setCarouselPosition] = useState(0)
  const [moveCarousel, setMoveCarousel] = useState(false)
  const [movePosition, setMovePosition] = useState(0)
  const [moveStart, setMoveStart] = useState(0)

  useEffect(() => {
    if (children) {
      setCard(buildCarouselShelf(itemsPerPage, arrows))
      setCarouselDots(
        card?.itemPerPage
          ? Math.ceil(children.length / card.itemPerPage)
          : children.length
      )
      setItemsPage(itemsPerPage)
      window.addEventListener('resize', () => {
        setCard(buildCarouselShelf(itemsPerPage, arrows))
        setCarouselDots(
          card?.itemPerPage
            ? Math.ceil(children.length / card.itemPerPage)
            : children.length
        )
      })
    }
  }, [children, itemsPerPage, arrows])

  if (!itemsPage) {
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
      const maxMove = itemW * (children.length - 1)

      if (type === 'move') {
        if (!moveCarousel) {
          return
        }

        const x = getPosition - moveStart

        if (getPosition < 0 || getPosition > screen) {
          setMoveCarousel(false)
        } else if (carouselPosition === 0) {
          setCarouselPosition(x > 0 ? 0 : movePosition + x * 1.5)
        } else if (Math.abs(movePosition + x) > maxMove) {
          setCarouselPosition(-maxMove)
        } else {
          setCarouselPosition(movePosition + x > 0 ? 0 : movePosition + x * 1.5)
        }
      }

      if (type === 'start') {
        setMoveCarousel(true)
        setMoveStart(getPosition)
        if (getPosition < 0) {
          setMoveStart(0)
        } else if (getPosition > screen) {
          setMoveStart(screen)
        }
      }

      if (type === 'end') {
        if (carouselPosition > maxMove) {
          setMovePosition(maxMove)
          setCarouselPosition(-maxMove)
        } else if (carouselPosition > 0) {
          setMovePosition(0)
          setCarouselPosition(0)
        } else {
          const itemPP = Math.round(carouselPosition / itemW)

          if (itemW * itemPP === carouselPosition) {
            setMovePosition(carouselPosition)
          } else {
            setMovePosition(itemW * itemPP)
            setCarouselPosition(itemW * itemPP)
          }
        }
      }
    }
  }

  const moveDot = (index: number) => {
    setCarouselIndex(index)
    if (card) {
      let position = (index - 1) * card?.maxWidth

      if (index === carouselDots) {
        const lastItem = children.length % card.itemPerPage

        if (lastItem > 0) {
          position = (index - 2) * card.maxWidth + lastItem * card.cardWidth
        }
      }

      setCarouselPosition(-position)
    }
  }

  const nextSlide = () => {
    if (carouselIndex < carouselDots) {
      moveDot(carouselIndex + 1)
    } else {
      moveDot(1)
    }
  }

  const prevSlide = () => {
    if (carouselIndex > 1) {
      moveDot(carouselIndex - 1)
    } else {
      moveDot(carouselDots)
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
        {Array.from({ length: carouselDots }).map((_, index: number) => (
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
