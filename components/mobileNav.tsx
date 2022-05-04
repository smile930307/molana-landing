/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { GoTopButton } from '../components/goTopButton'

// import { topNavLocales } from '../constants/locales/locales'

import { communityBanner } from '../constants/locales/locales'

interface MobileNavProps {
  page: 'home' | 'nfts' | 'whitepaper' | 'roadmap' | 'about'
  classNames?: string
  logo?: 'light' | 'dark'
}

export const MobileNav: React.FC<MobileNavProps> = ({ page, classNames, logo }: MobileNavProps) => {
  const handleCurrent = (name: string): string => {
    return `top-nav__page ${name === page ? 'selected' : ''}`
  }
  const [flag, setNav] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [lastScrollY, setLastScrollY] = useState(0)
  useEffect(() => {
    const updatePosition = () => {
      setLastScrollY(scrollPosition)
      setScrollPosition(window.pageYOffset)
      if (window.pageYOffset < 500) {
        setNav(false)
      }
    }
    window.addEventListener('scroll', updatePosition)
    return () => window.removeEventListener('scroll', updatePosition)
  })
  const showNav = () => {
    return lastScrollY > scrollPosition || scrollPosition < 100
  }
  const showButton = () => {
    return scrollPosition > 500
  }
  return (
    <div className='mobile-nav mobile--only'>
      <GoTopButton visible={showButton()} />
      <ul className={flag ? 'slider-down mobile--only' : 'slider-down slider-hidden'}>
        {/*
        <li>
          <Link href='/'>
            <a className={handleCurrent('home')}>{topNavLocales.home}</a>
          </Link>
        </li>
        <li>
          <Link href='/nfts'>
            <a className={handleCurrent('nfts')}>{topNavLocales.nfts}</a>
          </Link>
        </li>
        <li>
          <Link href='/whitepaper'>
            <a className={handleCurrent('whitepaper')}>{topNavLocales.whitepaper}</a>
          </Link>
        </li>
        <li>
          <Link href='/roadmap'>
            <a className={handleCurrent('roadmap')}>{topNavLocales.roadmap}</a>
          </Link>
        </li>
        <li>
          <Link href='/about'>
            <a className={handleCurrent('about')}>{topNavLocales.about}</a>
          </Link>
        </li> */}
        <a
          href={communityBanner.discordHref}
          className='community-banner__buttons__btn btn--bold  btn--white btn--sm social--btn'
        >
          <i className='icon--discord icon--vs'></i>
          <span>{communityBanner.discord}</span>
        </a>
        <a
          href={communityBanner.telegramHref}
          className='community-banner__buttons__btn btn--bold  btn--white btn--sm social--btn'
        >
          <i className='icon--telegram icon--vs'></i>
          <span>{communityBanner.telegram}</span>
        </a>
        <a
          href={communityBanner.twitterHref}
          className='community-banner__buttons__btn btn--bold  btn--white btn--sm social--btn'
        >
          <i className='icon--twitter--small icon--vs'></i>
          <span>{communityBanner.twitter}</span>
        </a>
      </ul>
      <header
        id='MobileNav'
        className={`mobile--only  ${classNames}` + '' + (showNav() ? ' nav-shown' : ' nav-shown nav-hidden')}
      >
        <span>
          <Link href='/'>
            <a>
              {logo === 'light' ? (
                <Image src='/logo/mobile-top-logo.png' alt='Top Logo' width={247} height={48} />
              ) : (
                <Image src='/logo/bottom-logo.png' alt='Bottom Logo' width={247} height={72} />
              )}
            </a>
          </Link>
          {/* <i
            onClick={() => {
              setNav(!flag)
              console.log(flag)
            }}
            className={'icon--cross'}
          ></i> */}
          <span className='nav--hamburger'>
            <label
              className={flag ? 'hamburger--clicked' : ''}
              onClick={() => {
                setNav(!flag)
                console.log(flag)
              }}
            >
              <div></div>
              <div></div>
              <div></div>
            </label>
          </span>
        </span>
      </header>
    </div>
  )
}
