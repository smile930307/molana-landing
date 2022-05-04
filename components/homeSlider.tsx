import React, { Component } from 'react'
import Slider from 'react-slick'

export default class HomeSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      nextArrow: <div></div>,
      prevArrow: <div></div>
    }

    return (
      <div>
        <h2> Single Item</h2>
        <Slider {...settings}>
          <div>
            <h3>1</h3>
            <span>
              skldfjlsjdfklsjdflksjkfjsldfjskldj skldfjlsjdfklsjdflksjkfjsldfjskldjsdfsdfs
              skldfjlsjdfklsjdflksjkfjsldfjskldjsdfsdfds sdfsdfs
            </span>
          </div>
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
        </Slider>
      </div>
    )
  }
}
