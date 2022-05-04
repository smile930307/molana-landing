/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, InputNumber, Button } from 'antd'
import { globalMessage, tradingPageLocales } from '../../../constants/locales/locales'
import { getSolOffer, initMolanaProgram, setSolOffer } from '../../../integration/molana-integration'
import * as anchor from '@project-serum/anchor'
import { useEffect, useState } from 'react'
import { useWallet } from '@saberhq/use-solana'
import { printlog, printloginfo, showErrorToast, showInfoToast, showSuccessToast } from '../../../functions/utils'
import { config } from '../../../constants/config'

export default function SolanaSolanaPage(props: any) {
  const { wallet, connection, connected } = useWallet()
  const [offerData, setOfferData] = useState<any>()
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

  const onSave = async (values: any) => {
    console.log('onFinish', values)
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
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
      printlog('on save offer exception', e)
      showErrorToast(globalMessage.error_occured)
    }
  }

  useEffect(() => {
    printlog('offer id', props.owner)
    initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
    getSolOffer(new anchor.web3.PublicKey(props.owner)).then((data) => {
      printlog('solofferdata', data)
      if (data !== null) {
        const temp = {
          sell_ratio: data.sellRatio.toNumber(),
          buy_ratio: data.buyRatio.toNumber(),
          base_token: data.tokenMintA.toBase58(),
          quot_token: data.tokenMintB.toBase58()
        }
        setOfferData(temp)
      } else {
        printloginfo('offerData is null')
      }
    })
  }, [connected])

  const onDelete = () => {
    showInfoToast('This is reserved.')
  }

  if (!offerData) return <p>No Offer Data</p>
  return (
    <Form
      {...layout}
      name='solana-solana'
      onFinish={onSave}
      validateMessages={validateMessages}
      initialValues={offerData}
    >
      <Form.Item name={'base_token'} label={tradingPageLocales.base_token} rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={'quot_token'} label={tradingPageLocales.quot_token} rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item
        name={'buy_ratio'}
        label={tradingPageLocales.buy_ratio}
        rules={[{ type: 'number', min: 0, max: 99, required: true }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name={'sell_ratio'}
        label={tradingPageLocales.sell_ratio}
        rules={[{ type: 'number', min: 0, max: 99, required: true }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button className='mr-10' type='primary' htmlType='submit'>
          Save
        </Button>
        <Button htmlType='button' onClick={onDelete}>
          Delete
        </Button>
      </Form.Item>
    </Form>
  )
}
