/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
import React, { Component } from 'react'
import Slider from 'react-slick'
import Image from 'next/image'

function CustomArrow(props: any) {
  let className = props.type === 'next' ? 'nextArrow' : 'prevArrow'
  className += ' arrow'
  return (
    <span className={className} onClick={props.onClick} style={{ color: 'white' }}>
      {props.type === 'next' ? (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image src='/home/next_arrow.svg' width={30} height={30} />
      ) : (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image src='/home/prev_arrow.svg' width={30} height={30} />
      )}
    </span>
  )
}

interface RoadMapItemInfo {
  status: boolean
  content: string
}

interface CustomItemProps {
  index?: number
  year: number
  data: RoadMapItemInfo[]
}

function CustomItem(props: CustomItemProps) {
  const { index, data, year } = props
  return (
    <div className='item'>
      <div className='item-title-text'>{year}</div>
      <div className='img_show_center' style={{ backgroundColor: '#13f195' }}>
        <img src='/home/note.svg' alt='note' />
      </div>
      <div className='roadmap_line'></div>
      <div className='roadmap_content'>
        <p style={{ padding: '0px', marginBottom: '0px' }}>Q{index}</p>
        {data.map((item, i) => {
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              {item.status ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 flex-none text-greenly'
                  fill='none'
                  color='#13f195'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  style={{ flex: '0.1 0.1 0', width: '30px', height: '30px' }}
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                </svg>
              ) : (
                <span style={{ width: '30px', display: 'flex', alignItems: 'center' }}>⏳</span>
              )}
              <p
                style={{
                  flex: '1 1 0',
                  fontSize: '0.8rem',
                  paddingLeft: '10px',
                  marginTop: '5px',
                  marginBottom: '5px'
                }}
              >
                {item.content}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default class RoadMapSimpleSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      nextArrow: <CustomArrow type={'next'} />,
      prevArrow: <CustomArrow type={'prev'} />,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    }

    return (
      <div>
        <Slider {...settings}>
          <CustomItem
            index={1}
            data={[
              { status: true, content: 'Business Concept Formation' },
              { status: true, content: 'Core Team formed' },
              { status: true, content: 'Research and Analysis' }
            ]}
            year={2022}
          />
          <CustomItem
            index={2}
            data={[
              { status: true, content: 'Website And Domain Creation' },
              { status: true, content: 'Landing Page' },
              { status: true, content: 'Team Extension' },
              { status: false, content: 'Share Token Creation' },
              { status: false, content: 'Payoneer <-> SPL' },
              { status: false, content: 'Payoneer <-> ETH' },
              { status: false, content: 'Payoneer <-> BSC' },
              { status: false, content: 'SPL <-> ETH' },
              { status: false, content: 'ETH/BSC <-> ETH/BSC' }
            ]}
            year={2022}
          />
          <CustomItem
            index={3}
            data={[
              { status: false, content: 'Trading Platform' },
              { status: false, content: 'Share sale platform' },
              { status: false, content: 'Audit Start' },
              { status: false, content: 'Beta version launch' }
            ]}
            year={2022}
          />
          <CustomItem
            index={4}
            data={[
              { status: false, content: 'Paypal <-> SPL/ETH/BSC' },
              { status: false, content: 'Add Polygon' },
              { status: false, content: 'Add Avalanche' },
              { status: false, content: 'Add Bitcoin' },
              { status: false, content: 'Add Polkadot' },
              { status: false, content: 'Add Cosmos' },
              { status: false, content: 'Add Cardano' },
              { status: false, content: 'Add lots of Chain & Paymen' }
            ]}
            year={2022}
          />
          <CustomItem
            index={5}
            data={[
              { status: false, content: 'Security team extension' },
              { status: false, content: 'share NFT Auction' }
            ]}
            year={2022}
          />
          <CustomItem index={6} data={[{ status: false, content: 'Coming ...' }]} year={2023} />
        </Slider>
      </div>
    )
  }
}
