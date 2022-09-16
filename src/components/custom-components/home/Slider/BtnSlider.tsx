import { SliderArrowLeft, SliderArrowRight } from '../../../../images/Slider'

interface BtnSliderProps {
  direction: string
  moveSlide: any
}

const BtnSlider = ({ direction, moveSlide }: BtnSliderProps) => {
  return (
    <button
      onClick={moveSlide}
      className={direction === 'next' ? 'btn-slide next' : 'btn-slide prev'}
    >
      {direction === 'next' ? <SliderArrowRight /> : <SliderArrowLeft />}
    </button>
  )
}

export default BtnSlider
