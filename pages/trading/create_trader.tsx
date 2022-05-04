/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWallet } from '@saberhq/use-solana'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import TradingLayout from '../../components/trading/layout'
import { globalMessage, tradingPageLocales } from '../../constants/locales/locales'
import { Form, Input, Button, Card } from 'antd'
import { initMolanaProgram, setTraderAccount } from '../../integration/molana-integration'
import { config } from '../../constants/config'
import * as anchor from '@project-serum/anchor'
import { showErrorToast, showInfoToast, showSuccessToast } from '../../functions/utils'

const CreateTraderAccountPage = () => {
  const router = useRouter()
  const { connected, connection, wallet } = useWallet()

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 10 }
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 }
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
        const res = initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        if (!res.success) {
          showErrorToast(res.msg)
        }
      } catch (e) {
        showErrorToast('Something was wrong.')
      }
    }
  }, [connected, connection, wallet])

  const onCreate = async (values: any) => {
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    if (values) {
      try {
        await setTraderAccount().then((e) => {
          if (e.success) {
            showSuccessToast(e.msg)
            router.push('/trading/my_info')
          } else {
            showErrorToast(e.msg)
          }
        })
      } catch (e) {
        console.log('exception->', e)
        showErrorToast(globalMessage.error_occured)
      }
    }
  }

  return (
    <Card title='Create Trader Account'>
      <Form {...layout} name='my-information' onFinish={onCreate} validateMessages={validateMessages}>
        <Form.Item name={'email'} label={tradingPageLocales.email} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={'twitter'} label={tradingPageLocales.twitter} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={'telegram'} label={tradingPageLocales.telegram} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={'discord'} label={tradingPageLocales.discord} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={'other'} label={tradingPageLocales.other} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={'constraint'} label={tradingPageLocales.constraint} rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button className='mr-10' type='primary' htmlType='submit'>
            Create Trader Account
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

CreateTraderAccountPage.Layout = TradingLayout

export default CreateTraderAccountPage
