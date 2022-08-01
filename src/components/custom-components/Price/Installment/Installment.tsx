import type { InstallmentsProps } from 'src/components/product/ProductCard/ProductCard'
import './Installment.scss'

export type InstallmentProps = {
  Installments: InstallmentsProps[][]
}

const roundInstallment = (value: number) => {
  const decimal = parseFloat(value.toString()).toFixed(2)

  return decimal.replace('.', ',')
}

const Installment = ({ Installments }: InstallmentProps) => {
  if (Installments) {
    const noFee = Installments.flat().filter(
      (el: InstallmentsProps) => el.InterestRate === 0
    )

    const NumberOfInstallments = noFee.map(
      (el: InstallmentsProps) => el.NumberOfInstallments
    )

    const maxInstallment = Math.max(...NumberOfInstallments)
    let installmentValue = noFee.filter(
      (el: InstallmentsProps) => el.NumberOfInstallments === maxInstallment
    )

    if (installmentValue.length > 1) {
      const value = installmentValue.map((el: InstallmentsProps) => el.Value)
      const minValue = Math.min(...value)

      installmentValue = noFee.filter(
        (el: InstallmentsProps) => el.Value === minValue
      )
    }

    if (maxInstallment > 1) {
      return (
        <div data-product-card-installment>
          {installmentValue[0] && (
            <span>
              ou {installmentValue[0].NumberOfInstallments}x de R${' '}
              {roundInstallment(installmentValue[0].Value)}
            </span>
          )}
        </div>
      )
    }

    return <></>
  }

  return <></>
}

export default Installment
