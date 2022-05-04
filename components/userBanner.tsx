import React, { useState, useEffect } from 'react'
import { ConnectWalletButton } from '@gokiprotocol/walletkit'
import { useConnectedWallet, useSolana } from '@saberhq/use-solana'
import axios from 'axios'

import { VisibilityButton } from './visibilityButton'
import { ClipboardButton } from './clipboardButton'

import { userBannerLocales, globalLocales } from '../constants/locales/locales'
import { IUserData } from '../@types/nftApi'
interface UserBannerProps {
  classNames?: string
}

export const UserBanner: React.FC<UserBannerProps> = ({ classNames }: UserBannerProps) => {
  const { disconnect } = useSolana()
  const [apiData, setData] = useState({} as IUserData)
  const [dataState, setDataState] = useState(false)
  const wallet = useConnectedWallet()
  const [toggle, setToggle] = useState(false)

  const setVisibility = () => setToggle(!toggle)

  useEffect(() => {
    const fetchData = async () => {
      if (wallet && wallet.publicKey) {
        const data = (await axios.get(`/api/user/${wallet.publicKey.toString()}`)).data as IUserData

        setData(data)
        setDataState(true)
      }
    }

    fetchData()
  }, [wallet])

  return (
    <div className={`user-banner ${classNames}`}>
      {!(wallet && wallet.publicKey) ? (
        <ConnectWalletButton className='btn btn--sm user-banner__verify-btn' />
      ) : !dataState ? (
        <span>{globalLocales.loading}</span>
      ) : (
        <>
          <VisibilityButton
            visible={toggle}
            setVisibility={() => setVisibility()}
            classNames={`user-banner__toggle ${toggle ? 'icon--toggle' : ''}`}
          />
          <div className='user-banner__info'>
            <span className='user-banner__info__user-name'>
              {userBannerLocales.welcome}, <span>{apiData.userName}</span>
            </span>
            <div className={`user-banner__container ${toggle ? 'toggle' : ''}`}>
              <span className='unloc-id user-banner__info__unloc-id'>
                {globalLocales.unlocId}
                <span className='mobile--hidden'>: #{wallet.publicKey.toString()}</span>
                <ClipboardButton data={wallet.publicKey.toString()} classNames='user-banner__clipboard-icon' />
              </span>
              <span className='user-banner__info__wallet-status'>
                {userBannerLocales.walletStatus}:{' '}
                <span>{apiData.verified ? userBannerLocales.verified : userBannerLocales.unverified}</span>
              </span>
            </div>
          </div>
          <div className={`user-banner__buttons ${toggle ? 'toggle' : ''}`}>
            <button className='btn btn--sm btn--magenta'>{userBannerLocales.btnBorrrow}</button>
            <button className='btn btn--sm btn--blue'>{userBannerLocales.btnSell}</button>
            <button className='btn btn--sm btn--light'>{userBannerLocales.btnSettings}</button>
            <button className='btn btn--sm btn--dark' onClick={() => disconnect()}>
              {userBannerLocales.btnDisconnect}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
