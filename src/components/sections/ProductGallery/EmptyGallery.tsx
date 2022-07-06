import EmptyState from 'src/components/ui/EmptyState'

import iconSearchNotFound from '../../../images/icon-search-not-found.png'

function EmptyGallery() {
  return (
    <EmptyState>
      <h2>Puxa, não encontramos a palavra buscada</h2>
      <img src={iconSearchNotFound} alt="Ícone de lupa" />
      <h3>Quem sabe tente o seguinte:</h3>
      <ul>
        <li> - use palavras mais comuns</li>
        <li> - tente termos menos específicos</li>
        <li> - para facilitar, digite palavras de até 6 caracteres</li>
      </ul>
    </EmptyState>
  )
}

export default EmptyGallery
