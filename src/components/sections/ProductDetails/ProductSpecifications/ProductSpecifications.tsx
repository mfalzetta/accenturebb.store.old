import './product-specifications.scss'

export interface AllUsableSpecsType {
  values: string[]
  originalName: string
  name: string
  others?: AllUsableSpecsType[]
}

interface ProductSpecificationsProps {
  specifications: AllUsableSpecsType[] | undefined
}

const ProductSpecifications = ({
  specifications,
}: ProductSpecificationsProps) => {
  return (
    <table data-fs-specefications-table>
      {specifications?.map((spec, index: number) => (
        <tr key={index}>
          <td className="col-1">{spec.name}</td>
          <td className="col-2">{spec.values}</td>
        </tr>
      ))}
    </table>
  )
}

export default ProductSpecifications
