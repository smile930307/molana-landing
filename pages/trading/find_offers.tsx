/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWallet } from '@saberhq/use-solana'
import TradingLayout from '../../components/trading/layout'
import { Table, Card, Select, Space, notification } from 'antd'
import { useEffect, useState } from 'react'
import * as anchor from '@project-serum/anchor'
import {
  getAllEthBscOffers,
  getAllSolEthOffers,
  getAllSolOffers,
  initMolanaProgram
} from '../../integration/molana-integration'
import Link from 'next/link'
import { printlog } from '../../functions/utils'
import { config } from '../../constants/config'
import { getProviderTypeStr } from '../../integration/utils'

const FindOffersPage = () => {
  const PAGE_SIZE = 10
  const [offer_type, setOfferType] = useState<string>('1')
  const [offersData, setOffersData] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const [curPage, setCurPage] = useState(1)
  const { Option } = Select
  const { Column } = Table
  const { connected, connection, wallet } = useWallet()

  const onPageChange = (page: number) => {
    setCurPage(page)
  }

  useEffect(() => {
    if (connected && wallet && wallet.publicKey) {
      try {
        initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        setLoaded(true)
        if (offer_type == '1') {
          getAllSolOffers().then(async (data) => {
            printlog('searched offers', data)
            setLoaded(false)
            if (data === null) {
              notification.success({
                message: 'Notification',
                description: 'No result'
              })
            } else {
              const offersList = Array<any>()
              data.map((item, i) => {
                const tempItem: any = {
                  key: i,
                  volume: '-',
                  speed: '-',
                  provider: getProviderTypeStr(item.account.providerType),
                  sell_rate: item.account.sellRatio.toString(),
                  buy_rate: item.account.buyRatio.toString(),
                  sell: 0,
                  buy: 0,
                  offer_id: item.publicKey.toBase58(),
                  owner: item.account.owner.toBase58()
                }
                offersList.push(tempItem)
              })
              setOffersData(offersList)
            }
          })
        } else if (offer_type == '2') {
          getAllSolEthOffers().then(async (data) => {
            printlog('searched offers', data)
            setLoaded(false)
            if (data === null) {
              notification.success({
                message: 'Notification',
                description: 'No result'
              })
            } else {
              const offersList = Array<any>()
              data.map((item, i) => {
                const tempItem: any = {
                  key: i,
                  volume: '-',
                  speed: '-',
                  provider: getProviderTypeStr(item.account.providerType),
                  sell_rate: item.account.sellRatio.toNumber(),
                  buy_rate: item.account.buyRatio.toNumber(),
                  sell: 0,
                  buy: 0,
                  offer_id: item.publicKey.toBase58(),
                  owner: item.account.owner.toBase58()
                }
                offersList.push(tempItem)
              })
              setOffersData(offersList)
            }
          })
        } else {
          getAllEthBscOffers().then(async (data) => {
            printlog('searched offers', data)
            setLoaded(false)
            if (data === null) {
              notification.success({
                message: 'Notification',
                description: 'No result'
              })
            } else {
              const offersList = Array<any>()
              data.map((item, i) => {
                const tempItem: any = {
                  key: i,
                  volume: '-',
                  speed: '-',
                  provider: getProviderTypeStr(item.account.providerType),
                  sell_rate: item.account.sellRatio.toNumber(),
                  buy_rate: item.account.buyRatio.toNumber(),
                  sell: 0,
                  buy: 0,
                  offer_id: item.publicKey.toBase58(),
                  owner: item.account.owner.toBase58()
                }
                offersList.push(tempItem)
              })
              setOffersData(offersList)
            }
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [offer_type, connected, wallet])

  return (
    <Card
      title='Finder Offer'
      extra={
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder='Offer Type'
          optionFilterProp='children'
          value={offer_type}
          onSelect={(value: string) => {
            setOfferType(value)
          }}
        >
          <Option value='1'>Solana &lt;-&gt; Solana</Option>
          <Option value='2'>Solana &lt;-&gt; Other</Option>
          <Option value='3'>Other &lt;-&gt; Other</Option>
          {/* <Option value='4'>Payoneer</Option> */}
        </Select>
      }
    >
      <Table
        dataSource={offersData}
        loading={loaded}
        rowKey={(record) => record.key}
        pagination={{ onChange: onPageChange, current: curPage, total: offersData.length, pageSize: PAGE_SIZE }}
      >
        <Column title='Owner' dataIndex='owner' key='owner' />
        <Column title='Volume' dataIndex='volume' key='volume' />
        <Column title='Speed' dataIndex='speed' key='speed' />
        <Column title='Provider' dataIndex='provider' key='provider' />
        <Column title='Rate' dataIndex='rate' key='rate' />
        <Column title='Reserved' dataIndex='reserved' key='reserved' />
        <Column title='OfferId' dataIndex='offer_id' key='offer_id' className='display-none' />
        <Column
          title='Action'
          key='action'
          render={(record: any) => (
            <Space size='middle'>
              <Link href={'/trading/my_cur_trading/' + record.offer_id + '?offerType=' + offer_type}>
                <a>Apply</a>
              </Link>
            </Space>
          )}
        />
      </Table>
    </Card>
  )
}

FindOffersPage.Layout = TradingLayout

export default FindOffersPage
