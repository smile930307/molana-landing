/* eslint-disable @typescript-eslint/no-explicit-any */
import TradingLayout from '../../../components/trading/layout'
import { Card, Select } from 'antd'
import { useState } from 'react'
import OtherOtherPage from '../../../components/trading/my_current_trading/other_other'
import SolanaSolanaPage from '../../../components/trading/my_current_trading/solana_solana'
import SolanaOtherPage from '../../../components/trading/my_current_trading/solana_other'

// TODO: Add a table for NFT data
const MyCurrentTradingPage = () => {
  // const { connected } = useWallet()
  const [offer_type, setOfferType] = useState<string>('1')
  const { Option } = Select

  function CurrentTradingForm() {
    {
      if (offer_type === '1') {
        return <SolanaSolanaPage></SolanaSolanaPage>
      } else if (offer_type === '2') {
        return <SolanaOtherPage></SolanaOtherPage>
      } else {
        return <OtherOtherPage></OtherOtherPage>
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
