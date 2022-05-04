import type { NextApiRequest, NextApiResponse } from 'next'
import { Keypair, PublicKey } from '@solana/web3.js'
import {
  DepositTxState,
  setDepositState,
  initMolanaProgram,
  SOLANA_CONNECTION
} from '../../../integration/molana-integration'
import { config } from '../../../constants/config'
import * as anchor from '@project-serum/anchor'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string
  if (req.method === 'POST') {
    if (!id || !req.body.deposit_router || !req.body.state || !req.body.amount) {
      res.end(404)
      return
    }
    console.log(req.body)
    const stateChekerKeyStr: string = process.env.STATE_CHECKER as any
    const stateChecker = Keypair.fromSecretKey(bs58.decode(stateChekerKeyStr))
    const stateCheckerPublicKey = stateChecker.publicKey
    const statecheckerWallet = new NodeWallet(stateChecker)
    initMolanaProgram(SOLANA_CONNECTION, statecheckerWallet, new anchor.web3.PublicKey(config.molanaPid))
    await setDepositState(
      req.body.state,
      new anchor.BN(req.body.amount),
      new anchor.web3.PublicKey(req.body.deposit_router),
      stateCheckerPublicKey,
      [stateChecker]
    ).then((r) => {
      if (r.success) {
        res.status(200).json({ success: true, msg: 'success' })
      } else {
        res.status(200).json({ success: false, msg: r.msg })
      }
    })
  } else {
    res.end(404)
  }
}

export default handler
