import { useEffect, useState } from 'react'

import './CarouselShelf.scss'
import BtnCarouselShelf from './BtnCarouselShelf'

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  react-hooks/exhaustive-deps */
/* eslint-disable  vtex/prefer-early-return */

export interface CarouselShelfProps {
  children: any
  itemsPerPage?: number
  arrows?: boolean
}

const CarouselShelf = ({
  children,
  itemsPerPage = 1,
  arrows,
}: CarouselShelfProps) => {
  const [itemsPage, setItemsPage] = useState(0)
  const [widthCard, setWidthCard] = useState('100%')
  const [marginCards, setMarginCards] = useState(0)
  const [carouselIndex, setCarouselIndex] = useState(1)
  const [carouselDots, setCarouselDots] = useState(1)
  const [carouselPosition, setCarouselPosition] = useState(0)
  const [moveCarousel, setMoveCarousel] = useState(false)
  const [movePosition, setMovePosition] = useState(0)
  const [moveStart, setMoveStart] = useState(0)

  const buildCarouselShelf = () => {
    setCarouselPosition(0)
    setCarouselIndex(1)
    setMovePosition(0)
    setMoveCarousel(false)
    const parentComponent = document.querySelector(
      'ul.layout__content'
    ) as HTMLElement | null

    if (document.documentElement.offsetWidth <= 920) {
      const screenWidth = document.documentElement.offsetWidth - 32
      const cards = Math.round(screenWidth / 148)
      const nextCard = (screenWidth / 148).toFixed(1).split('.')

      if ((Number(nextCard[1]) < 4 || Number(nextCard[1]) >= 5) && cards > 1) {
        const cardWidth = cards > 1 ? screenWidth / (cards - 0.6) : 148
        const margin = cards > 1 && cardWidth > 148 ? cardWidth - 148 : 0

        setMarginCards(margin)
        setCarouselDots(Math.ceil(children.length / cards) + 1)
      } else {
        setMarginCards(0)
        setCarouselDots(Math.ceil(children.length / cards))
      }

      setWidthCard('148px')
      setItemsPage(cards > 0 ? cards : 1)
    } else if (parentComponent !== null) {
      const arrowsSize = arrows ? 70 : 0
      const screenWidth = parentComponent.offsetWidth - 32 - arrowsSize
      const cardWidth =
        itemsPerPage === 1
          ? '100%'
          : `${Math.ceil(screenWidth / itemsPerPage)}px`

      setItemsPage(itemsPerPage)
      setWidthCard(cardWidth)
      setCarouselDots(Math.ceil(children.length / itemsPerPage))
      setMarginCards(0)
    }
  }

  useEffect(() => {
    if (children) {
      setItemsPage(itemsPerPage)
      buildCarouselShelf()
      window.addEventListener('resize', buildCarouselShelf)
    }
  }, [children, itemsPerPage, arrows])

  if (!itemsPage) {
    return <></>
  }

  const carouselSlide = (e: React.TouchEvent<HTMLDivElement>, type: string) => {
    const getPosition =
      type === 'end'
        ? e.nativeEvent.changedTouches[0].clientX
        : e.nativeEvent.touches[0].clientX

    const screen = document.documentElement.clientWidth
    const itemW = parseFloat(widthCard) + marginCards
    const maxMove = itemW * (children.length - 1)

    if (type === 'move') {
      if (!moveCarousel) {
        return
      }

      if (getPosition < 0 || getPosition > screen) {
        setMoveCarousel(false)
      } else {
        const x = getPosition - moveStart

        if (carouselPosition === 0) {
          setCarouselPosition(x > 0 ? 0 : movePosition + x * 1.5)
        } else if (Math.abs(movePosition + x) > maxMove) {
          setCarouselPosition(-maxMove)
        } else {
          setCarouselPosition(movePosition + x > 0 ? 0 : movePosition + x * 1.5)
        }
      }
    }

    if (type === 'start') {
      setMoveCarousel(true)
      setMoveStart(
        getPosition < 0 ? 0 : getPosition > screen ? screen : getPosition
      )
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

  const moveDot = (index: number) => {
    setCarouselIndex(index)
    const screenWidth = document.documentElement.offsetWidth - 32
    let itens = itemsPage

    if (screenWidth < 920) itens -= 1
    const position = itens * (index - 1) * (parseFloat(widthCard) + marginCards)

    setCarouselPosition(-position)
  }

  const nextSlide = () => {
    if (carouselIndex < carouselDots) moveDot(carouselIndex + 1)
    else moveDot(1)
  }

  const prevSlide = () => {
    if (carouselIndex > 1) moveDot(carouselIndex - 1)
    else moveDot(carouselDots)
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
        style={{
          width: `${(parseFloat(widthCard) + marginCards) * itemsPage}px`,
        }}
      >
        <div
          className="carouselShelf--container"
          draggable
          onTouchStart={(e) => carouselSlide(e, 'start')}
          onTouchMove={(e) => carouselSlide(e, 'move')}
          onTouchEnd={(e) => carouselSlide(e, 'end')}
          style={{
            minWidth: `${
              widthCard === '100%'
                ? '100%'
                : `${(parseFloat(widthCard) + marginCards) * children.length}px`
            }`,
            transform: `translateX(${carouselPosition}px)`,
          }}
        >
          {children.map((product: any, index: number) => (
            <div
              key={index}
              className="carousel--item"
              style={{ width: widthCard, marginRight: `${marginCards}px` }}
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
