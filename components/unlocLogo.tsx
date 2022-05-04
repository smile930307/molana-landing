import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface UnlocLogoProps {
  classNames?: string
  logo?: 'light' | 'dark'
}
export const UnlocLogo: React.FC<UnlocLogoProps> = ({ classNames, logo }: UnlocLogoProps) => {
  return (
    <div className={`${classNames}`}>
      <Link href='/'>
        <a>
          {logo === 'light' ? (
            <Image src='/logo/top-logo.png' alt='Top Logo' width={350} height={60} />
          ) : (
            <Image src='/logo/bottom-logo.png' alt='Bottom Logo' width={350} height={60} />
          )}
        </a>
      </Link>
    </div>
  )
}
