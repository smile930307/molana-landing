/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, InputNumber, Button, Comment, Card, Select, Checkbox, Row, Col, notification, Anchor } from 'antd'
import { globalMessage, tradingPageLocales } from '../../../constants/locales/locales'
import {
  CURRENCY_DECIMALS,
  getGlobalState,
  getWithdrawRouterByTx,
  getWithdrawRouterByWithdrawId,
  initMolanaProgram,
  MAX_WITHDRAW_AMOUNT,
  MIN_WITHDRAW_AMOUNT,
  setWithdrawState,
  WithdrawTxState
} from '../../../integration/molana-integration'
import { useWallet } from '@saberhq/use-solana'
import { useEffect, useState } from 'react'
import axios from 'axios'
import React from 'react'
import * as anchor from '@project-serum/anchor'
import { FormInstance } from 'antd/es/form'
import { config } from '../../../constants/config'
import { showErrorToast, showInfoToast, showSuccessToast } from '../../../functions/utils'
import { getWithdrawStatus } from '../../../integration/utils'

export default function CurrentWithdrawPage(param: any) {
  const { connected, connection, wallet } = useWallet()
  const [wthId, setWthId] = useState<number>(0)
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

  const onSearch = () => {
    try {
      console.log('withdrawId', wthId)
      getWithdrawRouterByTx(wthId).then((res) => {
        if (res != null) {
          console.log('withdraw', res)
          const temp = {
            payoneer_addr: formRef.current?.getFieldValue('payoneer_addr'),
            currency: res?.currency,
            amount: res?.amount.toNumber() / Math.pow(10, CURRENCY_DECIMALS),
            tx_id_payoneer: formRef.current?.getFieldValue('tx_id_payoneer'),
            to: res.destination
          }
          formRef.current?.setFieldsValue(temp)
        } else {
          showInfoToast('No result')
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  const formRef = React.createRef<FormInstance>()

  const onReqUpdate = () => {
    console.log('onReqUpdate called')
    try {
      getWithdrawRouterByWithdrawId(wthId).then(async (withdrawRouter) => {
        console.log('withdrawRouter', withdrawRouter)
        const res = (
          await axios.post(`/api/set_my_withdraw_route_state/${wthId}`, {
            state: getWithdrawStatus(status),
            amount: formRef.current?.getFieldValue('amount') * Math.pow(10, CURRENCY_DECIMALS),
            withdraw_router: withdrawRouter.toBase58()
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

  useEffect(() => {
    if (connected && wallet?.publicKey) {
      try {
        initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        getGlobalState().then((globalState) => {
          if (globalState === null) {
            console.log('globalState is null')
          } else {
            console.log('param', param)
            const temp = {
              withdraw_id: param.data.withdraw_id,
              from: param.data.from ? param.data.from : globalState.payoneerEmailUser,
              to: param.data.to_your_payoneer,
              currency: param.data.currency,
              amount: param.data.amount
            }
            formRef.current?.setFieldsValue(temp)
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  }, [])

  const { Option } = Select

  return (
    <Form {...layout} name='current-withdraw' ref={formRef} validateMessages={validateMessages}>
      <Form.Item name={'withdraw_id'} label={tradingPageLocales.withdraw_id} rules={[{ required: true }]}>
        <Row>
          <InputNumber
            style={{ width: 200, marginRight: 10 }}
            defaultValue={param.data.withdraw_id}
            onChange={(e: number) => {
              setWthId(e)
            }}
          />
          <Button type='primary' onClick={onSearch}>
            Search
          </Button>
        </Row>
      </Form.Item>
      <Form.Item name={'from'} label={tradingPageLocales.from} rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={'to'} label={tradingPageLocales.to} rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={'currency'} label={tradingPageLocales.currency} rules={[{ required: true }]}>
        <Select showSearch style={{ width: 200 }} placeholder='Currency' disabled>
          <Option value='USD'>USD</Option>
          <Option value='GBP'>GBP</Option>
          <Option value='GBP'>EUR</Option>
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
        <InputNumber style={{ width: 200 }} disabled />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Row>
          <Form.Item name={'status'}>
            <Select showSearch style={{ width: 100 }} placeholder='status' defaultValue={'Initializeds'} onChange={(val) => {
              setStatus(val)
            }}>
              <Option value='Initialized'>Initialized</Option>
              <Option value='RequestedAndBurned'>RequestedAndBurned</Option>
              <Option value='Pending'>Pending</Option>
              <Option value='Wrong'>Wrong</Option>
              <Option value='Completed'>Completed</Option>
            </Select>
          </Form.Item>
          <Button className='ml-10' type='primary' onClick={onReqUpdate}>
            Request for update
          </Button>
        </Row>
      </Form.Item>
    </Form>
  )
}
