import * as anchor from '@project-serum/anchor'
import { bool, publicKey, struct, u32, u64, u8 } from '@project-serum/borsh'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { DepositTxState, Network, ProviderType, WithdrawTxState } from './molana-integration'

export const getTokenAccount = async (connection: anchor.web3.Connection, address: anchor.web3.PublicKey) => {
  const data = await loadAccount(connection, address, TOKEN_PROGRAM_ID)
  const parsed = ACCOUNT_LAYOUT.decode(data)
  return parsed
}

export const getChainType = (chainType: string) => {
  if (chainType === 'Eth') {
    return Network.Eth
  } else {
    return Network.Bsc
  }
}

export const getChainTypeStr = (chainType: any) => {
  if (chainType.eth) {
    return 'Eth'
  } else {
    return 'Bsc'
  }
}

export const getProviderType = (providerType: string) => {
  if (providerType === 'Human') {
    return ProviderType.Human
  } else if (providerType === 'Bot') {
    return ProviderType.Bot
  } else {
    return ProviderType.Platform
  }
}

export const getProviderTypeStr = (providerType: any) => {
  if (providerType.human) {
    return 'Human'
  } else if (providerType.bot) {
    return 'Bot'
  } else {
    return 'Platform'
  }
}

export const getDepositeStatus = (status: string) => {
  if (status === 'Initialized') {
    return DepositTxState.Initialized
  } else if (status === 'NotArrived') {
    return DepositTxState.NotArrived
  } else if (status == 'Arrived') {
    return DepositTxState.Arrived
  }
  else if (status == 'Sent') {
    return DepositTxState.Sent
  }
  else if (status == 'Supplied') {
    return DepositTxState.Supplied
  }
  else {
    return DepositTxState.Pending
  }
}

export const getWithdrawStatus = (status: string) => {
  if (status === 'Initialized') {
    return WithdrawTxState.Initialized
  } else if (status === 'RequestedAndBurned') {
    return WithdrawTxState.RequestedAndBurned
  } else if (status == 'Pending') {
    return WithdrawTxState.Pending
  }
  else if (status == 'Wrong') {
    return WithdrawTxState.Wrong
  }
  else {
    return WithdrawTxState.Completed
  }
}

async function loadAccount(
  connection: anchor.web3.Connection,
  address: anchor.web3.PublicKey,
  programId: anchor.web3.PublicKey
): Promise<Buffer> {
  const accountInfo = await connection.getAccountInfo(address)
  if (accountInfo === null) {
    throw new Error('Failed to find account')
  }

  if (!accountInfo.owner.equals(programId)) {
    throw new Error(`Invalid owner: ${JSON.stringify(accountInfo.owner)}`)
  }

  return Buffer.from(accountInfo.data)
}

// https://github.com/solana-labs/solana-program-library/blob/master/token/js/client/token.js#L210
export const ACCOUNT_LAYOUT = struct([
  publicKey('mint'),
  publicKey('owner'),
  u64('amount'),
  u32('delegateOption'),
  publicKey('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKey('closeAuthority')
])

export const MINT_LAYOUT = struct([
  u32('mintAuthorityOption'),
  publicKey('mintAuthority'),
  u64('supply'),
  u8('decimals'),
  bool('initialized'),
  u32('freezeAuthorityOption'),
  publicKey('freezeAuthority')
])
