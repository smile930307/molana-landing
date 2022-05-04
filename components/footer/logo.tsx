import React from 'react'
import Image from 'next/image'
import { pageFooter } from '../../constants/locales/locales'

export const Logo: React.FC = () => {
  return (
    <div className='footer__logo'>
      <div className='footer__container'>
        <Image src='/logo/bottom-logo.png' alt='Molana Logo' height={28} width={175} />
        <div className='logo-solana'>
          <div className='logo-solana__powered-by'>{pageFooter.logoSolanaPowered}</div>
          <Image src='/logo/footer-logo-solana.svg' alt='Molana Logo' height={12} width={96} />
        </div>
      </div>
    </div>
  )
}
