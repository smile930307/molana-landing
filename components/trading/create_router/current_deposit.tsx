/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, InputNumber, Button, Select, Row, notification } from 'antd'
import { FormInstance } from 'antd/es/form'
import { globalMessage, tradingPageLocales } from '../../../constants/locales/locales'
import * as anchor from '@project-serum/anchor'
import {
  CURRENCY_DECIMALS,
  DepositTxState,
  getDepositRouterByTx,
  getDepositRouterIdByTx,
  getGlobalState,
  initMolanaProgram,
  MAX_DEPOSIT_AMOUNT,
  MIN_DEPOSIT_AMOUNT,
  setDepositState,
  supplyDepositTx
} from '../../../integration/molana-integration'
import { useWallet } from '@saberhq/use-solana'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { config } from '../../../constants/config'
import React from 'react'
import { showErrorToast, showSuccessToast } from '../../../functions/utils'
import { getDepositeStatus } from '../../../integration/utils'

export default function CurrentDepositPage(param: any) {
  const { connected, connection, wallet } = useWallet()
  const { Option } = Select
  const [status, setStatus] = useState<string>('Initialized')
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

  const [txIdPayoneer, setTxIdPayoneer] = useState<number>(param.txId)

  const onSearch = () => {
    try {
      console.log(txIdPayoneer)
      getDepositRouterByTx(txIdPayoneer).then((res) => {
        if (res != null) {
          console.log('deposit', res)
          const temp = {
            payoneer_addr: formRef.current?.getFieldValue('payoneer_addr'),
            currency: res?.currency,
            amount: res?.amount.toNumber() / Math.pow(10, CURRENCY_DECIMALS)
          }
          formRef.current?.setFieldsValue(temp)
        } else {
          showErrorToast('No result')
        }
      })
    } catch (e) {
      console.log('something was wrong')
    }
  }

  const onCancel = () => {
    console.log('onCancel')
  }

  const onReqUpdate = () => {
    // const reqUpdate = async () => {
    try {
      getDepositRouterIdByTx(txIdPayoneer).then(async (deposit_router) => {
        const res = (
          await axios.post(`/api/set_my_deposit_route_state/${txIdPayoneer}`, {
            state: getDepositeStatus(status),
            amount: formRef.current?.getFieldValue('amount') * Math.pow(10, CURRENCY_DECIMALS),
            deposit_router: deposit_router.toBase58()
          })
        ).data
        console.log(res)
        if (res.success) {
          showSuccessToast(res.msg)
        } else {
          showErrorToast(res.msg)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  const onFinish = (values: any) => {
    console.log('onFinish', values)
    try {
      getDepositRouterIdByTx(txIdPayoneer).then((deposit_router) => {
        supplyDepositTx(deposit_router).then((res) => {
          if (res.success) {
            showSuccessToast(res.msg)
          } else {
            showErrorToast(res.msg)
          }
        })
      })
    } catch (e) {
      showErrorToast(globalMessage.error_occured)
    }
  }

  const formRef = React.createRef<FormInstance>()
  // setTxIdPayoneer(param.txId)

  useEffect(() => {
    if (connected && wallet?.publicKey) {
      initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
      try {
        getGlobalState().then((globalState) => {
          if (globalState === null) {
            console.log('globalState is null')
          } else {
            const temp = {
              payoneer_addr: globalState.payoneerEmailUser,
              // currency: res?.currency,
              // amount: res?.amount.toNumber(),
              tx_id_payoneer: param.txId
            }
            console.log('seted data', temp)
            formRef.current?.setFieldsValue(temp)
            // setGlobalStateData(temp)
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  }, [])

  return (
    <Form {...layout} name='current-deposit' onFinish={onFinish} ref={formRef} validateMessages={validateMessages}>
      <Form.Item label={tradingPageLocales.tx_id_payoneer} rules={[{ required: true }]}>
        <Row>
          <Form.Item name={'tx_id_payoneer'}>
            <InputNumber
              style={{ width: 200, marginRight: 10 }}
              defaultValue={param.txId}
              onChange={(e: number) => {
                setTxIdPayoneer(e)
              }}
            />
          </Form.Item>
          <Button type='primary' onClick={onSearch}>
            Search
          </Button>
        </Row>
      </Form.Item>
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
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Row>
          <Form.Item name={'status'}>
            <Select showSearch style={{ width: 100 }} placeholder='status' defaultValue={'Initializeds'} onChange={(val) => {
              setStatus(val)
            }}>
              <Option value='Initialized'>Initialized</Option>
              <Option value='Sent'>Sent</Option>
              <Option value='Pending'>Pending</Option>
              <Option value='Arrived'>Arrived</Option>
              <Option value='Supplied'>Supplied</Option>
              <Option value='NotArrived'>NotArrived</Option>
            </Select>
          </Form.Item>
          <Button className='ml-10' type='primary' onClick={onReqUpdate}>
            Request for update
          </Button>
        </Row>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button className='mr-20' type='primary' htmlType='submit'>
          Supply
        </Button>
        <Button type='primary' onClick={onCancel}>
          Cancel/Close
        </Button>
      </Form.Item>
    </Form>
  )
}
