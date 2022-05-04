import Redis from 'ioredis'

import { config } from '../constants/config'
import { filterLocales } from '../constants/locales/locales'

import { IOfferData } from '../@types/IOfferData'

const client = new Redis(process.env.REDIS_URL)

export const getFilteredFieldsFromHashMap = async (
  filters: Record<string, string | string[] | undefined>
): Promise<IOfferData[]> => {
  const records: Record<string, string> = await getHashMap('nfts')

  if (Object.keys(records).length === 0) {
    return []
  }

  let nfts: IOfferData[] = []

  for (const i in records) {
    nfts = nfts.concat(
      JSON.parse(records[i]).filter((nft: IOfferData) => {
        let result = false

        if (filters.collections) {
          const collections =
            typeof filters.collections === 'string'
              ? decodeURIComponent(filters.collections)
              : filters.collections.map((c) => decodeURIComponent(c))
          const collection = nft.metadata.arweaveMetadata.collection
          result =
            result ||
            (collection
              ? typeof collection === 'string'
                ? collections.includes(collection)
                : collections.includes(collection.name)
              : collections.includes(filterLocales.none))
        } else {
          result = true
        }

        return result
      })
    )
  }

  return nfts
}

export const getRecord = async (key: string): Promise<string | null> => {
  return await client.get(key)
}

export const getCollections = async (): Promise<string[]> => {
  const records = await getHashMap('nfts')
  const collections: Record<string, number> = {}

  for (const i in records) {
    const nfts: IOfferData[] = JSON.parse(records[i])

    for (const nft of nfts) {
      const collection = nft.metadata.arweaveMetadata.collection
      let collectionName = ''

      if (typeof collection === 'string') {
        collectionName = collection
      } else if (collection) {
        collectionName = collection.name
      } else {
        collectionName = 'None'
      }

      if (!collections[collectionName]) {
        collections[collectionName] = 1
      } else {
        collections[collectionName]++
      }
    }
  }

  return Object.entries(collections).map(([key, value]) => `${key} (${value})`)
}

export const setHashMapBulk = async (key: string, values: Record<string, string>): Promise<void> => {
  await client.hmset(key, values)
}

export const getHashMap = async (key: string): Promise<Record<string, string>> => {
  return await client.hgetall(key)
}

export const getHashMapField = async (key: string, field: string): Promise<string | null> => {
  return client.hget(key, field)
}

export const refreshNfts = async (nfts: IOfferData[]): Promise<void> => {
  const retrievedHashMap: Record<string, string> = await getHashMap('nfts')
  let retrieved: IOfferData[] = []

  for (const i in retrievedHashMap) {
    retrieved = retrieved.concat(JSON.parse(retrievedHashMap[i]))
  }

  const mints = new Set(retrieved.map((nft) => nft.mint))
  const records: IOfferData[] = [...retrieved, ...nfts.filter((nft) => !mints.has(nft.mint))]
  const recordsHashMap: Record<string, string> = {}

  for (let i = 0; i < Math.ceil(records.length / config.nftBulkMax); i++) {
    recordsHashMap[`batch_${i}`] = JSON.stringify(records.slice(i * config.nftBulkMax, (i + 1) * config.nftBulkMax))
  }

  setHashMapBulk('nfts', recordsHashMap)
}
