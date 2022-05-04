/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, InputNumber, Button, Comment, Select, notification } from 'antd'
import { globalMessage, tradingPageLocales } from '../../../constants/locales/locales'
import * as anchor from '@project-serum/anchor'
import {
  CURRENCY_DECIMALS,
  getGlobalState,
  initMolanaProgram,
  MAX_DEPOSIT_AMOUNT,
  MIN_DEPOSIT_AMOUNT,
  setDepositRouter
} from '../../../integration/molana-integration'
import { useWallet } from '@saberhq/use-solana'
import { useEffect, useState } from 'react'
import { config } from '../../../constants/config'
import { useRouter } from 'next/router'
import { showErrorToast, showSuccessToast } from '../../../functions/utils'

export default function NewDepositPage({ goToCurrentDepositPage }: any) {
  const [txIdPayoneer, setTxIdPayoneer] = useState<number>(0)
  const router = useRouter()
  const { connected, connection, wallet } = useWallet()
  const { Option } = Select
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

  useEffect(() => {
    if (connected && wallet?.publicKey) {
      try {
        initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        getGlobalState().then((globalState) => {
          console.log('getglobal', globalState)
          if (globalState === null) {
            console.log('globalState is null')
          } else {
            const temp = {
              payoneer_addr: globalState.payoneerEmailUser
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

  const onFinish = async (values: any) => {
    console.log('onFinish', values)
    try {
      if (wallet && wallet.publicKey) {
        setDepositRouter(
          new anchor.BN(values.tx_id_payoneer),
          new anchor.BN(values.amount * Math.pow(10, CURRENCY_DECIMALS)),
          values.currency
        ).then((res) => {
          if (res.success) {
            showSuccessToast(res.msg)
            goToCurrentDepositPage(txIdPayoneer)
          } else {
            showErrorToast(res.msg)
          }
        })
      }
    } catch (e) {
      console.log(e)
      showErrorToast(globalMessage.error_occured)
    }
  }

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
        name='new-deposit'
        onFinish={onFinish}
        validateMessages={validateMessages}
        initialValues={globalStateData}
      >
        <Form.Item name={'payoneer_addr'} label={tradingPageLocales.payoneer_addr} rules={[{ required: true }]}>
          <Input disabled />
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
          rules={[
            {
              type: 'number',
              min: MIN_DEPOSIT_AMOUNT / Math.pow(10, CURRENCY_DECIMALS),
              max: MAX_DEPOSIT_AMOUNT / Math.pow(10, CURRENCY_DECIMALS),
              required: true
            }
          ]}
        >
          <InputNumber style={{ width: 200 }} />
        </Form.Item>
        <Form.Item
          name={'tx_id_payoneer'}
          label={tradingPageLocales.tx_id_payoneer}
          rules={[{ type: 'number', min: 0, required: true }]}
        >
          <InputNumber
            style={{ width: 200 }}
            onChange={(e: number) => {
              setTxIdPayoneer(e)
            }}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Create Deposit Router
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
