import type { NextApiRequest, NextApiResponse } from 'next'
import { getFilteredFieldsFromHashMap } from '../../../functions/db'

import { IOfferData } from '../../../@types/IOfferData'

interface QueryParams {
  page: string
  show: string
  validation?: string | string[]
  transactionType?: string | string[]
  collections?: string | string[]
  availability?: string | string[]
}

interface IResponseData {
  nfts: IOfferData[]
  pages: number
}

const handler = async (req: NextApiRequest, res: NextApiResponse<IResponseData>) => {
  if (req.method === 'POST') {
    const { page, show, validation, transactionType, collections, availability } = req.query as unknown as QueryParams

    const filters = {
      validation: validation,
      transactionType: transactionType,
      collections: collections,
      availability: availability
    }

    const records = await getFilteredFieldsFromHashMap(filters)

    res.status(200).json({
      nfts: records.slice((parseInt(page) - 1) * parseInt(show), parseInt(page) * parseInt(show)),
      pages: Math.ceil(records.length / parseInt(show))
    })
  } else {
    res.end(404)
  }
}

export default handler
