import React from 'react'
import Image from 'next/image'

interface SolanaExplorerButtonProps {
  address: string
  classNames?: string
}

export const SolanaExplorerButton: React.FC<SolanaExplorerButtonProps> = ({
  address,
  classNames
}: SolanaExplorerButtonProps) => {
  const handleOnClick = () => {
    window.open(`https://explorer.solana.com/address/${address}`, '_blank')?.focus()
  }

  return (
    <button
      className={`btn btn--solana-explorer btn--light btn--rounded ${classNames}`}
      onClick={() => handleOnClick()}
    >
      See more on <Image src='/common/solana-explorer.svg' width={270} height={29} alt='Solana Explorer' />
    </button>
  )
}
