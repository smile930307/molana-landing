import { useState } from 'react'

export const useFilters = (): [string[], (flt: string | string[]) => void] => {
  const [filters, setFilters] = useState<string[]>([])

  const changeFilters = (flt: string | string[]) => {
    if (Array.isArray(flt)) {
      setFilters(flt)
    } else if (filters.includes(flt)) {
      setFilters(filters.filter((f) => f !== flt))
    } else {
      setFilters(filters.concat(flt))
    }
  }

  return [filters, changeFilters]
}
