/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import DashboardLayout from '../../components/admin/layout'
import { adminPageLocales, globalMessage } from '../../constants/locales/locales'
import { useWallet } from '@saberhq/use-solana'
import * as anchor from '@project-serum/anchor'
import { getGlobalState, initMolanaProgram, setGlobalState, SOL_DECIMALS } from '../../integration/molana-integration'
import { printlog, printloginfo, showErrorToast, showInfoToast, showSuccessToast } from '../../functions/utils'
import { Button, Card, Form, Input, InputNumber, Space } from 'antd'
import { config } from '../../constants/config'

const GlobalSetting = () => {
  const { connected, connection, wallet } = useWallet()
  const [form] = Form.useForm()

  useEffect(() => {
    if (connected) {
      try {
        initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        getGlobalState().then((globalState) => {
          console.log('getglobal', globalState)
          if (globalState === null) {
            console.log('globalState is null')
          } else {
            const denominator = globalState.denominator.toNumber()
            console.log(
              'tradeFee,' + globalState.accountFee.toNumber() / Math.pow(10, SOL_DECIMALS)
              // (globalState.tradeFee.toNumber() / denominator) * 100
            )
            const temp = {
              denominator: denominator,
              account_fee: globalState.accountFee.toNumber() / Math.pow(10, SOL_DECIMALS),
              checker_wallet: globalState.depositWithdrawChecker.toBase58(),
              deposit_fee: Math.round((globalState.depositFee.toNumber() / denominator) * 100 * 100) / 100,
              min_waiting_time: globalState.minOfferLimitationTime.toNumber(),
              payoneer_email: globalState.payoneerEmailUser,
              trade_fee: Math.round((globalState.tradeFee.toNumber() / denominator) * 100 * 100) / 100,
              withdraw_fee: Math.round((globalState.withdrawFee.toNumber() / denominator) * 100 * 100) / 100
            }
            form.setFieldsValue(temp)
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  }, [connected])

  const onSubmit = async (values: any) => {
    if (connected) {
      try {
        console.log(values.denominator)

        console.log('trade_fee -> ' + values.trade_fee, Math.round((values.trade_fee / 100) * values.denominator))
        const res = await setGlobalState(
          values.denominator,
          Math.round((values.trade_fee / 100) * values.denominator),
          Math.round((values.deposit_fee / 100) * values.denominator),
          Math.round((values.withdraw_fee / 100) * values.denominator),
          Math.round(values.account_fee * Math.pow(10, SOL_DECIMALS)),
          values.min_waiting_time,
          values.payoneer_email,
          new anchor.web3.PublicKey(values.checker_wallet)
        )
        if (res.success) {
          showSuccessToast(res.msg)
        } else {
          showErrorToast(res.msg)
        }
      } catch (e) {
        showErrorToast(globalMessage.error_occured)
      }
    }
  }

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

  // if (globalStateData == null) return <>Loading</>
  return (
    <Card title='Global Setting'>
      <Form {...layout} form={form} name='global-setting' onFinish={onSubmit} validateMessages={validateMessages}>
        <Form.Item name={'denominator'} label={adminPageLocales.denominator} rules={[{ required: true }]}>
          <InputNumber style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name={'deposit_fee'} label={adminPageLocales.deposit_fee} rules={[{ required: true }]}>
          <InputNumber style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name={'trade_fee'} label={adminPageLocales.trade_fee} rules={[{ required: true }]}>
          <InputNumber style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name={'withdraw_fee'} label={adminPageLocales.withdraw_fee} rules={[{ required: true }]}>
          <InputNumber style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name={'account_fee'} label={adminPageLocales.account_fee} rules={[{ required: true }]}>
          <InputNumber style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name={'min_waiting_time'} label={adminPageLocales.min_waiting_time} rules={[{ required: true }]}>
          <InputNumber style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name={'payoneer_email'} label={adminPageLocales.payoneer_email} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={'checker_wallet'} label={adminPageLocales.checker_wallet} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button className='mr-10' type='primary' htmlType='submit'>
            {adminPageLocales.setSetting}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

GlobalSetting.Layout = DashboardLayout
export default GlobalSetting
