import type { NextApiRequest, NextApiResponse } from 'next'

import { IUserData } from '../../../@types/nftApi'

const data: IUserData = {
  verified: false,
  userName: 'UserName'
}

const handler = (req: NextApiRequest, res: NextApiResponse<IUserData>) => {
  const { id } = req.query

  if (req.method === 'GET') {
    console.log(id)
    res.status(200).json(data)
  } else {
    res.end(404)
  }
}

export default handler
