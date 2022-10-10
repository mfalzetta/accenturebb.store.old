// eslint-disable-next-line import/order
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { useEffect, useState } from 'react'

import Section from 'src/components/sections/Section'
import { SliderArrowLeft, SliderArrowRight } from 'src/images/Slider'

interface Props {
  children: any
  arrows?: boolean
  dots?: boolean
  breakpoints: {
    desktop: number
    tablet: number
    phone: number
  }
  full?: boolean
}

export default function KeenSlider({
  children,
  arrows,
  dots,
  breakpoints,
  full,
}: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [perView, setPerView] = useState(0)
  const [dotsCount, setDotsCount] = useState(0)
  const [arrowsEnabled, setArrowsEnabled] = useState(false)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
    breakpoints: {
      '(min-width: 767px)': {
        slides: { perView: breakpoints.tablet, spacing: 5 },
      },
      '(min-width: 1000px)': {
        slides: { perView: breakpoints.desktop, spacing: 10 },
      },
    },
    slides: { perView: breakpoints.phone },
  })

  useEffect(() => {
    const slidesOption: any = instanceRef?.current?.options?.slides
    const slides: any = instanceRef?.current?.track?.details?.slides

    setPerView(slidesOption?.perView)
    setDotsCount(
      (slides?.length as number) + 1 - perView === Infinity
        ? 0
        : (slides?.length as number) + 1 - perView
    )
    setArrowsEnabled(perView < slides.length)
  }, [instanceRef?.current?.options?.slides, perView])

  return (
    <Section
      className={`${full ? 'layout__content--full' : 'layout__content'}`}
      style={{ position: 'relative' }}
    >
      <div className="navigation-wrapper">
        <div ref={sliderRef} className="keen-slider">
          {children}
        </div>
        {arrows && arrowsEnabled && loaded && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.prev()
              }
              disabled={currentSlide === 0}
            />

            <Arrow
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
              disabled={
                instanceRef?.current?.track?.details?.slides?.length -
                  perView <=
                currentSlide
              }
            />
          </>
        )}
      </div>
      {dots && dotsCount > 1 && loaded && instanceRef.current && (
        <div className="dots">
          {[...Array(Math.ceil(dotsCount)).keys()].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx)
                }}
                className={`dot${currentSlide === idx ? ' active' : ''}`}
              />
            )
          })}
        </div>
      )}
    </Section>
  )
}

function Arrow(props: {
  disabled: boolean
  left?: boolean
  onClick: (e: any) => void
}) {
  return (
    <>
      {props.left ? (
        <SliderArrowLeft
          onClick={props.onClick}
          className={`arrow arrow--left ${props.disabled && 'arrow--disabled'}`}
        />
      ) : (
        <SliderArrowRight
          onClick={props.onClick}
          className={`arrow arrow--right ${
            props.disabled && 'arrow--disabled'
          }`}
        />
      )}
    </>
  )
  const disabeld = props.disabled ? ' arrow--disabled' : ''

  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${
        props.left ? 'arrow--left' : 'arrow--right'
      } ${disabeld}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  )
}
