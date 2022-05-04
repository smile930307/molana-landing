/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, InputNumber, Button, Tabs, Row, notification, Select } from 'antd'
import { globalMessage, tradingPageLocales } from '../../../constants/locales/locales'
import {
  acceptSolEthOffer,
  checkWalletATA,
  claimSolEthTrading,
  getSolEthOffer,
  getSolEthTrading,
  initMolanaProgram,
  SolEthOfferState
} from '../../../integration/molana-integration'
import * as anchor from '@project-serum/anchor'
import { useEffect, useState } from 'react'
import { FormInstance } from 'antd/es/form'
import React from 'react'
import { printlog, showErrorToast, showInfoToast, showSuccessToast } from '../../../functions/utils'
import { useWallet } from '@saberhq/use-solana'
import { config } from '../../../constants/config'
import { getProviderTypeStr } from '../../../integration/utils'

export default function SolanaOtherPage(data: any) {
  const { TabPane } = Tabs
  const { connected, wallet, connection } = useWallet()
  const [tradingId, setTradingId] = useState<string>()
  const [offerId, setOfferId] = useState<string>(data ? data.offer_id : '')
  const [activeTab, setActiveTab] = useState<string>('1')
  const { Option } = Select
  const formRef1 = React.createRef<FormInstance>()
  const formRef2 = React.createRef<FormInstance>()

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

  const onAccept = async (values: any) => {
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    try {
      const userTadeVault = await checkWalletATA(values.splTokenMint.toBase58())
      acceptSolEthOffer(
        SolEthOfferState.Initialized,
        new anchor.BN(values.amount),
        new anchor.BN(values.locked),
        values.vault_addr,
        new anchor.web3.PublicKey(values.offer_id),
        userTadeVault
      ).then((res) => {
        if (res.success) {
          showSuccessToast(res.msg)
          setActiveTab('2')
        } else {
          showErrorToast(res.msg)
        }
      })
    } catch (e) {
      showErrorToast(globalMessage.error_occured)
    }
  }

  const onSearchOffer = () => {
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    if (offerId != null && offerId != '') {
      try {
        getSolEthOffer(new anchor.web3.PublicKey(offerId)).then((offer) => {
          if (offer != null) {
            const temp = {
              offer_id: data.offer_id,
              owner: offer.owner.toBase58(),
              rate: 0,
              volume: 0,
              speed: 0,
              reserved: 0,
              splTokenMint: offer.splTokenMint,
              provider: 'Bot',
              amount: 10000,
              locked: 0,
              my_wallet: '',
              vault_addr: offer.aVault
            }
            formRef1.current?.setFieldsValue(temp)
          } else {
            showInfoToast('No result.')
          }
        })
      } catch (e) {
        console.log(e)
        showErrorToast('Something was wrong.')
      }
    } else {
      showInfoToast('Please input offer id.')
    }
  }

  const onSearchTrading = () => {
    console.log('onSearch')
    if (tradingId) {
      try {
        getSolEthTrading(new anchor.web3.PublicKey(tradingId)).then((tradeInfo) => {
          console.log(tradeInfo)
          if (tradeInfo != null) {
            const temp = {
              offer_id: data.offer_id,
              owner: tradeInfo.owner.toBase58(),
              rate: 0,
              volume: 0,
              speed: 0,
              reserved: 0,
              provider: 'Bot',
              splTokenMint: tradeInfo.splTokenMint,
              amount: 10000,
              locked: 0,
              my_wallet: '',
              vault_addr: tradeInfo.aVault
            }
            formRef2.current?.setFieldsValue(temp)
          } else {
            notification.error({
              message: 'Notification',
              description: 'No result'
            })
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  }

  const onClaim = (values: any) => {
    console.log('onClaim')
    try {
      claimSolEthTrading(
        new anchor.web3.PublicKey(values.trading_id),
        new anchor.web3.PublicKey(values.my_wallet)
      ).then((res) => {
        if (res.success) {
          notification.success({
            message: 'Notification',
            description: res.msg
          })
        } else {
          notification.error({
            message: 'Notification',
            description: res.msg
          })
        }
      })
    } catch (e) {
      console.log(e)
      showErrorToast(globalMessage.error_occured)
    }
  }

  const onRequestUpdate = () => {
    console.log('onRequestUpdate')
  }

  useEffect(() => {
    if (connected && data != null && data.offer_id) {
      try {
        initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        getSolEthOffer(new anchor.web3.PublicKey(data.offer_id)).then((offer) => {
          printlog('loaded offer data', offer)
          if (offer != null) {
            const temp = {
              offer_id: data.offer_id,
              owner: offer.owner.toBase58(),
              rate: 0,
              volume: 0,
              speed: 0,
              splTokenMint: offer.splTokenMint,
              reserved: 0,
              provider: getProviderTypeStr(offer.providerType),
              amount: 10000,
              locked: 0,
              my_wallet: '',
              vault_addr: offer.aVault
            }
            formRef1.current?.setFieldsValue(temp)
          } else {
            showInfoToast('No offer data')
          }
        })
      } catch (e) {
        console.log(e)
        showErrorToast(globalMessage.error_occured)
      }
    }
  }, [connected])

  // if (offerData == null) return <>Loading</>
  return (
    <Tabs defaultActiveKey='1'>
      <TabPane tab='Accepting...' key='1'>
        <Form
          className='mt-20'
          {...layout}
          name='solana-other-accepting'
          onFinish={onAccept}
          validateMessages={validateMessages}
          ref={formRef1}
        >
          <Form.Item name={'offer_id'} label={tradingPageLocales.offer_id} rules={[{ required: true }]}>
            <Row>
              <Input
                style={{ marginBottom: 10 }}
                defaultValue={data ? data.offer_id : ''}
                onChange={(e: any) => {
                  // console.log(e.target.value)
                  setOfferId(e.target.value)
                }}
              />
              <Button type='primary' onClick={onSearchOffer}>
                Search
              </Button>
            </Row>
          </Form.Item>
          <Form.Item className='mt-40' name={'owner'} label={tradingPageLocales.owner} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name={'rate'}
            label={tradingPageLocales.rate}
            rules={[{ type: 'number', min: 0, max: 99, required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name={'volume'}
            label={tradingPageLocales.volume}
            rules={[{ type: 'number', min: 0, max: 99, required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name={'speed'}
            label={tradingPageLocales.speed}
            rules={[{ type: 'number', min: 0, max: 99, required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name={'reserved'}
            label={tradingPageLocales.reserved}
            rules={[{ type: 'number', min: 0, max: 99, required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name={'provider'} label={tradingPageLocales.provider} rules={[{ required: true }]}>
            <Select showSearch style={{ width: 200 }} placeholder='Provider'>
              <Option value='Human'>Human</Option>
              <Option value='Bot'>Bot</Option>
              <Option value='Platform'>Platform</Option>
            </Select>
          </Form.Item>
          <Form.Item name={'vault_addr'} label={tradingPageLocales.vault_addr} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className='display-none' name={'splTokenMint'}>
            <Input />
          </Form.Item>
          <Form.Item
            className='mt-40'
            name={'amount'}
            label={tradingPageLocales.amount}
            rules={[{ type: 'number', min: 10000, max: 1000000, required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name={'locked'}
            label={tradingPageLocales.locked}
            rules={[{ type: 'number', min: 0, required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name={'my_wallet'} label={tradingPageLocales.my_wallet} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button className='mr-10' type='primary' htmlType='submit'>
              Accept
            </Button>
          </Form.Item>
        </Form>
      </TabPane>
      <TabPane tab='Trading...' key='2'>
        <Form
          className='mt-20'
          {...layout}
          name='solana-other-trading'
          onFinish={onClaim}
          validateMessages={validateMessages}
          ref={formRef2}
        >
          <Form.Item name={'trading_id'} label={tradingPageLocales.trading_id} rules={[{ required: true }]}>
            <Row>
              <Input
                style={{ marginBottom: 10 }}
                onChange={(e: any) => {
                  // console.log(e.target.value)
                  setTradingId(e.target.value)
                }}
              />
              <Button type='primary' onClick={onSearchTrading}>
                Search
              </Button>
            </Row>
          </Form.Item>
          <Form.Item
            className='mt-40'
            name={'offer_owner'}
            label={tradingPageLocales.offer_owner}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={'rate'}
            label={tradingPageLocales.rate}
            rules={[{ type: 'number', min: 0, max: 99, required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name={'provider'} label={tradingPageLocales.provider} rules={[{ required: true }]}>
            <Select showSearch style={{ width: 200 }} placeholder='Provider'>
              <Option value='Human'>Human</Option>
              <Option value='Bot'>Bot</Option>
              <Option value='Platform'>Platform</Option>
            </Select>
          </Form.Item>
          <Form.Item name={'vault_addr'} label={tradingPageLocales.vault_addr} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            className='mt-40'
            name={'amount'}
            label={tradingPageLocales.amount}
            rules={[{ type: 'number', min: 10000, max: 1000000, required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name={'locked_time'}
            label={tradingPageLocales.locked_time}
            rules={[{ type: 'number', min: 0, required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name={'my_wallet'} label={tradingPageLocales.my_wallet} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Row>
              <p>status : Accepted</p>
              <Button className='ml-10' type='primary' onClick={onRequestUpdate}>
                Request for update
              </Button>
            </Row>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button className='mr-10' type='primary' htmlType='submit'>
              Claim
            </Button>
            <Button type='primary' htmlType='submit'>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </TabPane>
    </Tabs>
  )
}
