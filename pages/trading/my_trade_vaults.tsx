/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWallet } from '@saberhq/use-solana'
import { InputNumber, Modal, Space, Table, Card } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import TradingLayout from '../../components/trading/layout'
import * as anchor from '@project-serum/anchor'
import {
  checkWalletATA,
  CURRENCY_DECIMALS,
  depositTradeToken,
  getAllTradeVaults,
  getUserTreasuryByOwner,
  initMolanaProgram,
  withdrawTradeToken
} from '../../integration/molana-integration'
import { config } from '../../constants/config'
import { printlog, showErrorToast, showInfoToast, showSuccessToast } from '../../functions/utils'
import { globalMessage } from '../../constants/locales/locales'

// TODO: Add a table for NFT data
const MyTradeVaultsPage = () => {
  // const { connected } = useWallet()
  const PAGE_SIZE = 10
  const { connected, connection, wallet } = useWallet()
  const router = useRouter()
  const [tradeVaults, setTadeVaults] = useState<any[]>([])
  const [refresh, setRefresh] = useState<boolean>(false)
  const [loaded, setLoaded] = useState(false)
  const [curPage, setCurPage] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState(1)

  const [selectTokenAddress, setSelectTokenAddress] = useState<string>('')
  const [amtValue, setAmountValue] = useState<number>(1)

  const { Column } = Table

  const onChange = (page: number) => {
    console.log(page)
    setCurPage(page)
  }

  const onInputAmountChange = (amt: number) => {
    setAmountValue(amt)
  }

  const showModal = (tokenAddr: string) => {
    setSelectTokenAddress(tokenAddr)
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    setIsModalVisible(false)
    if (!connected) {
      showInfoToast(globalMessage.check_wallet_connection)
      return
    }
    if (modalType == 1) {
      try {
        const userTadeVault = await checkWalletATA(selectTokenAddress)
        if (userTadeVault) {
          printlog('deposit amt', amtValue)
          depositTradeToken(
            new anchor.BN(amtValue * Math.pow(10, CURRENCY_DECIMALS)),
            new anchor.web3.PublicKey(selectTokenAddress),
            new anchor.web3.PublicKey(userTadeVault)
          ).then((val) => {
            if (val.success) {
              showSuccessToast(val.msg)
              setRefresh(!refresh)
            } else {
              showErrorToast(val.msg)
            }
          })
        } else {
          showErrorToast(globalMessage.need_to_create_trade_vault)
        }
      } catch (e) {
        printlog('deposit token exception->', e)
        showErrorToast(globalMessage.error_occured)
      }
    } else {
      try {
        const userTadeVault = await checkWalletATA(selectTokenAddress)
        if (userTadeVault) {
          withdrawTradeToken(
            new anchor.BN(amtValue),
            new anchor.web3.PublicKey(selectTokenAddress),
            new anchor.web3.PublicKey(userTadeVault)
          ).then((val) => {
            if (val.success) {
              showSuccessToast(val.msg)
              setRefresh(!refresh)
            } else {
              showErrorToast(val.msg)
            }
          })
        } else {
          showErrorToast(globalMessage.need_to_create_trade_vault)
        }
      } catch (e) {
        printlog('withdraw token exception->', e)
        showErrorToast(globalMessage.error_occured)
      }
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    if (connected && wallet && wallet.publicKey) {
      try {
        initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        const call = async () => {
          let treasuries = Array<any>()
          if (wallet.publicKey != null) {
            // treasuries = await getAllUserTreasuries()
            treasuries = await getUserTreasuryByOwner(wallet.publicKey)
          }
          printlog('my treasuries', treasuries)
          treasuries.map((treasury) => {
            console.log('each treasury balance', treasury.account.balance.toNumber())
          })
          setLoaded(true)
          getAllTradeVaults().then(async (data) => {
            setLoaded(false)
            if (data === null) {
              console.log('tradeVaults is null')
            } else {
              printlog('all tradeVaults', data)
              const tradeVaultsData = Array<any>()
              data.map((item, i) => {
                if (wallet && wallet.publicKey) {
                  const tempItem: any = {
                    key: i,
                    symbol: 'USDC',
                    mint: item.account.tradeMint.toBase58(),
                    balance: 0,
                    locked: 0,
                    unlock_time: 0
                  }
                  treasuries.map((treasury) => {
                    if (item.account.tradeMint.toBase58() == treasury.account.tradeMint.toBase58()) {
                      tempItem.balance = treasury.account.balance.toNumber()
                      tempItem.locked = treasury.account.lockedBalance.toNumber()
                      tempItem.unlock_time = treasury.account.unlockTime.toNumber()
                    }
                  })
                  tradeVaultsData.push(tempItem)
                  console.log('item balance', tempItem.balance)
                }
              })
              setTadeVaults(tradeVaultsData)
            }
          })
        }
        call()
      } catch (e) {
        console.log(e)
      }
    }
  }, [connected, refresh])

  return (
    <Card title='Trade Vaults'>
      <Table
        dataSource={tradeVaults}
        loading={loaded}
        rowKey={(record) => record.key}
        pagination={{ onChange: onChange, current: curPage, total: tradeVaults.length, pageSize: PAGE_SIZE }}
      >
        <Column title='Symbol' dataIndex='symbol' key='symbol' />
        <Column title='Mint' dataIndex='mint' key='mint' />
        <Column title='Balance' dataIndex='balance' key='balance' sorter={(a: any, b) => a.balance - b.balance} />
        <Column title='Locked' dataIndex='locked' key='locked' sorter={(a: any, b) => a.locked - b.locked} />
        <Column
          title='Unlock time'
          dataIndex='unlock_time'
          key='unlock_time'
          sorter={(a: any, b) => a.unlock_time - b.unlock_time}
        />
        <Column
          title='Action'
          key='action'
          render={(text, record: any) => (
            <Space size='middle'>
              <a
                onClick={() => {
                  setModalType(1)
                  showModal(record.mint)
                }}
              >
                Deposit
              </a>
              <a
                onClick={() => {
                  setModalType(2)
                  showModal(record.mint)
                }}
              >
                Withdraw
              </a>
            </Space>
          )}
        />
      </Table>
      <Modal
        title={modalType == 1 ? 'Input Deposit' : 'Input Withdraw'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Please input the amount of deposit...</p>
        <InputNumber min={1} defaultValue={1} onChange={onInputAmountChange} />
      </Modal>
    </Card>
  )
}

MyTradeVaultsPage.Layout = TradingLayout

export default MyTradeVaultsPage
