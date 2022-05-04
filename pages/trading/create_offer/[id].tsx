/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWallet } from '@saberhq/use-solana'
import { useEffect, useState } from 'react'
// import { Field, Form } from 'react-final-form'
import TradingLayout from '../../../components/trading/layout'
import { useRouter } from 'next/router'
import { Card, Empty, Select } from 'antd'
import SolanaSolanaPage from '../../../components/trading/edit_offer/solana_solana'
import SolanaOtherPage from '../../../components/trading/edit_offer/solana_other'
import OtherOtherPage from '../../../components/trading/edit_offer/other_other'

// TODO: Add a table for NFT data
const CreateOfferPage = () => {
  const router = useRouter()
  // const { id, offerType } = router.query
  const [offer_type, setOfferType] = useState<any>()
  const [offer_id, setOfferId] = useState<any>()
  const { Option } = Select

  useEffect(() => {
    const { id, offerType } = router.query
    console.log(offerType)
    setOfferType(offerType)
    setOfferId(id)
  }, [router.query])

  function OfferCreateForm() {
    {
      if (offer_type === '1') {
        return <SolanaSolanaPage owner={offer_id}></SolanaSolanaPage>
      } else if (offer_type === '2') {
        return <SolanaOtherPage owner={offer_id}></SolanaOtherPage>
      } else if (offer_type === '3') {
        return <OtherOtherPage owner={offer_id}></OtherOtherPage>
      } else {
        return <Empty></Empty>
      }
    }
  }

  return (
    <Card
      title='Edit your offer'
      extra={
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder='Offer Type'
          optionFilterProp='children'
          disabled
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
      <OfferCreateForm />
    </Card>
  )
}

CreateOfferPage.Layout = TradingLayout

export default CreateOfferPage
