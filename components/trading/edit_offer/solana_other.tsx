/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, InputNumber, Button, Select } from 'antd'
import { globalMessage, tradingPageLocales } from '../../../constants/locales/locales'
import * as anchor from '@project-serum/anchor'
import { getSolEthOffer, initMolanaProgram, setSolEthOffer } from '../../../integration/molana-integration'
import { getChainType, getChainTypeStr, getProviderType, getProviderTypeStr } from '../../../integration/utils'
import { useEffect, useState } from 'react'
import { useWallet } from '@saberhq/use-solana'
import { printlog, printloginfo, showErrorToast, showInfoToast, showSuccessToast } from '../../../functions/utils'
import { config } from '../../../constants/config'

export default function SolanaOtherPage(props: any) {
  const { connected, connection, wallet } = useWallet()
  const [offerData, setOfferData] = useState<any>()
  const { Option } = Select
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

  const onSave = async (values: any) => {
    console.log('onSave', values)
    if (values) {
      try {
        setSolEthOffer(
          new anchor.BN(values.buy_ratio),
          new anchor.BN(values.sell_ratio),
          new anchor.BN(values.time_limitaton),
          getProviderType(values.provider_type),
          1,
          getChainType(values.chain_type),
          values.token_addr,
          values.vault_addr,
          new anchor.web3.PublicKey(values.spl_token)
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
  }

  const onDelete = () => {
    showInfoToast(globalMessage.reserved_function)
  }

  useEffect(() => {
    if (connected && wallet && wallet.publicKey) {
      try {
        initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        getSolEthOffer(new anchor.web3.PublicKey(props.owner)).then((data) => {
          printlog('loaded offer data', data)
          if (data !== null) {
            const temp = {
              token_addr: data.aToken,
              vault_addr: data.aVault,
              spl_token: data.splTokenMint.toBase58(),
              chain_type: getChainTypeStr(data.aNetwork),
              buy_ratio: data.buyRatio.toNumber(),
              sell_ratio: data.sellRatio.toNumber(),
              time_limitaton: data.offerTimeLimitation.toNumber(),
              provider_type: getProviderTypeStr(data.providerType)
            }
            setOfferData(temp)
          } else {
            printloginfo('offerData is null')
          }
        })
      } catch (e) {
        printlog('exceoption', e)
      }
    }
  }, [connected])

  if (!offerData) return <p>No Offer Data</p>

  return (
    <Form
      {...layout}
      name='solana-other'
      onFinish={onSave}
      validateMessages={validateMessages}
      initialValues={offerData}
    >
      <Form.Item name={'spl_token'} label={tradingPageLocales.spl_token}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={'chain_type'} label={tradingPageLocales.chain_type} rules={[{ required: true }]}>
        <Select showSearch style={{ width: 200 }} placeholder='Chain Type' disabled>
          <Option value='Eth'>Eth</Option>
          <Option value='Bsc'>Bsc</Option>
        </Select>
      </Form.Item>
      <Form.Item name={'token_addr'} label={tradingPageLocales.token_addr} rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={'vault_addr'} label={tradingPageLocales.vault_addr} rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item
        name={'buy_ratio'}
        label={tradingPageLocales.buy_ratio}
        rules={[{ type: 'number', min: 0, required: true }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name={'sell_ratio'}
        label={tradingPageLocales.sell_ratio}
        rules={[{ type: 'number', min: 0, required: true }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item name={'provider_type'} label={tradingPageLocales.provider_type} rules={[{ required: true }]}>
        <Select showSearch style={{ width: 200 }} placeholder='Provider Type'>
          <Option value='Human'>Human</Option>
          <Option value='Bot'>Bot</Option>
          <Option value='Platform'>Platform</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name={'time_limitaton'}
        label={tradingPageLocales.time_limitaton}
        rules={[{ type: 'number', min: 0, required: true }]}
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
