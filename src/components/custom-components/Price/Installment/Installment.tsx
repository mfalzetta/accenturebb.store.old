import './Installment.scss'
/* eslint-disable  @typescript-eslint/no-explicit-any */

export type InstallmentProps = {
  Installments: Array<InstallmentsProps[] | null | undefined>
}

export type InstallmentsProps = {
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

const Installment = ({ Installments }: InstallmentProps) => {
  if (Installments) {
    const noFee = Installments.flat().filter((el: any) => el.InterestRate === 0)

    const NumberOfInstallments = noFee.map((el: any) => el.NumberOfInstallments)

    const maxInstallment = Math.max(...NumberOfInstallments)
    let installmentValue = noFee.filter(
      (el: any) => el.NumberOfInstallments === maxInstallment
    )

    if (installmentValue.length > 1) {
      const value = installmentValue.map((el: any) => el.Value)
      const minValue = Math.min(...value)

      installmentValue = noFee.filter((el: any) => el.Value === minValue)
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
