import { useWallet } from '@saberhq/use-solana'
import TradingLayout from '../../components/trading/layout'
import { Table, Card, Select, Space } from 'antd'
import { useEffect, useState } from 'react'
import ColumnGroup from 'antd/lib/table/ColumnGroup'
import { useRouter } from 'next/router'
import {
  getEthBscOffersByOwner,
  getSolEthOffersByOwner,
  getSolOffersByOwner
} from '../../integration/molana-integration'
import Link from 'next/link'

// TODO: Add a table for NFT data
const MyOfferPage = () => {
  // const { connected } = useWallet()
  const [offer_type, setSortType] = useState<string>('1')
  const { Option } = Select
  const { Column } = Table

  const PAGE_SIZE = 10
  const { connected, wallet } = useWallet()
  const router = useRouter()
  const [offersData, setOffersData] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const [curPage, setCurPage] = useState(1)

  const onPageChange = (page: number, pageSize: number) => {
    console.log('dd')
    setCurPage(page)
  }

  useEffect(() => {
    if (connected && wallet && wallet.publicKey) {
      try {
        // getUserTreasuryByOwner(wallet.publicKey,0,10).then(async (data) => {
        setLoaded(true)
        if (offer_type == '1') {
          getSolOffersByOwner(wallet.publicKey).then(async (data) => {
            console.log('offerData', data)
            setLoaded(false)
            if (data === null) {
              console.log('offerData is null')
            } else {
              const offersList = Array<any>()
              data.map((item, i) => {
                const tempItem: any = {
                  key: i,
                  volume: '-',
                  speed: '-',
                  provider: 'Bot',
                  sell_rate: item.account.sellRatio.toString(),
                  buy_rate: item.account.buyRatio.toString(),
                  sell: 0,
                  buy: 0,
                  owner: item.publicKey.toBase58()
                }
                offersList.push(tempItem)
              })
              setOffersData(offersList)
            }
          })
        } else if (offer_type == '2') {
          getSolEthOffersByOwner(wallet.publicKey).then(async (data) => {
            console.log('offerData', data)
            setLoaded(false)
            if (data === null) {
              console.log('offerData is null')
            } else {
              const offersList = Array<any>()
              data.map((item, i) => {
                const tempItem: any = {
                  key: i,
                  volume: '-',
                  speed: '-',
                  provider: 'Bot',
                  sell_rate: item.account.sellRatio.toNumber(),
                  buy_rate: item.account.buyRatio.toNumber(),
                  sell: 0,
                  buy: 0,
                  owner: item.publicKey.toBase58()
                }
                offersList.push(tempItem)
              })
              setOffersData(offersList)
            }
          })
        } else {
          getEthBscOffersByOwner(wallet.publicKey).then(async (data) => {
            console.log('offerData', data)
            setLoaded(false)
            if (data === null) {
              console.log('offerData is null')
            } else {
              const offersList = Array<any>()
              data.map((item, i) => {
                const tempItem: any = {
                  key: i,
                  volume: '-',
                  speed: '-',
                  provider: 'Bot',
                  sell_rate: item.account.sellRatio.toNumber(),
                  buy_rate: item.account.buyRatio.toNumber(),
                  sell: 0,
                  buy: 0,
                  owner: item.publicKey.toBase58()
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
    } else {
      router.back()
    }
  }, [offer_type])

  return (
    <Card
      title='My Offer'
      extra={
        <Select
          showSearch
          value={offer_type}
          style={{ width: 200 }}
          placeholder='Offer Type'
          optionFilterProp='children'
          onSelect={(value: string) => {
            console.log('selected value->', value)
            setSortType(value)
          }}
        >
          <Option value='1'>Solana &lt;-&gt; Solana</Option>
          <Option value='2'>Solana &lt;-&gt; Other</Option>
          <Option value='3'>Other &lt;-&gt; Other</Option>
        </Select>
      }
    >
      <Table
        dataSource={offersData}
        loading={loaded}
        rowKey={(record) => record.key}
        pagination={{ onChange: onPageChange, current: curPage, total: offersData.length, pageSize: PAGE_SIZE }}
      >
        <Column title='Volume' dataIndex='volume' key='volume' />
        <Column title='Speed' dataIndex='speed' key='speed' />
        <Column title='Provider' dataIndex='provider' key='provider' />
        <Column title='Sell Rate' dataIndex='sell_rate' key='sell_rate' />
        <Column title='Buy Rate' dataIndex='buy_rate' key='buy_rate' />
        <ColumnGroup title='Reserved'>
          <Column title='Sell' dataIndex='sell' key='sell' />
          <Column title='Buy' dataIndex='buy' key='buy' />
        </ColumnGroup>
        <Column title='owner' dataIndex='owner' key='owner' className='display-none' />
        <Column
          title='Action'
          key='action'
          render={(text, record: any) => (
            <Space size='middle'>
              <Link href={'/trading/create_offer/' + record.owner + '?offerType=' + offer_type}>
                <a>Edit</a>
              </Link>
            </Space>
          )}
        />
      </Table>
    </Card>
  )
}

MyOfferPage.Layout = TradingLayout

export default MyOfferPage
