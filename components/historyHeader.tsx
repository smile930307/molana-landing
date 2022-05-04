import React from 'react'
import { historyLocales } from '../constants/locales/locales'

interface HistoryHeaderProps {
  classNames?: string
}

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({ classNames = '' }: HistoryHeaderProps) => {
  return (
    <span className={`header ${classNames}`}>
      <span className='header__signature'>{historyLocales.signature}</span>
      <span className='header__slot'>{historyLocales.slot}</span>
      <span className='header__age'>{historyLocales.age}</span>
      <span className='header__result'>{historyLocales.result}</span>
    </span>
  )
}
