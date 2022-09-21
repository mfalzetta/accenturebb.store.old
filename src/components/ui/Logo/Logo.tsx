import Image from 'next/image'

import styles from './logo.module.scss'

function Logo() {
  return (
    <div data-theme-logo className={styles.fsLogo}>
      <Image
        data-theme-logo-first
        src="/logo-lacoste2.svg"
        alt="Lacoste Logo"
        width={104}
        height={23}
      />
      <Image
        src="/logo-lacoste.svg"
        alt="Lacoste Logo"
        width={50}
        height={23}
      />
    </div>
  )
}

export default Logo
