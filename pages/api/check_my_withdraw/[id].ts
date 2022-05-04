import type { NextApiRequest, NextApiResponse } from 'next'
import { PublicKey } from '@solana/web3.js'
import { setDepositState, setWithdrawState } from '../../../integration/molana-integration'
import { BN } from '@project-serum/anchor'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string
  if (req.method === 'POST') {
    if (!id || !req.body.address || !req.body.state || !req.body.amount) {
      res.end(404)
      return
    }
    const publicKey = new PublicKey(req.body.address)
    setWithdrawState(req.body.state, new BN(req.body.amount), publicKey).then((r) => {
      if (r.success) {
        res.status(200).json({ success: true })
      } else {
        res.status(200).json({ success: false })
      }
    })
  } else {
    res.end(404)
  }
}

export default handler
