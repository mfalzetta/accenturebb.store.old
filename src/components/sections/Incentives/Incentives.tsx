import { Incentive as UIIncentive } from '@faststore/ui'

import Image from 'src/components/ui/Image/Image'
import Slider from 'src/components/custom-components/home/Slider'

import styles from './incentives.module.scss'

interface Incentive {
  src: string
  alt?: string
  title?: string
  primaryText: string
  secondaryText?: string
}

export interface IncentivesProps {
  incentives: Incentive[]
  /**
   * Controls whether the component will be colored or not.
   */
  colored?: boolean
  /**
   * Controls the component's direction.
   */
  variant?: 'horizontal' | 'vertical'
}

function Incentives({
  incentives,
  variant = 'horizontal',
  colored = false,
}: IncentivesProps) {
  return (
    <div
      data-fs-incentives
      data-fs-incentives-colored={colored}
      data-fs-incentives-variant={variant}
      className={styles.fsIncentives}
    >
      <Slider minWidth={150} itemsPerPage={4}>
        {incentives.map((incentive, index) => (
          <UIIncentive key={index}>
            <Image
              src={incentive.src}
              alt={incentive.alt ?? `${incentive.title} icon`}
              loading="lazy"
              data-fs-incentive-icon
              width={32}
              height={32}
            />
            <div data-fs-incentive-content>
              {incentive.title && (
                <p data-fs-incentive-title>{incentive.title}</p>
              )}
              <span data-fs-incentive-description>{incentive.primaryText}</span>
              {incentive.secondaryText && (
                <span data-fs-incentive-description>
                  {incentive.secondaryText}
                </span>
              )}
            </div>
          </UIIncentive>
        ))}
      </Slider>
    </div>
  )
}

export default Incentives
