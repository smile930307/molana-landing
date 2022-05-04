/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWallet } from '@saberhq/use-solana'
import { useEffect } from 'react'
import TradingLayout from '../../components/trading/layout'
import { globalMessage, tradingPageLocales } from '../../constants/locales/locales'
import { Form, Input, Button, Card } from 'antd'
import {
  // closeTraderAccount,
  getTraderAccount,
  initMolanaProgram,
  setTraderAccount
} from '../../integration/molana-integration'
import { config } from '../../constants/config'
import * as anchor from '@project-serum/anchor'
import { printlog, showErrorToast, showInfoToast, showSuccessToast } from '../../functions/utils'

// TODO: Add a table for NFT data
const MyInfoPage = () => {
  const { connected, connection, wallet } = useWallet()
  // const [data, setData] = useState<any>()
  const [form] = Form.useForm()

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
        initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        getTraderAccount().then((traderAccount) => {
          if (traderAccount) {
            printlog('trade account info', traderAccount)
            // setData(traderAccount)
            form.setFieldsValue(traderAccount)
          } else {
            showErrorToast(globalMessage.error_occured)
            // router.back()
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
    // form.setFieldsValue(account)
  }, [connected])

  // const onDelete = () => {
  //   if (connected && wallet && wallet.publicKey) {
  //     closeTraderAccount().then((res) => {
  //       if (res.success) {
  //         showSuccessToast(res.msg)
  //         // router.push('/trading/my_info')
  //         router.reload()
  //       } else {
  //         showErrorToast(res.msg)
  //       }
  //     })
  //   } else {
  //     showInfoToast(globalMessage.check_wallet_connection)
  //   }
  // }

  const onSave = async (values: any) => {
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    if (values) {
      try {
        await setTraderAccount().then((e) => {
          if (e.success) {
            showSuccessToast(e.msg)
          } else {
            showErrorToast(e.msg)
          }
        })
      } catch (e) {
        console.log('error->', e)
      }
    }
  }

  return (
    <Card title='My Information'>
      <Form {...layout} form={form} name='my-information' onFinish={onSave} validateMessages={validateMessages}>
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
            Save
          </Button>
          {/* <Button htmlType='button' onClick={onDelete}>
            Delete
          </Button> */}
        </Form.Item>
      </Form>
    </Card>
  )
}

MyInfoPage.Layout = TradingLayout

export default MyInfoPage
