import type { NextApiRequest, NextApiResponse } from 'next'
import { PublicKey } from '@solana/web3.js'

import { getMetadata, getMasterEdition } from '../../../functions/nftItegration'
import { IOfferData } from '../../../@types/IOfferData'

const handler = async (req: NextApiRequest, res: NextApiResponse<IOfferData>) => {
  const id = req.query.id as string

  if (req.method === 'POST') {
    if (!id) {
      res.end(404)
      return
    }

    const publicKey = new PublicKey(id)
    const metadata = await getMetadata(publicKey)
    const masterEdition = await getMasterEdition(publicKey)

    const response: IOfferData = {
      tokenAccount: '',
      metadata,
      masterEdition,
      mint: id
    }

    res.status(200).json(response)
  } else {
    res.end(404)
  }
}

export default handler
