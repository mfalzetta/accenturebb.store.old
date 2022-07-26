/* eslint-disable  @typescript-eslint/no-explicit-any */

export type InstallmentProps = {
  Installments: Array<
    | Array<{
        Value: number
        InterestRate: number
        TotalValuePlusInterestRate: number
        NumberOfInstallments: number
        Name: string
        PaymentSystemName: string
      }>
    | null
    | undefined
  >
}

const Installment = ({ Installments }: InstallmentProps) => {
  if (Installments) {
    const installmentNumber = Installments.flat().map(
      (el: any) => el.NumberOfInstallments
    )

    const maxInstallment = Math.max(...installmentNumber)
    let installmentValue = Installments.flat().filter(
      (el: any) => el.NumberOfInstallments === maxInstallment
    )

    if (installmentValue.length > 1) {
      const value = installmentValue.map((el: any) => el.Value)
      const minValue = Math.min(...value)

      installmentValue = Installments.flat().filter(
        (el: any) => el.Value === minValue
      )
    }

    if (maxInstallment > 1) {
      return (
        <div data-product-card-installment>
          {installmentValue[0] && (
            <span>
              ou {installmentValue[0].NumberOfInstallments}x de R${' '}
              {installmentValue[0].Value}
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
