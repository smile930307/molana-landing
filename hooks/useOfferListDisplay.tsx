import { useState } from 'react'

export const useOfferListDisplay = (): [string, () => void] => {
  const [display, setDisplay] = useState<'grid' | 'table'>('grid')

  const changeDisplay = () => {
    if (display === 'grid') {
      setDisplay('table')
    } else {
      setDisplay('grid')
    }
  }

  return [display, changeDisplay]
}
