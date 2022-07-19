import { useSearch } from '@faststore/sdk'
import { useEffect, useState } from 'react'
import Select from 'src/components/ui/Select'

const OptionsMapM = {
  price_desc: 'Price, descending',
  price_asc: 'Price, ascending',
  orders_desc: 'Top sales',
  name_asc: 'Name, A-Z',
  name_desc: 'Name, Z-A',
  release_desc: 'Release date',
  discount_desc: 'Discount',
  score_desc: 'Ordernar',
}

const OptionsMapD = {
  price_desc: 'Price, descending',
  price_asc: 'Price, ascending',
  orders_desc: 'Top sales',
  name_asc: 'Name, A-Z',
  name_desc: 'Name, Z-A',
  release_desc: 'Release date',
  discount_desc: 'Discount',
  score_desc: 'Relevance',
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
