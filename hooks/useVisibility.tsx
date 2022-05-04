import { useState } from 'react'

export const useVisibility = (defaultVisibility = 'visible'): [string, () => void] => {
  const [visibility, setVisibility] = useState(defaultVisibility)

  const changeVisibility = () => {
    setVisibility(visibility === 'visible' ? 'hidden' : 'visible')
  }

  return [visibility, changeVisibility]
}
