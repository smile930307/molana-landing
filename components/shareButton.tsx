import React, { useState } from 'react'

import { globalLocales } from '../constants/locales/locales'

interface ShareButtonProps {
  url: string
  classNames?: string
}

export const ShareButton: React.FC<ShareButtonProps> = ({ url, classNames }: ShareButtonProps) => {
  const [visible, setVisible] = useState(false)

  const shareFB = () => {
    const fbURL = new URL('https://www.facebook.com/sharer.php')
    const params = new URLSearchParams()
    params.append('u', url)
    fbURL.search = params.toString()
    setVisible(false)
    window.open(fbURL, '_blank')?.focus()
  }

  const shareTwitter = () => {
    const twitterURL = new URL('https://twitter.com/share')
    const params = new URLSearchParams()
    params.append('url', url)
    twitterURL.search = params.toString()
    setVisible(false)
    window.open(twitterURL, '_blank')?.focus()
  }

  const shareClipboard = () => {
    setVisible(true)
    navigator.clipboard.writeText(url)
    setVisible(false)
  }

  return (
    <button className={`btn btn--md btn--light ${classNames}`} onClick={() => setVisible(!visible)}>
      <i className='icon icon--sm icon--share'></i> <span>{globalLocales.share}</span>
      <div className={`popup popup--share ${visible ? '' : 'hidden'}`}>
        <i className='icon icon--md icon--fb' onClick={() => shareFB()}></i>
        <i className='icon icon--md icon--twitter' onClick={() => shareTwitter()}></i>
        <i className='icon icon--md icon--share--light' onClick={() => shareClipboard()}></i>
      </div>
    </button>
  )
}
