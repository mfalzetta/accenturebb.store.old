import { useSearch } from '@faststore/sdk'
import { useEffect, useState } from 'react'
import Select from 'src/components/ui/Select'

const OptionsMapM = {
  price_desc: 'Maior preço',
  price_asc: 'Menor preço',
  orders_desc: 'Mais vendidos',
  name_asc: 'A-Z',
  name_desc: 'Z-A',
  release_desc: 'Data de lançamento',
  discount_desc: 'Desconto',
  score_desc: 'Ordernar',
}

const OptionsMapD = {
  price_desc: 'Maior preço',
  price_asc: 'Menor preço',
  orders_desc: 'Mais vendidos',
  name_asc: 'A-Z',
  name_desc: 'Z-A',
  release_desc: 'Data de lançamento',
  discount_desc: 'Desconto',
  score_desc: 'Relevância',
}

let keys = Object.keys(OptionsMapD) as Array<keyof typeof OptionsMapD>

function Sort() {
  const { state, setState } = useSearch()
  const [OptionsMap, setOptionsMap] = useState(OptionsMapD)

  const options = () => {
    setOptionsMap(window.innerWidth < 1280 ? OptionsMapM : OptionsMapD)
    keys = Object.keys(OptionsMap) as Array<keyof typeof OptionsMap>
  }

  useEffect(() => {
    options()
    window.addEventListener('resize', () => {
      options()
    })
  })

  return (
    <Select
      id="sort-select"
      className="sort / text__title-mini-alt"
      label="Ordernar por:"
      options={OptionsMap}
      onChange={(e) => {
        const sort = keys[e.target.selectedIndex]

        setState({
          ...state,
          sort,
          page: 0,
        })
      }}
      value={state.sort}
      testId="search-sort"
    />
  )
}

export default Sort
