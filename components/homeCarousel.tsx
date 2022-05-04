/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useSwipeable } from 'react-swipeable'
import { carouselData } from '../constants/locales/locales'

interface CarouselDataInterface {
  title: string
  content: string
}

export const HomeCarousel: React.FC = () => {
  const [carouselWidth, setCarouselWidth] = useState(0)
  const [carouselPosition, setCarouselPosition] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setPlaying] = useState(true)

  const sizeRef = useRef(null)

  const renderItems = (data: CarouselDataInterface[]) => {
    return data.map(({ title, content }) => {
      return (
        <div key={title} className='carousel__item' style={{ width: carouselWidth }}>
          <h1 style={{ color: '#12e58d' }}>{title}</h1>
          <p style={{ color: '#d3d3d3' }}>{content}</p>
        </div>
      )
    })
  }

  const renderNav = (data: CarouselDataInterface[]) => {
    return data.map((item, index) => {
      return (
        <button
          className={currentSlide === index ? 'current' : ''}
          key={item.title}
          onClick={() => {
            handleNav(index)
            setPlaying(false)
          }}
        />
      )
    })
  }

  const handleNav = (slide: number) => {
    setCarouselPosition(-(carouselWidth * slide))
    setCurrentSlide(slide)
  }

  const getWidth = useCallback(() => {
    setCarouselWidth(sizeRef.current ? (sizeRef.current as HTMLElement).offsetWidth : 0)
    setCarouselPosition(-(carouselWidth * currentSlide))
  }, [carouselWidth, currentSlide])

  useEffect(() => {
    getWidth()
  }, [sizeRef, getWidth])

  useEffect(() => {
    window.addEventListener('resize', getWidth)

    return () => {
      window.removeEventListener('resize', getWidth)
    }
  }, [getWidth])

  const swipeHandler = useSwipeable({
    onSwipedLeft: () => {
      if (carouselData.length > currentSlide + 1) {
        handleNav(currentSlide + 1)
        setPlaying(false)
      }
    },
    onSwipedRight: () => {
      if (currentSlide > 0) {
        handleNav(currentSlide - 1)
        setPlaying(false)
      }
    }
  })

  useEffect(() => {
    const changeSlide = setInterval(() => {
      if (!isPlaying) {
        clearInterval(changeSlide)
      } else if (carouselData.length > currentSlide + 1) {
        handleNav(currentSlide + 1)
      } else {
        handleNav(0)
      }
    }, 5000)
    return () => clearInterval(changeSlide)
  }, [currentSlide, handleNav, isPlaying])

  return (
    <div className='carousel' ref={sizeRef}>
      <div
        {...swipeHandler}
        className='carousel__inner'
        style={{ width: carouselWidth * carouselData.length, marginLeft: carouselPosition }}
      >
        {renderItems(carouselData)}
      </div>
      <div className='carousel__nav'>{renderNav(carouselData)}</div>
    </div>
  )
}
