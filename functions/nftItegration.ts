import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey } from '@solana/web3.js'
import { Edition, MasterEdition, Metadata, MetadataKey } from '@metaplex-foundation/mpl-token-metadata'
import axios from 'axios'

import { IMetadata, IMasterEdition, IOfferData } from '../@types/IOfferData'

// Uncomment next line if using Solana cluster
// const cluster = clusterApiUrl(process.env.SOLANA_NET as Cluster

const SOLANA_CONNECTION = new Connection(process.env.RPC_ENDPOINT as string, {
  disableRetryOnRateLimit: true
})

export const getMetadata = async (mint: PublicKey): Promise<IMetadata> => {
  const metadataPDA = await Metadata.getPDA(mint)
  const { data: metadata } = await Metadata.load(SOLANA_CONNECTION, metadataPDA)

  const arweaveMetadata = (await axios.get(metadata.data.uri)).data

  return {
    metadataPDA: metadataPDA.toString(),
    onChainMetadata: metadata,
    arweaveMetadata
  }
}

export const getMasterEdition = async (mint: PublicKey): Promise<IMasterEdition | null> => {
  const masterEditionPDA = await Edition.getPDA(mint)
  const editionAccountInfo = await SOLANA_CONNECTION.getAccountInfo(masterEditionPDA)

  if (editionAccountInfo) {
    const key = editionAccountInfo?.data[0]
    let masterEditionData
    let data

    switch (key) {
      case MetadataKey.MasterEditionV1:
      case MetadataKey.MasterEditionV2:
        ;({ data } = new MasterEdition(masterEditionPDA, editionAccountInfo))
        masterEditionData = data
        break
      default:
        masterEditionData = undefined
        break
    }

    return {
      masterEditionPDA: masterEditionPDA.toString(),
      masterEditionData
    }
  }

  return null
}

export const getHistory = async (mint: PublicKey, options: Record<string, string | number>) => {
  return SOLANA_CONNECTION.getConfirmedSignaturesForAddress2(mint, options)
}

export const getTokensByPubKey = async (user: string): Promise<IOfferData[]> => {
  const USER_PUBKEY = new PublicKey(user)
  const { value: tokens } = await SOLANA_CONNECTION.getParsedTokenAccountsByOwner(USER_PUBKEY, {
    programId: TOKEN_PROGRAM_ID
  })
  const nfts: IOfferData[] = []

  const filteredTokens = tokens.filter((token) => {
    const { tokenAmount } = token.account.data.parsed.info
    return tokenAmount.decimals === 0
  })

  for (let i = 0; i < filteredTokens.length; i++) {
    try {
      const nft = {
        tokenAccount: filteredTokens[i].pubkey.toString(),
        mint: new PublicKey(filteredTokens[i].account.data.parsed.info.mint).toString(),
        metadata: await getMetadata(filteredTokens[i].account.data.parsed.info.mint),
        masterEdition: await getMasterEdition(filteredTokens[i].account.data.parsed.info.mint)
      }

      nfts.push(nft)
    } catch (e) {
      console.log(e)
      if ((<Error>e).message.includes('Unable to find account')) {
        continue
      }
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  return nfts
}
