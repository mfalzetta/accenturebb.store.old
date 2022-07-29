import { useCallback, useState } from 'react'
import { Image } from 'src/components/ui/Image'
import ImageViewer from 'react-simple-image-viewer'

import { ImageGallerySelector, ImageZoom } from '.'
import styles from './image-gallery.module.scss'

export interface ImageElementData {
  url: string
  alternateName: string
}

interface ImageGalleryProps {
  images: ImageElementData[]
}

function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const currentImage = images[selectedImageIdx]
  const hasSelector = images.length > 1
  const [currentImageZoom, setCurrentImageZoom] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const openImageViewer = useCallback((index: number) => {
    setCurrentImageZoom(index)
    setIsViewerOpen(true)
  }, [])

  const closeImageViewer = () => {
    setCurrentImageZoom(0)
    setIsViewerOpen(false)
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
