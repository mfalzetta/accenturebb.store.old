import usePersonQuery from 'src/sdk/person/usePersonQuery'
import { ButtonLink } from 'src/components/ui/Button'

const ButtonSignIn = () => {
  const person = usePersonQuery()

  return (
    <ButtonLink
      data-fs-button-signin-link
      to={person?.id ? '/account' : '/login'}
      className="text__title-mini signin-link"
      variant="tertiary"
    >
      <span>{person?.id ? 'Minha Conta' : 'Entrar'}</span>
    </ButtonLink>
  )
}

export default ButtonSignIn
