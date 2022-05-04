/* eslint-disable @typescript-eslint/no-explicit-any */
import TradingLayout from '../../../components/trading/layout'
import { Card, Empty, Select } from 'antd'
import { useEffect, useState } from 'react'
import OtherOtherPage from '../../../components/trading/my_current_trading/other_other'
import SolanaSolanaPage from '../../../components/trading/my_current_trading/solana_solana'
import SolanaOtherPage from '../../../components/trading/my_current_trading/solana_other'
import { useRouter } from 'next/router'

const MyCurrentTradingPage = () => {
  // const { connected } = useWallet()
  const router = useRouter()
  const [offer_type, setOfferType] = useState<any>()
  const [offer_id, setOfferId] = useState<any>()
  const { Option } = Select

  useEffect(() => {
    const { id, offerType } = router.query
    setOfferType(offerType)
    setOfferId(id)
  }, [router.query])

  function CurrentTradingForm() {
    {
      if (offer_type === '1') {
        return <SolanaSolanaPage offer_id={offer_id}></SolanaSolanaPage>
      } else if (offer_type === '2') {
        return <SolanaOtherPage offer_id={offer_id}></SolanaOtherPage>
      } else if (offer_type === '3') {
        return <OtherOtherPage offer_id={offer_id}></OtherOtherPage>
      } else {
        return <Empty></Empty>
      }
    }
  }
  return (
    <Card
      title='My Current Trading'
      extra={
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder='Offer Type'
          optionFilterProp='children'
          value={offer_type}
          onSelect={(value: string) => {
            console.log('selected value->', value)
            setOfferType(value)
          }}
          disabled
        >
          <Option value='1'>Solana &lt;-&gt; Solana</Option>
          <Option value='2'>Solana &lt;-&gt; Other</Option>
          <Option value='3'>Other &lt;-&gt; Other</Option>
        </Select>
      }
    >
      <CurrentTradingForm />
    </Card>
  )
}

MyCurrentTradingPage.Layout = TradingLayout

export default MyCurrentTradingPage
