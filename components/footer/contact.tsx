/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { pageFooter } from '../../constants/locales/locales'
import { showInfoToast, showSuccessToast } from '../../functions/utils'

const encode = (data: any) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

export const Contact = () => {
  const [email, setEmail] = useState<string>()
  const handleSubmit = (e: any) => {
    if (email) {
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'subscribe', email: email })
      })
        .then(() => showSuccessToast('Success'))
        .catch((error) => alert(error))
    } else {
      showInfoToast('Please input your email address')
    }
    e.preventDefault()
  }
  return (
    <div className='footer__form'>
      <form name='subscribe' onSubmit={handleSubmit}>
        <input
          type='email'
          style={{ width: '100%!important' }}
          name='email'
          onChange={(e: any) => {
            setEmail(e.target.value)
          }}
        />
        <button type='submit'>{pageFooter.subscribe}</button>
      </form>
    </div>
  )
}
