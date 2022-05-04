/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

import Link from 'next/link'

import { UnlocLogo } from './unlocLogo'
import { topNavLocales } from '../constants/locales/locales'

interface TopNavProps {
  page: 'home' | 'trading' | 'roadmap' | 'about' | 'user'
  theme: 'light' | 'dark'
  classNames?: string
  logo?: 'light' | 'dark'
}

export const TopNav: React.FC<TopNavProps> = ({ page, theme, classNames = '', logo }: TopNavProps) => {
  const handleCurrent = (name: string): string => {
    return `top-nav__page ${name === page ? 'selected' : ''}`
  }

  return (
    <header id='topNav' className={`mobile--hidden top-nav show-nav ${classNames}`}>
      <UnlocLogo logo={theme} />
      <ul>
        <li>
          <Link href='/'>
            <a style={{ color: '#833dd9' }} className={handleCurrent('home')}>
              {topNavLocales.home}
            </a>
          </Link>
        </li>
        <li>
          <Link href='/trading'>
            <a style={{ color: '#833dd9' }} className={handleCurrent('trading')}>
              {topNavLocales.trading}
            </a>
          </Link>
        </li>
        <li>
          <Link href='/invest'>
            <a style={{ color: '#833dd9' }} className={handleCurrent('invest')}>
              {topNavLocales.invest}
            </a>
          </Link>
        </li>
        <li>
          <Link href='/security'>
            <a style={{ color: '#833dd9' }} className={handleCurrent('user')}>
              {topNavLocales.security}
            </a>
          </Link>
        </li>
        {/* <li>
          <Link href='/whitepaper'>
            <a className={handleCurrent('whitepaper')}>{topNavLocales.whitepaper}</a>
          </Link>
        </li> */}
        <li>
          <Link href='https://defi.molana.finance/'>
            <a style={{ color: '#833dd9' }} className={handleCurrent('roadmap')}>
              {topNavLocales.defi}
            </a>
          </Link>
        </li>
        <li>
          <Link href='https://docs.molana.finance/'>
            <a style={{ color: '#833dd9' }} className={handleCurrent('about')} target='_blank'>
              {topNavLocales.about}
            </a>
          </Link>
        </li>
      </ul>
    </header>
  )
}
