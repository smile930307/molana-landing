import { useState } from 'react'
import TradingLayout from '../../../components/trading/layout'
import { Card, Select } from 'antd'
import SolanaSolanaPage from '../../../components/trading/create_offer/solana_solana'
import SolanaOtherPage from '../../../components/trading/create_offer/solana_other'
import OtherOtherPage from '../../../components/trading/create_offer/other_other'

const CreateOfferPage = () => {
  const [offer_type, setOfferType] = useState<string>('1')
  const { Option } = Select

  function OfferCreateForm() {
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
      title='Create an offer'
      extra={
        <Select
          showSearch
          value={offer_type}
          style={{ width: 200 }}
          placeholder='Offer Type'
          optionFilterProp='children'
          onSelect={(value: string) => {
            setOfferType(value)
          }}
        >
          <Option value='1'>Solana &lt;-&gt; Solana</Option>
          <Option value='2'>Solana &lt;-&gt; Other</Option>
          <Option value='3'>Other &lt;-&gt; Other</Option>
        </Select>
      }
    >
      <OfferCreateForm />
    </Card>
  )
}

CreateOfferPage.Layout = TradingLayout

export default CreateOfferPage
