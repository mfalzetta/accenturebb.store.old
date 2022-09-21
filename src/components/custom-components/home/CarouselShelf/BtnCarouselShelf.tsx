import { SliderArrowLeft, SliderArrowRight } from '../../../../images/Slider'

interface BtnCarouselShelfProps {
  direction: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moveSlide: any
}

const BtnCarouselShelf = ({ direction, moveSlide }: BtnCarouselShelfProps) => {
  return (
    <button
      onClick={moveSlide}
      className={
        direction === 'next'
          ? 'btn-carouselShelf next'
          : 'btn-carouselShelf prev'
      }
      aria-label={`${direction}`}
    >
      {direction === 'next' ? <SliderArrowRight /> : <SliderArrowLeft />}
    </button>
  )
}

export default BtnCarouselShelf
