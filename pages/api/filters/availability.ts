import type { NextApiRequest, NextApiResponse } from 'next'

const data: string[] = ['Available', 'Not available']

const handler = (req: NextApiRequest, res: NextApiResponse<string[]>) => {
  if (req.method === 'POST') {
    res.status(200).json(data)
  } else {
    res.end(404)
  }
}

export default handler
