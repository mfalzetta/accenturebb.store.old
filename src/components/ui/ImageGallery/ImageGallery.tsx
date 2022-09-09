import { useCallback, useState } from 'react'
import { Image } from 'src/components/ui/Image'
import ImageViewer from 'react-simple-image-viewer'
import WishListPdpButton from 'src/components/Wishlist/WishListPdpButton'

import { ImageGallerySelector, ImageZoom } from '.'
import styles from './image-gallery.module.scss'

export interface ImageElementData {
  url: string
  alternateName: string
}

interface ImageGalleryProps {
  images: ImageElementData[]
  productId?: string
}
function scrollView(type: string) {
  if (type === 'open') {
    let retry = 0
    const loadingComponent = setInterval(() => {
      if (document.getElementById('ReactSimpleImageViewer')) {
        clearInterval(loadingComponent)
        const image = document.getElementById(
          'ReactSimpleImageViewer'
        ) as HTMLElement

        image.scrollIntoView({ behavior: 'smooth' })
        const body = document.querySelector('body') as HTMLElement

        body.style.overflow = 'hidden'
        const pdp = document.querySelector('.product-details') as HTMLElement

        pdp.style.minHeight = '100vh'
        window.addEventListener('resize', () => scrollView(type))
      } else {
        retry += 1
        if (retry > 20) {
          clearInterval(loadingComponent)
        }
      }
    }, 50)
  } else if (document.querySelector('body')) {
    const body = document.querySelector('body') as HTMLElement

    body.style.overflow = 'scroll'
    const pdp = document.querySelector('.product-details') as HTMLElement

    pdp.style.minHeight = 'fit-content'
  }
}

function ImageGallery({ images, productId }: ImageGalleryProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const currentImage = images[selectedImageIdx]
  const hasSelector = images.length > 1
  const [currentImageZoom, setCurrentImageZoom] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const openImageViewer = useCallback((index: number) => {
    setCurrentImageZoom(index)
    setIsViewerOpen(true)
    scrollView('open')
  }, [])

  const closeImageViewer = () => {
    setCurrentImageZoom(0)
    setIsViewerOpen(false)
    scrollView('close')
  }

  const photos = images
    .map((image) => {
      return [image.url]
    })
    .flat()

  return (
    <section
      data-fs-image-gallery={!hasSelector ? 'without-selector' : ''}
      className={styles.fsImageGallery}
    >
      <ImageZoom>
        <div data-fs-pdp-image-with-wishlist>
          <WishListPdpButton productId={productId} />
          <Image
            src={currentImage.url}
            alt={currentImage.alternateName}
            sizes="(max-width: 804px) 25vw, 30vw"
            width={804}
            height={804 * (3 / 4)}
            loading="eager"
            fetchPriority="high"
            onClick={() => openImageViewer(currentImageZoom)}
          />
        </div>
      </ImageZoom>
      {hasSelector && (
        <ImageGallerySelector
          images={images}
          currentImageIdx={selectedImageIdx}
          onSelect={setSelectedImageIdx}
        />
      )}
      {isViewerOpen && (
        <ImageViewer
          src={photos}
          currentIndex={selectedImageIdx}
          disableScroll
          closeOnClickOutside
          onClose={closeImageViewer}
        />
      )}
    </section>
  )
}

export default ImageGallery
