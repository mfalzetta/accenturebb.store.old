import './Logo.scss'

function Logo() {
  return (
    <div data-theme-logo>
      <img
        data-theme-logo-first
        src="/logo-lacoste2.svg"
        alt="Lacoste Logo"
        width="104px"
        height="23px"
      />
      <img
        src="/logo-lacoste.svg"
        alt="Lacoste Logo"
        width="50px"
        height="23px"
      />
    </div>
  )
}

export default Logo
