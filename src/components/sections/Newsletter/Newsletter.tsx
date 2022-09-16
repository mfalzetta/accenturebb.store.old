import type { ComponentPropsWithRef, FormEvent, ReactNode } from 'react'
import { useState, forwardRef, useRef } from 'react'
import { Form, Input, LoadingButton } from '@faststore/ui'

import Section from '../Section'
import { useNewsletterQuery, useNewsletterQueryUpdate } from './NewsLetterQuery'

export interface NewsletterProps
  extends Omit<ComponentPropsWithRef<'form'>, 'title' | 'onSubmit'> {
  /**
   * Title for the section.
   */
  title: ReactNode
  /**
   * A subtitle for the section.
   */
  subtitle?: ReactNode
}

const Newsletter = forwardRef<HTMLFormElement, NewsletterProps>(
  function Newsletter({ title, subtitle, ...otherProps }, ref) {
    const { subscribeUser, loading, data } = useNewsletterQuery()
    const { updateUser } = useNewsletterQueryUpdate()
    const [update, setUpdate] = useState(false)
    const [message, setMessage] = useState('')
    const [email, setEmail] = useState('')

    const emailInputRef = useRef<HTMLInputElement>(null)

    const clearMsg = (type = '') => {
      if (type) {
        setMessage(
          type === 'error'
            ? 'Erro ao tentar adicionar e-mail'
            : 'E-mail inválido'
        )
      }

      setTimeout(() => {
        setMessage('')
      }, 2000)
    }

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault()

      if (emailInputRef.current?.value) {
        setEmail(emailInputRef.current?.value ?? '')
        setMessage('Cadastrando e-mail....')
        subscribeUser({ email: emailInputRef.current?.value })
          .then(() => {
            setUpdate(true)
            clearMsg()
          })
          .catch(() => {
            clearMsg('error')
          })
      } else {
        clearMsg('e-mail')
      }

      const formElement = event.currentTarget as HTMLFormElement

      formElement.reset()
    }

    if (update === true) {
      const id = data?.newsLetter?.id ?? ''

      setUpdate(false)
      if (email) {
        updateUser({ email, id })
          .then(() => {
            setMessage(id ? 'E-mail atualizado!' : 'E-mail cadastrado!')
            clearMsg()
          })
          .catch(() => {
            clearMsg('error')
          })
      } else {
        clearMsg('e-mail')
      }

      setEmail('')
    }

    return (
      <Section data-fs-newsletter>
        <Form
          data-fs-newsletter-form
          ref={ref}
          onSubmit={handleSubmit}
          {...otherProps}
        >
          <div data-fs-newsletter-header>
            {title}
            {Boolean(subtitle) && subtitle}
          </div>

          <div data-fs-newsletter-controls>
            <Input
              id="newsletter-email"
              type="email"
              name="newsletter-email"
              placeholder="Email"
              ref={emailInputRef}
            />
            <LoadingButton type="submit" loading={loading}>
              Inscreva-se
            </LoadingButton>
          </div>
        </Form>
        <span data-fs-newsletter-message>{message}</span>
      </Section>
    )
  }
)

export default Newsletter
