import React from 'react'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'

interface GoTopButtonProps {
  classNames?: string
  visible?: boolean
}

export const GoTopButton: React.FC<GoTopButtonProps> = ({ visible, classNames }: GoTopButtonProps) => {
  return visible ? (
    <i
      className={`icon--caret--up icon icon--sm mobile--only  go-top-button ${classNames}`}
      onClick={() => {
        const sUsrAg = navigator.userAgent
        const target = document.getElementsByClassName('container')[0]
        if (sUsrAg.match(/(chrome|firefox|edg(?=\/))\/?\s*(\d+)/i)) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          scrollIntoView(target, { block: 'start' })
        }
      }}
    ></i>
  ) : (
    <></>
  )
}
