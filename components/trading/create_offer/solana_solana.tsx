/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWallet } from '@saberhq/use-solana'
import { Form, Input, InputNumber, Button } from 'antd'
import { globalMessage, tradingPageLocales } from '../../../constants/locales/locales'
import { initMolanaProgram, setSolOffer } from '../../../integration/molana-integration'
import * as anchor from '@project-serum/anchor'
import { showErrorToast, showSuccessToast } from '../../../functions/utils'
import { useEffect } from 'react'
import { config } from '../../../constants/config'

export default function SolanaSolanaPage() {
  const { connected, connection, wallet } = useWallet()
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

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 }
  }

  useEffect(() => {
    if (connected && wallet?.publicKey) {
      try {
        const res = initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        if (!res.success) {
          showErrorToast(res.msg)
        }
      } catch (e) {
        showErrorToast('Something was wrong.')
      }
    }
  }, [connected, connection, wallet])

  const onCreateOffer = async (values: any) => {
    console.log('onCreateOffer', values)
    try {
      setSolOffer(
        new anchor.BN(values.buy_ratio),
        new anchor.BN(values.sell_ratio),
        new anchor.web3.PublicKey(values.base_token),
        new anchor.web3.PublicKey(values.quot_token),
        1
      ).then((res) => {
        if (res.success) {
          showSuccessToast(res.msg)
        } else {
          showErrorToast(res.msg)
        }
      })
    } catch (e) {
      showErrorToast(globalMessage.error_occured)
    }
  }

  return (
    <Form {...layout} name='solana-solana' onFinish={onCreateOffer} validateMessages={validateMessages}>
      <Form.Item name={'base_token'} label={tradingPageLocales.base_token} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={'quot_token'} label={tradingPageLocales.quot_token} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name={'buy_ratio'}
        label={tradingPageLocales.buy_ratio}
        rules={[{ type: 'number', min: 0, required: true }]}
      >
        <InputNumber style={{ width: 200 }} step='0.00000001' />
      </Form.Item>
      <Form.Item
        name={'sell_ratio'}
        label={tradingPageLocales.sell_ratio}
        rules={[{ type: 'number', min: 0, required: true }]}
      >
        <InputNumber style={{ width: 200 }} step='0.00000001' />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button className='mr-10' type='primary' htmlType='submit'>
          Create
        </Button>
      </Form.Item>
    </Form>
  )
}
