/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardLayout from '../../components/admin/layout'
import { adminPageLocales, globalMessage } from '../../constants/locales/locales'
import { useWallet } from '@saberhq/use-solana'
import { useEffect } from 'react'
import * as anchor from '@project-serum/anchor'
import { config } from '../../constants/config'
import {
  createTradeTreasuryForPayoneer,
  createTradeTreasury,
  initMolanaProgram
} from '../../integration/molana-integration'
import { Button, Card, Divider, Form, Input } from 'antd'
import { showErrorToast, showInfoToast, showSuccessToast } from '../../functions/utils'

const CreateVaults = () => {
  const { connected, connection, wallet } = useWallet()

  const submitForm1 = async (values: any) => {
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    try {
      createTradeTreasuryForPayoneer(values.currency).then((res) => {
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

  const submitForm2 = async (values: any) => {
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    try {
      createTradeTreasury(new anchor.web3.PublicKey(values.tokenMint)).then((res) => {
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
    if (connected) {
      initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
    }
  }, [connected, connection, wallet])

  return (
    <Card title={adminPageLocales.createVaults}>
      <Form {...layout} name='create-currency' onFinish={submitForm1} validateMessages={validateMessages}>
        <Form.Item name={'currency'} label={adminPageLocales.currency} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button className='mr-10' type='primary' htmlType='submit'>
            {adminPageLocales.createNewPayoneerTv}
          </Button>
        </Form.Item>
      </Form>
      {/* <hr style={{ marginTop: '40px', marginBottom: '80px' }} /> */}
      <Divider className='mt-40 mb-40'></Divider>
      <Form {...layout} name='tokenmint' onFinish={submitForm2} validateMessages={validateMessages}>
        <Form.Item name={'tokenMint'} label={adminPageLocales.tokenMint} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button className='mr-10' type='primary' htmlType='submit'>
            {adminPageLocales.createNewTv}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

CreateVaults.Layout = DashboardLayout

export default CreateVaults
