import type { NextApiRequest, NextApiResponse } from 'next'

import { refreshNfts } from '../../../functions/db'
import { getTokensByPubKey } from '../../../functions/nftItegration'
import { IOfferData } from '../../../@types/IOfferData'
import { nftSources } from '../../../constants/config'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      res.status(200).json({ success: true })
      await getNfts()
    } catch (e) {
      console.log(e)
      res.status(500).json({ statusCode: 500, message: (<Error>e).message })
    }
  } else {
    res.status(405).end('Method Not Allowed')
  }
}

const getNfts = async () => {
  const nfts: IOfferData[] = []

  for (const source of nftSources) {
    const tokens = await getTokensByPubKey(source)

    if (tokens) {
      nfts.push(...tokens)
    }

    console.log(`Finished refreshing NFTs for: ${source}`)
  }

  await refreshNfts(nfts)
}

export default handler
