/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import TradingLayout from '../../components/trading/layout'
import { Card, Select } from 'antd'
import NewDepositPage from '../../components/trading/create_router/new_deposit'
import NewWithdrawPage from '../../components/trading/create_router/new_withdraw'
import CurrentDepositPage from '../../components/trading/create_router/current_deposit'
import CurrentWithdrawPage from '../../components/trading/create_router/current_withdraw'

const CreateRouterPage = () => {
  const [router_type, setRouterType] = useState<string>('1')
  const [txIdPayoneer, setTxIdPayoneer] = useState<any>()
  const [withdrawPageInfo, setwithdrawPageInfo] = useState<any>({
    withdrawId: ''
  })
  const { Option } = Select

  const goToCurrentDepositPage = (txId: number) => {
    setRouterType('3')
    setTxIdPayoneer(txId)
  }

  const goToCurrentWithdrawPage = (pageInfo: any) => {
    setRouterType('4')
    setwithdrawPageInfo(pageInfo)
  }

  function CreateRouterForm() {
    {
      if (router_type === '1') {
        return <NewDepositPage goToCurrentDepositPage={goToCurrentDepositPage}></NewDepositPage>
      } else if (router_type === '2') {
        return <NewWithdrawPage goToCurrentWithdrawPage={goToCurrentWithdrawPage}></NewWithdrawPage>
      } else if (router_type === '3') {
        return <CurrentDepositPage txId={txIdPayoneer}></CurrentDepositPage>
      } else {
        return <CurrentWithdrawPage data={withdrawPageInfo}></CurrentWithdrawPage>
      }
    }
  }

  return (
    <Card
      title='Payoneer Router'
      extra={
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder='Router Type'
          optionFilterProp='children'
          onSelect={(value: string) => {
            setTxIdPayoneer('')
            setwithdrawPageInfo({
              withdrawId: ''
            })
            setRouterType(value)
          }}
          defaultValue={router_type}
          value={router_type}
        >
          <Option value='1'>New Deposit</Option>
          <Option value='2'>New Withdraw</Option>
          <Option value='3'>Current Deposit</Option>
          <Option value='4'>Current Withdraw</Option>
        </Select>
      }
    >
      <CreateRouterForm />
    </Card>
  )
}

CreateRouterPage.Layout = TradingLayout

export default CreateRouterPage
