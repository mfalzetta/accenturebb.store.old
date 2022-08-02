import './Installment.scss'

export type InstallmentsProps = {
  Installments: InstallmentProps[][]
}
export interface InstallmentProps {
  Value: number
  InterestRate: number
  TotalValuePlusInterestRate: number
  NumberOfInstallments: number
  Name: string
  PaymentSystemName: string
}

const roundInstallment = (value: number) => {
  const decimal = parseFloat(value.toString()).toFixed(2)

  return decimal.replace('.', ',')
}

const Installment = ({ Installments }: InstallmentsProps) => {
  if (Installments) {
    const noFee = Installments.flat().filter(
      (el: InstallmentProps) => el.InterestRate === 0
    )

    const NumberOfInstallments = noFee.map(
      (el: InstallmentProps) => el.NumberOfInstallments
    )

    const maxInstallment = Math.max(...NumberOfInstallments)
    let installmentValue = noFee.filter(
      (el: InstallmentProps) => el.NumberOfInstallments === maxInstallment
    )

    if (installmentValue.length > 1) {
      const value = installmentValue.map((el: InstallmentProps) => el.Value)
      const minValue = Math.min(...value)

      installmentValue = noFee.filter(
        (el: InstallmentProps) => el.Value === minValue
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
