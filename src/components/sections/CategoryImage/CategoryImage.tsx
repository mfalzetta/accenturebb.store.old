import Image from 'next/image'

import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'

import Slider from '../../custom-components/home/Slider'
import styles from './category-image.module.scss'

export interface CategoryImageProps {
  allItems: CategoryImageAllItemsProps[]
  department?: string
}
export interface CategoryImageAllItemsProps {
  alt: string
  category: string
  src: string
  link: string
}

const CategoryImage = ({ allItems, department }: CategoryImageProps) => {
  return (
    <div className={`${department} category-image ${styles.fsCategoryImage}`}>
      <Slider arrows minWidth={96} itemsPerPage={8}>
        {allItems.map((el, index) => {
          const link = el.link ? el.link : '/'

          return (
            <div key={index} data-fs-category-image-content>
              <Link href={link}>
                {el.src ? (
                  <Image
                    data-fs-category-image-image
                    src={el.src}
                    alt={el.alt}
                    width={94}
                    height={94}
                  />
                ) : (
                  <Icon name="empty__category" width="94" height="94" />
                )}
                <span data-fs-category-image-category>{el.category}</span>
              </Link>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}

export default CategoryImage
