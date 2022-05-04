import React from 'react'
import { communityBanner } from '../constants/locales/locales'
interface CommunityBannerProps {
  classNames?: string
}

export const CommunityBanner: React.FC<CommunityBannerProps> = ({ classNames }: CommunityBannerProps) => {
  return (
    <div className={`community-banner ${classNames}`}>
      <div className='community-banner__header'>
        <span>{communityBanner.smallTitle}</span>
        <span>{communityBanner.bigTitle}</span>
      </div>
      <div className='community-banner__buttons'>
        <a
          href={communityBanner.discordHref}
          className='btn btn--bold btn--white btn--sm community-banner__buttons__btn'
        >
          <i className='icon--discord icon--vs'></i>
          <span>{communityBanner.discord}</span>
        </a>
        <a
          href={communityBanner.telegramHref}
          className='btn btn--bold btn--white btn--sm community-banner__buttons__btn'
        >
          <i className='icon--telegram icon--vs'></i>
          <span>{communityBanner.telegram}</span>
        </a>
        <a
          href={communityBanner.twitterHref}
          className='btn btn--bold btn--white btn--sm community-banner__buttons__btn'
        >
          <i className='icon--twitter--small icon--vs'></i>
          <span>{communityBanner.twitter}</span>
        </a>
      </div>
    </div>
  )
}
