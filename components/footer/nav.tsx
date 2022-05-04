import React from 'react'
import { pageFooter } from '../../constants/locales/locales'

export const FooterNav: React.FC = () => {
  return (
    <nav className='footer__nav'>
      <div className='footer__nav__column'>
        <span style={{ color: '#b4b4b4' }}>{pageFooter.navCommunity.header}</span>
        {pageFooter.navCommunity.aArr.map((a: { label: string; href: string }) => (
          <a key={a.label} href={a.href} style={{ color: '#b4b4b4' }}>
            {' '}
            {a.label}{' '}
          </a>
        ))}
      </div>
      {/* <div className='footer__nav__column'>
        <span>{pageFooter.navLegal.header}</span>
        {pageFooter.navLegal.aArr.map((a: { label: string; href: string }) => (
          <a key={a.label} href={a.href}>
            {' '}
            {a.label}{' '}
          </a>
        ))}
      </div>
      <div className='footer__nav__column'>
        <span>{pageFooter.navCompany.header}</span>
        {pageFooter.navCompany.aArr.map((a: { label: string; href: string }) => (
          <a key={a.label} href={a.href}>
            {' '}
            {a.label}{' '}
          </a>
        ))}
      </div> */}
    </nav>
  )
}
