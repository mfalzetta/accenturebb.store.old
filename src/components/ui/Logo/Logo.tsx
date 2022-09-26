import styles from './logo.module.scss'

function Logo() {
  return (
    <div data-theme-logo className={styles.fsLogo}>
      <span data-fs-logo-text role="img" aria-label="Lacoste logo text" />
      <span data-fs-logo-icon role="img" aria-label="Lacoste logo" />
    </div>
  )
}

export default Logo
