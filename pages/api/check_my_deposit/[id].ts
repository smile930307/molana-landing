import type { NextApiRequest, NextApiResponse } from 'next'
import { Keypair, PublicKey } from '@solana/web3.js'
import {
  DepositTxState,
  getDepositRouterIdByTx,
  initMolanaProgram,
  setDepositState
} from '../../../integration/molana-integration'
import { config } from '../../../constants/config'
import { useWallet } from '@saberhq/use-solana'
import * as anchor from '@project-serum/anchor'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const { connected, connection, wallet } = useWallet()
  const id = req.query.id as string
  if (req.method === 'POST') {
    if (!id) {
      res.end(404)
      return
    }
    console.log(id)
    const stateChekerKeyStr: string = process.env.STATE_CHECKER as any
    const stateChecker = Keypair.fromSecretKey(bs58.decode(stateChekerKeyStr))
    console.log('state checker pubkey = ', stateChecker.publicKey.toBase58())

    // initMolanaProgram(SOLANA_CONNECTION, stateChecker, new anchor.web3.PublicKey(config.molanaPid))

    // setDepositState(DepositTxState.Arrived, new anchor.BN(10000), new anchor.web3.PublicKey(req.body.address)).then(
    //   (r) => {
    //     if (r.success) {
    //       res.status(200).json({ success: true })
    //     } else {
    //       res.status(200).json({ success: false })
    //     }
    //   }
    // )
    // })
    res.status(200).json({ success: true, msg: 'success' })
  } else {
    res.end(404)
  }
}

export default handler
