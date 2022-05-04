/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import DashboardLayout from '../../components/admin/layout'
import { useWallet } from '@saberhq/use-solana'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  getAllTradeVaults,
  getVaultAmount,
  initMolanaProgram,
  claimProfit,
  checkWalletATA
} from '../../integration/molana-integration'
import { config } from '../../constants/config'
import * as anchor from '@project-serum/anchor'
import { Card, Space, Table } from 'antd'
import { printlog, printloginfo, showErrorToast, showInfoToast, showSuccessToast } from '../../functions/utils'
import { globalMessage } from '../../constants/locales/locales'
import { PublicKey } from '@solana/web3.js'

const TradeVaultsPage = () => {
  const { connected, connection, wallet } = useWallet()
  const router = useRouter()
  const [tradeVaults, setTadeVaults] = useState<any[]>([])
  const [loaded, setLoading] = useState(false)
  const [curPage, setCurPage] = useState(1)
  const { Column } = Table
  const PAGE_SIZE = 10

  const onClaimProfit = async (tradeTreasury: PublicKey) => {
    if (!connected) showInfoToast(globalMessage.check_wallet_connection)
    try {
      claimProfit(tradeTreasury).then(async (res) => {
        if (res.success) {
          showSuccessToast(res.msg)
        } else {
          showErrorToast(res.msg)
        }
      })
    } catch (e) {
      console.log(e)
      showErrorToast(globalMessage.error_occured)
    }
  }

  useEffect(() => {
    if (connected) {
      initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
      try {
        setLoading(true)
        getAllTradeVaults().then(async (data) => {
          const tradeVaultsData: any[] = []
          setLoading(false)
          if (data === null) {
            printloginfo('loaded trade vaults data is null')
          } else {
            printlog('loaded trade vaults data', data)
            data.map((item, i) => {
              getVaultAmount(item.account.tradeVault).then(async (val) => {
                const tempItem = {
                  key: i,
                  mint: item.account.tradeMint.toBase58(),
                  vault: item.account.tradeVault.toBase58(),
                  balance: item.account.balance.toNumber(),
                  decimal: item.account.decimals,
                  profit: val - item.account.balance.toNumber(),
                  tradeTreasury: item.publicKey
                }
                tradeVaultsData.push(tempItem)
                if (data.length == tradeVaultsData.length) {
                  setTadeVaults(tradeVaultsData)
                }
              })
            })
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  }, [connected, connection, wallet, router])

  const onPageChange = (page: number) => {
    setCurPage(page)
  }

  return (
    <Card title='TradeVaults'>
      <Table
        dataSource={tradeVaults}
        loading={loaded}
        rowKey={(record) => record.key}
        scroll={{ x: 1500 }}
        pagination={{ onChange: onPageChange, current: curPage, total: tradeVaults.length, pageSize: PAGE_SIZE }}
      >
        <Column title='Mint' dataIndex='mint' key='mint' responsive={['md']} />
        <Column title='Vault' dataIndex='vault' key='vault' responsive={['md']} />
        <Column title='Balance' dataIndex='balance' key='balance' />
        <Column title='Profit' dataIndex='profit' key='profit' />
        <Column title='Decimal' dataIndex='decimal' key='decimal' />
        <Column className='display-none' dataIndex='tradeTreasury' key='tradeTreasury' />
        <Column
          title='Action'
          key='action'
          render={(text, record: any) => (
            <Space size='middle'>
              <a
                onClick={() => {
                  onClaimProfit(record.tradeTreasury)
                }}
              >
                Claim
              </a>
            </Space>
          )}
        />
      </Table>
    </Card>
  )
}

TradeVaultsPage.Layout = DashboardLayout

export default TradeVaultsPage
