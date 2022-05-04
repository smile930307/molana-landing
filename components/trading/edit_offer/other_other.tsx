/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, InputNumber, Button, Select } from 'antd'
import { globalMessage, tradingPageLocales } from '../../../constants/locales/locales'
import * as anchor from '@project-serum/anchor'
import {
  getAllTradeVaults,
  getEthBscOffer,
  getUserTreasuryByOwner,
  initMolanaProgram,
  setEthBscOffer
} from '../../../integration/molana-integration'
import { getChainType, getChainTypeStr, getProviderType, getProviderTypeStr } from '../../../integration/utils'
import { useWallet } from '@saberhq/use-solana'
import { useEffect, useState } from 'react'
import { config } from '../../../constants/config'
import { printlog, printloginfo, showErrorToast, showInfoToast, showSuccessToast } from '../../../functions/utils'

export default function OtherOtherPage(props: any) {
  const { connected, connection, wallet } = useWallet()
  const [userTreasuriesData, setUserTreasuriesData] = useState<any>(null)
  const [tradeTreasuriesData, setTradeTreasuriesData] = useState<any>(null)
  const { Option } = Select
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
    printlog('onSave', values)
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    try {
      setEthBscOffer(
        new anchor.BN(values.buy_ratio),
        new anchor.BN(values.sell_ratio),
        new anchor.BN(values.time_limitaton),
        getProviderType(values.provider_type),
        getChainType(values.chain_type_a),
        values.token_addr_a,
        values.vault_addr_b,
        getChainType(values.chain_type_b),
        values.token_addr_b,
        values.vault_addr_b,
        new anchor.web3.PublicKey(values.collateral_spl_token)
      ).then((res) => {
        if (res.success) {
          showSuccessToast(res.msg)
        } else {
          showErrorToast(res.msg)
        }
      })
    } catch (e) {
      printlog('onSave exeption', e)
      showErrorToast(globalMessage.error_occured)
    }
  }

  const onDelete = () => {
    showInfoToast(globalMessage.reserved_function)
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
        getEthBscOffer(new anchor.web3.PublicKey(props.owner)).then((data) => {
          printlog('solofferdata', data)
          if (data !== null) {
            const temp = {
              token_addr_a: data.aToken,
              vault_addr_a: data.aVault,
              collateral_spl_token: data.userTreasury.toBase58(),
              chain_type_a: getChainTypeStr(data.aNetwork),
              token_addr_b: data.bToken,
              vault_addr_b: data.bVault,
              chain_type_b: getChainTypeStr(data.bNetwork),
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
      name='other-other'
      onFinish={onSave}
      validateMessages={validateMessages}
      initialValues={offerData}
    >
      <Form.Item
        name={'collateral_spl_token'}
        label={tradingPageLocales.collateral_spl_token}
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
      <Form.Item name={'chain_type_a'} label={tradingPageLocales.chain_type_a} rules={[{ required: true }]}>
        <Select showSearch style={{ width: 200 }} placeholder='Chain Type' disabled>
          <Option value='Eth'>Eth</Option>
          <Option value='Bsc'>Bsc</Option>
        </Select>
      </Form.Item>
      <Form.Item name={'token_addr_a'} label={tradingPageLocales.token_addr_a} rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={'vault_addr_a'} label={tradingPageLocales.vault_addr_a} rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={'chain_type_b'} label={tradingPageLocales.chain_type_b} rules={[{ required: true }]}>
        <Select showSearch style={{ width: 200 }} placeholder='Chain Type' disabled>
          <Option value='Eth'>Eth</Option>
          <Option value='Bsc'>Bsc</Option>
        </Select>
      </Form.Item>
      <Form.Item name={'token_addr_b'} label={tradingPageLocales.token_addr_b} rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>
      <Form.Item name={'vault_addr_b'} label={tradingPageLocales.vault_addr_b} rules={[{ required: true }]}>
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
