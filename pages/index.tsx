/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Head from 'next/head'
import { Image } from 'antd'

import { TopNav } from '../components/topNav'
import { Footer } from '../components/footer'
import { MobileNav } from '../components/mobileNav'
import { UnlocLogo } from '../components/unlocLogo'
import RoadMapSimpleSlider from '../components/roadMapSlider'

import { home } from '../constants/locales/locales'
import { HomeCarousel } from '../components/homeCarousel'
import { useState } from 'react'
import { showInfoToast, showSuccessToast } from '../functions/utils'

const encode = (data: any) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

const Home: NextPage = () => {
  const [email, setEmail] = useState<string>()
  const [name, setName] = useState<string>()
  const [message, setMessage] = useState<string>()
  const handleSubmit = (e: any) => {
    if (email && name && message) {
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', email: email, message: message, name: name })
      })
        .then(() => showSuccessToast('Success'))
        .catch((error) => alert(error))
    } else {
      showInfoToast('Please fill the fields')
    }
    e.preventDefault()
  }

  return (
    <div className='page page--home'>
      <Head>
        <title>{home.title}</title>
        <meta name='description' content='Loan your NFTs with Molana' />
        <meta property='og:title' content='UNLOC - Solana based NFT Loaning marketplace' />
        <meta property='og:url' content='https://unloc.xyz' />
        <meta property='og:image' content='https://unloc.xyz/home-bg.jpg' />
      </Head>
      <div className='root'>
        <div className='root__bg'>
          <div className='root__bg__left'></div>
        </div>
        <div className='container'>
          <div className='home__top-nav'>
            <TopNav page='home' theme='light' classNames='home__top-nav--inner' />
            <UnlocLogo logo='light' classNames='mobile--only unloc--logo--mobile' />
          </div>

          <main style={{ backgroundColor: 'black' }}>
            <section className='home__promo mobile--hidden'></section>
            <section className='home__copy'>
              {/* <div style={{ width: '50%' }}>
                <HomeSlider></HomeSlider>
              </div> */}
              <HomeCarousel></HomeCarousel>
              <div className='mobile--hidden'>
                <Image className='copy__img' src='/home/promo2.svg' alt='Vercel Logo'></Image>
              </div>
            </section>
            <section className='content_part1'>
              <div className='content_part1_flex'>
                <div className='caption'>Our BlockChain</div>
                <h1 className='panel-title-text color-white text-center' style={{ fontFamily: 'Open Sans,sans-serif' }}>
                  Built on the fastest blockchain technology
                </h1>
                <div className='pt-8 px-6 grid grid-cols-1 gap-4 md-w-5/6 mx-auto'>
                  <div className='bg-gradient-to-r from-purple to-greenly py-6 rounded-lg transition ease-in-out duration-300 hover-scale-105'>
                    <p className='mx-auto blockchain-item-p text-center panel-intend-text color-white'>
                      Solana ensures composability between ecosystems by maintaining a single global state as the
                      network scales.
                    </p>
                  </div>
                  <div className='bg-gradient-to-r from-bluely-lighty to-purple py-6 rounded-lg transition ease-in-out duration-300 hover-scale-105'>
                    <p className='panel-intend-text mx-auto blockchain-item-p text-center color-white'>
                      Enjoy low transaction cost forever as Solana&apos;s scalability ensures transactions remain less
                      than $0.01.
                    </p>
                  </div>
                  <div className='bg-gradient-to-r from-bluely-super via-bluely-super to-bluely-light py-6 rounded-lg transition ease-in-out duration-300 hover-scale-105'>
                    <p className='panel-intend-text mx-auto blockchain-item-p text-center color-white'>
                      Solana is all about speed, with 400 millisecond block times. And as hardware gets faster, so does
                      the network.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section className='content_part2'>
              <div className='caption'>Core Ecosystem</div>
              <div className='content_part2_grid'>
                <div className='space'></div>
                <div className='content_part2-1' style={{ backgroundColor: '#14f195' }}>
                  <div className='part2_flex'>
                    <div className='img_show'>
                      <img src='/home/molana-trading.png' width='80px' height='80px' />
                    </div>
                    <p className='panel-title-text'>Molana trading</p>
                  </div>
                  <p className='panel-intend-text'>
                    User friendly p2p trading platform to exchange any on & off chain currency safely without dispute.
                  </p>
                </div>
                <div className='content_part2-2' style={{ backgroundColor: '#93bedf' }}>
                  <div className='part2_flex'>
                    <div className='img_show'>
                      <img src='/home/molana-investing.png' width='80px' height='80px' />
                    </div>
                    <p className='panel-title-text'>Molana Investing</p>
                  </div>
                  <p className='panel-intend-text'>
                    Share sale platform for investors who interested in buying our share as soon as possible.
                  </p>
                </div>
                <div className='space mobile--hidden'></div>
                <div className='space mobile--hidden'></div>
                <div className='content_part2-3' style={{ backgroundColor: '#d99ac5' }}>
                  <div className='part2_flex'>
                    <div className='img_show'>
                      <img src='/home/molana-security.png' width='80px' height='80px' />
                    </div>
                    <p className='panel-title-text'>Molana Security</p>
                  </div>
                  <p className='panel-intend-text'>
                    Highly secured Audit service to protect Solana smart contracts by several steps & levels
                  </p>
                </div>
                <div className='content_part2-4' style={{ backgroundColor: '#b67ef9e6' }}>
                  <div className='part2_flex'>
                    <div className='img_show'>
                      <img src='/home/nft-auction.png' width='80px' height='80px' />
                    </div>
                    <p className='panel-title-text'>NFT Auction</p>
                  </div>
                  <p className='panel-intend-text'>
                    The world first Auction platform what buy and sell our share as NFTs with growing value.
                  </p>
                </div>
                <div className='space'></div>
              </div>
            </section>
            <section id='roadmap' className='content_part3'>
              <div className='caption'>Roadmap</div>
              <RoadMapSimpleSlider />
            </section>
            <section className='content_part4'>
              <div className='caption'>Our team</div>
              <div className='team-member-panel'>
                <div className='team-members'>
                  <div className='item'>
                    <div>
                      <img src='/team-logo/founder.png' />
                    </div>
                    <p>Founder, Tijana Jovicic</p>
                  </div>
                  <div className='item'>
                    <div>
                      <img src='/team-logo/community-manager.png' />
                    </div>
                    <p>Community Manager, Miloš Kojadinović</p>
                  </div>
                  <div className='item'>
                    <div>
                      <img src='/team-logo/hongbobee.png' />
                    </div>
                    <p>Co-founder, PM, Hongbo Li</p>
                  </div>
                  <div className='item'>
                    <div>
                      <img src='/team-logo/business-manager.png' />
                    </div>
                    <p>Business Manager, Ruyi Ren</p>
                  </div>
                  <div className='item'>
                    <div>
                      <img src='/team-logo/devops.png' />
                    </div>
                    <p>Developer, Sanket Mokashi</p>
                  </div>
                  <div className='item'>
                    <div>
                      <img src='/team-logo/eugena-imam.png' />
                    </div>
                    <p>Developer, Eugena Imam</p>
                  </div>
                  <div className='item'>
                    <div>
                      <img src='/team-logo/contract-developer.png' />
                    </div>
                    <p>Developer, Akira Sato</p>
                  </div>
                </div>
                <div className='team-logo mobile--hidden'>
                  <Image src='/team-logo/team.png' height={400} width={400} />
                </div>
              </div>
            </section>
            <section className='content_part5'>
              <div className='caption'>Contact Us</div>
              <div className='content_part5_flex'>
                <div className='logo'>
                  <Image src='/home/contact-us.png' width={400} height={400} />
                </div>
                <div className='part5_flex'>
                  <form onSubmit={handleSubmit}>
                    <div>
                      <p className='text-sm mb-5 mt-20 p-0'>Your Name:</p>
                      <input
                        type='text'
                        name='name'
                        onChange={(e: any) => {
                          setName(e.target.value)
                        }}
                      />
                      <p className='text-sm mb-5 mt-20 p-0'>Your Email:</p>
                      <input
                        type='email'
                        name='email'
                        onChange={(e: any) => {
                          setEmail(e.target.value)
                        }}
                      />
                      <p className='text-sm mb-5 mt-20 p-0'>Your Message:</p>
                      <textarea
                        name='message'
                        onChange={(e: any) => {
                          setMessage(e.target.value)
                        }}
                      ></textarea>
                    </div>
                    <div className='buttonMSG' style={{ flexDirection: 'row' }}>
                      <span></span>
                      <button className='button-msg' type='submit'>
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
                <div className='space'></div>
              </div>
            </section>
          </main>
          <Footer classNames='home__footer' />
          <MobileNav page='home' logo='light' />
        </div>
      </div>
    </div>
  )
}

export default Home
