/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, InputNumber, Button, Select } from 'antd'
import { globalMessage, tradingPageLocales } from '../../../constants/locales/locales'
import * as anchor from '@project-serum/anchor'
import {
  getAllTradeVaults,
  getUserTreasuryByOwner,
  initMolanaProgram,
  setSolEthOffer
} from '../../../integration/molana-integration'
import { getChainType, getProviderType } from '../../../integration/utils'
import { useEffect, useState } from 'react'
import { useWallet } from '@saberhq/use-solana'
import { config } from '../../../constants/config'
import { printlog, showErrorToast, showInfoToast, showSuccessToast } from '../../../functions/utils'

export default function SolanaOtherPage() {
  const { connected, connection, wallet } = useWallet()
  const [userTreasuriesData, setUserTreasuriesData] = useState<any>(null)
  const [tradeTreasuriesData, setTradeTreasuriesData] = useState<any>(null)
  const { Option } = Select
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

  const onCreateOffer = async (values: any) => {
    printlog('onCreateOffer', values)
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    if (values) {
      try {
        console.log('values.spl_token', values.spl_token)
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

  const isUserTreasuryExist = async (value: any) => {
    let a = -1
    if (userTreasuriesData == null) return false
    await userTreasuriesData.map((treasury: any) => {
      if (treasury.account.tradeMint.toBase58() == value) {
        a = 0
      }
    })
    if (a === 0) {
      return true
    } else {
      return false
    }
  }

  const isTradeTreasuryExist = async (value: any) => {
    let a = -1
    if (tradeTreasuriesData == null) return false
    await tradeTreasuriesData.map((treasury: any) => {
      if (treasury.account.tradeMint.toBase58() == value) {
        a = 0
      }
    })
    if (a === 0) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    if (connected && wallet && wallet.publicKey) {
      try {
        initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        getUserTreasuryByOwner(wallet?.publicKey).then((userTreasuries) => {
          setUserTreasuriesData(userTreasuries)
        })
        getAllTradeVaults().then((tradeTreasuries) => {
          setTradeTreasuriesData(tradeTreasuries)
        })
      } catch (e) {
        printlog('exeption', e)
      }
    }
  }, [connected])

  return (
    <Form {...layout} name='solana-other' onFinish={onCreateOffer} validateMessages={validateMessages}>
      <Form.Item
        name={'spl_token'}
        label={tradingPageLocales.spl_token}
        rules={[
          {
            required: true
          },
          () => ({
            async validator(_, value) {
              if (!value || ((await isUserTreasuryExist(value)) && (await isTradeTreasuryExist(value)))) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('You can’t use this token as collateral'))
            }
          })
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name={'chain_type'} label={tradingPageLocales.chain_type} rules={[{ required: true }]}>
        <Select showSearch style={{ width: 200 }} placeholder='Chain Type'>
          <Option value='Eth'>Eth</Option>
          <Option value='Bsc'>Bsc</Option>
        </Select>
      </Form.Item>
      <Form.Item name={'token_addr'} label={tradingPageLocales.token_addr} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={'vault_addr'} label={tradingPageLocales.vault_addr} rules={[{ required: true }]}>
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
          Create
        </Button>
        {/* <Button htmlType='button' onClick={onDelete}>
          Delete
        </Button> */}
      </Form.Item>
    </Form>
  )
}
