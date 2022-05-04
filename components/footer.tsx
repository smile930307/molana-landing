import React from 'react'
import { Logo } from './footer/logo'
import { Contact } from './footer/contact'
import { FooterNav } from './footer/nav'

interface FooterProps {
  classNames?: string
}

export const Footer: React.FC<FooterProps> = ({ classNames }: FooterProps) => {
  return (
    <footer className={`footer ${classNames}`}>
      <FooterNav />
      <Contact />
      <Logo />
    </footer>
  )
}
