import { useEffect, useState } from 'react'

import './Slider.scss'
import BtnSlider from './BtnSlider'

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  vtex/prefer-early-return */
export interface SliderProps {
  children: any
  itemsPerPage?: number
  arrows?: boolean
  height: number
  wfull?: boolean
  minWidth?: number
}

function arrayChunk(arr: any, len: number) {
  const chunks = []
  const n = arr.length

  for (let index = 0; index < n; ) {
    const from = index
    // eslint-disable-next-line no-multi-assign
    const to = (index += len)

    chunks.push(arr.slice(from, to))
  }

  return chunks
}

const Slider = ({
  children,
  itemsPerPage,
  arrows,
  height,
  wfull,
  minWidth,
}: SliderProps) => {
  const [itemsPage, setItemsPage] = useState<any>(null)
  const [slideIndex, setSlideIndex] = useState(1)

  useEffect(() => {
    if (children) {
      const buildSlider = () => {
        const screenW = document.documentElement.clientWidth
        const length = wfull
          ? screenW
          : minWidth ?? 168 * Number(itemsPerPage) > screenW - 32
          ? minWidth
          : itemsPerPage

        const itemsDefault = itemsPerPage ?? 1
        const items = (screenW - 32) / Number(length)
        const list =
          items < Math.round(items) ? Math.round(items) - 1 : Math.round(items)

        const newItems =
          list > itemsDefault ? itemsDefault : list > 1 ? list : 1

        setSlideIndex(1)
        setItemsPage(arrayChunk([children][0], newItems))
      }

      buildSlider()
      window.addEventListener('resize', () => {
        buildSlider()
      })
    }
  }, [children, itemsPerPage, minWidth, wfull])

  if (!itemsPage) {
    return <></>
  }

  const nextSlide = () => {
    if (slideIndex !== itemsPage.length) {
      setSlideIndex(slideIndex + 1)
    } else if (slideIndex === itemsPage.length) {
      setSlideIndex(1)
    }
  }

  const prevSlide = () => {
    if (slideIndex !== 1) {
      setSlideIndex(slideIndex - 1)
    } else if (slideIndex === 1) {
      setSlideIndex(itemsPage.length)
    }
  }

  const moveDot = (index: number) => {
    setSlideIndex(index)
  }

  return (
    <div
      className={`${!wfull ? ' layout__content' : ''} container-slider`}
      style={{ height: `${wfull ? height : height + 24}px` }}
    >
      {arrows && itemsPage.length > 1 && (
        <>
          <BtnSlider moveSlide={nextSlide} direction="next" />
          <BtnSlider moveSlide={prevSlide} direction="prev" />
        </>
      )}
      {itemsPage.length > 1 ? (
        <div className={`${wfull ? 'full-dots' : ''} container-dots`}>
          {Array.from({ length: itemsPage.length }).map(
            (_: any, index: number) => (
              <div
                aria-hidden="true"
                key={index}
                onClick={() => moveDot(index + 1)}
                className={slideIndex === index + 1 ? 'dot active' : 'dot'}
              />
            )
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Slider
