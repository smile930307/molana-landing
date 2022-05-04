/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, InputNumber, Button, Comment, Select, Checkbox, notification } from 'antd'
import { globalMessage, tradingPageLocales } from '../../../constants/locales/locales'
import * as anchor from '@project-serum/anchor'
import {
  checkWalletATA,
  CURRENCY_DECIMALS,
  getGlobalState,
  getTokenMintByPayoneerCurrency,
  initMolanaProgram,
  MAX_DEPOSIT_AMOUNT,
  MAX_WITHDRAW_AMOUNT,
  MIN_DEPOSIT_AMOUNT,
  MIN_WITHDRAW_AMOUNT,
  setWithdrawRouter
} from '../../../integration/molana-integration'
import { useWallet } from '@saberhq/use-solana'
import { useEffect, useState } from 'react'
import { config } from '../../../constants/config'
import { showErrorToast, showSuccessToast } from '../../../functions/utils'
const { Option } = Select

export default function NewWithdrawPage({ goToCurrentWithdrawPage }: any) {
  const { connected, connection, wallet } = useWallet()
  const [globalStateData, setGlobalStateData] = useState<any>()
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 10 }
  }
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!'
    },
    number: {
      range: '${label} must be between ${min} and ${max}'
    }
  }

  const onFinish = async (values: any) => {
    console.log('onFinish', values)
    // goToCurrentWithdrawPage(values)
    try {
      const tokenMintAddress = await getTokenMintByPayoneerCurrency(values.currency)
      console.log(tokenMintAddress.toBase58())
      const userTradeVault = await checkWalletATA(tokenMintAddress.toBase58())
      if (userTradeVault != null) {
        setWithdrawRouter(new anchor.BN(values.amount * Math.pow(10, CURRENCY_DECIMALS)), values.to_your_payoneer, values.currency, userTradeVault).then(
          (res) => {
            if (res.success) {
              showSuccessToast(res.msg)
              goToCurrentWithdrawPage(values)
            } else {
              showErrorToast(res.msg)
            }
          }
        )
      } else {
        showErrorToast('No UserTradeVault')
      }
    } catch (e) {
      console.log(e)
      showErrorToast(globalMessage.error_occured)
    }
  }

  useEffect(() => {
    if (connected && wallet?.publicKey) {
      // initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
      try {
        getGlobalState().then((globalState) => {
          if (globalState === null) {
            console.log('globalState is null')
          } else {
            const temp = {
              from: globalState.payoneerEmailUser,
              withdrawLabel: 'Withdraw id: ' + globalState.withdrawId.toString(),
              withdraw_id: globalState.withdrawId.toNumber()
            }
            console.log('seted data', temp)
            setGlobalStateData(temp)
          }
        })
      } catch (e) {
        console.log(e)
      }
    } else {
      // router.back()
    }
  }, [connected, connection, wallet])

  if (globalStateData == null) return <p>Loading</p>

  return (
    <>
      <Comment
        content={
          <p style={{ textAlign: 'center' }}>
            Make sure that you input your wallet address only in the description of payoneer transaction by ‘Make a
            payment’
          </p>
        }
      />
      <Form
        {...layout}
        name='new-withdraw'
        onFinish={onFinish}
        validateMessages={validateMessages}
        initialValues={globalStateData}
      >
        <Form.Item name={'from'} label={tradingPageLocales.from} rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item name={'to_your_payoneer'} label={tradingPageLocales.to_your_payoneer} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={'currency'} label={tradingPageLocales.currency} rules={[{ required: true }]}>
          <Select showSearch style={{ width: 200 }} placeholder='Currency'>
            <Option value='USD'>USD</Option>
            <Option value='GBP'>GBP</Option>
            <Option value='EUR'>EUR</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name={'amount'}
          label={tradingPageLocales.amount}
          rules={[{
            type: 'number',
            min: MIN_WITHDRAW_AMOUNT / Math.pow(10, CURRENCY_DECIMALS),
            max: MAX_WITHDRAW_AMOUNT / Math.pow(10, CURRENCY_DECIMALS),
            required: true
          }]}
        >
          <InputNumber style={{ width: 200 }} />
        </Form.Item>
        <Form.Item
          className='display-none'
          name={'withdraw_id'}
          label={tradingPageLocales.withdraw_id}
          rules={[{ type: 'number', required: true }]}
        >
          <InputNumber style={{ width: 200, marginRight: 10 }} />
        </Form.Item>
        <Form.Item
          extra={globalStateData.withdrawLabel}
          name='remember'
          valuePropName='checked'
          wrapperCol={{ offset: 8, span: 16 }}
          rules={[{ required: true }]}
        >
          <Checkbox>Make sure that you will save withdraw id after created.</Checkbox>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Create Withdraw Router
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
