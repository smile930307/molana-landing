/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, InputNumber, Button, Tabs, Row, notification, Select } from 'antd'
import { useEffect, useState } from 'react'
import { globalMessage, tradingPageLocales } from '../../../constants/locales/locales'
import {
  acceptEthBscOffer,
  getEthBscOffer,
  getEthBscTrading,
  initMolanaProgram,
  Network,
  setEthBscOffer
} from '../../../integration/molana-integration'
import * as anchor from '@project-serum/anchor'
import { useWallet } from '@saberhq/use-solana'
import { printlog, printloginfo, showErrorToast, showInfoToast, showSuccessToast } from '../../../functions/utils'
import React from 'react'
import { FormInstance } from 'antd/es/form'
import { config } from '../../../constants/config'

export default function OtherOtherPage(data: any) {
  const { connected, wallet, connection } = useWallet()
  const { TabPane } = Tabs
  const [tradingId, setTradingId] = useState<string>()
  const [offerId, setOfferId] = useState<string>(data ? data.offer_id : '')
  const [activeTab, setActiveTab] = useState<string>('1')
  const { Option } = Select
  const offerformRef = React.createRef<FormInstance>()
  const tradingformRef = React.createRef<FormInstance>()

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
    printlog('onAccept', values)
    // setActiveTab('2')
    try {
      acceptEthBscOffer(
        values.aNetwork,
        values.aToken,
        values.aVault,
        values.bNetwork,
        values.bToken,
        values.bVault,
        new anchor.BN(values.amount),
        new anchor.BN(values.locked_time),
        new anchor.web3.PublicKey(values.offer_id)
      ).then((res) => {
        if (res.success) {
          showSuccessToast(res.msg)
          setActiveTab('2')
        } else {
          showErrorToast(res.msg)
        }
      })
    } catch (e) {
      showErrorToast('Something was wrong.')
    }
  }

  const onRequestUpdate = (values: any) => {
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    try {
      // setEthBscTraderTx(new anchor.web3.PublicKey(values.trading_id), new anchor.web3.PublicKey(values.my_wallet)).then(
      //   (res) => {
      //     if (res.success) {
      //       notification.success({
      //         message: 'Notification',
      //         description: res.msg
      //       })
      //     } else {
      //       notification.error({
      //         message: 'Notification',
      //         description: res.msg
      //       })
      //     }
      //   }
      // )
    } catch (e) {
      console.log(e)
      showErrorToast('Something was wrong.')
    }
  }

  const onSearchOffer = () => {
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    if (offerId != null && offerId != '') {
      try {
        getEthBscOffer(new anchor.web3.PublicKey(data.offer_id)).then((offer) => {
          printlog('loaded offer data', offer)
          if (offer != null) {
            const temp = {
              offer_id: data.offer_id,
              owner: offer.owner.toBase58(),
              rate: 0,
              volume: 0,
              speed: 0,
              reserved: 0,
              provider: 'Bot',
              amount: 10000,
              locked: 0,
              my_wallet: '',
              vault_addr: offer.aVault,
              aNetwork: offer.aNetwork,
              aToken: offer.aToken,
              aVault: offer.aVault,
              bNetwork: offer.bNetwork,
              bToken: offer.aToken,
              bVault: offer.aVault
            }
            offerformRef.current?.setFieldsValue(temp)
          } else {
            showInfoToast('No offer data.')
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
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    if (tradingId != null && tradingId != '') {
      try {
        getEthBscTrading(new anchor.web3.PublicKey(tradingId)).then((offer) => {
          printlog('loaded offer data', offer)
          if (offer != null) {
            const temp = {
              offer_id: data.offer_id,
              owner: offer.owner.toBase58(),
              rate: 0,
              volume: 0,
              speed: 0,
              reserved: 0,
              provider: 'Bot',
              amount: 10000,
              locked: 0,
              my_wallet: '',
              vault_addr: offer.aVault,
              aNetwork: offer.aNetwork,
              aToken: offer.aToken,
              aVault: offer.aVault,
              bNetwork: offer.bNetwork,
              bToken: offer.aToken,
              bVault: offer.aVault
            }
            tradingformRef.current?.setFieldsValue(temp)
          } else {
            showInfoToast('No offer data.')
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

  useEffect(() => {
    if (connected && wallet && connection && data != null && data.offer_id) {
      try {
        initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        getEthBscOffer(new anchor.web3.PublicKey(data.offer_id)).then((offer) => {
          printlog('loaded offer data', offer)
          if (offer != null) {
            const temp = {
              offer_id: data.offer_id,
              owner: offer.owner.toBase58(),
              rate: 0,
              volume: 0,
              speed: 0,
              reserved: 0,
              provider: 'Bot',
              amount: 10000,
              locked: 0,
              my_wallet: '',
              vault_addr: offer.aVault,
              aNetwork: offer.aNetwork,
              aToken: offer.aToken,
              aVault: offer.aVault,
              bNetwork: offer.bNetwork,
              bToken: offer.aToken,
              bVault: offer.aVault
            }
            offerformRef.current?.setFieldsValue(temp)
          } else {
            showInfoToast('No offer data.')
          }
        })
      } catch (e) {
        console.log(e)
        showErrorToast('Something was wrong.')
      }
    }
  }, [connected])

  return (
    <Tabs defaultActiveKey='1' activeKey={activeTab}>
      <TabPane tab='Accepting...' key='1'>
        <Form
          className='mt-20'
          {...layout}
          name='solana-other-accepting'
          onFinish={onAccept}
          validateMessages={validateMessages}
          ref={offerformRef}
        >
          <Form.Item name={'offer_id'} label={tradingPageLocales.offer_id} rules={[{ required: true }]}>
            <Row>
              <Input
                style={{ marginBottom: 10 }}
                defaultValue={data ? data.offer_id : ''}
                onChange={(e: any) => {
                  setOfferId(e.target.value)
                }}
              />
              <Button type='primary' onClick={onSearchOffer}>
                Search
              </Button>
            </Row>
          </Form.Item>
          <Form.Item className='mt-20' name={'owner'} label={tradingPageLocales.owner} rules={[{ required: true }]}>
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
          <Form.Item name={'send_addr'} label={tradingPageLocales.send_addr} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'received_addr'} label={tradingPageLocales.received_addr} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className='display-none' name={'aNetwork'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className='display-none' name={'aToken'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className='display-none' name={'aVault'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className='display-none' name={'bNetwork'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className='display-none' name={'bToken'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className='display-none' name={'bVault'} rules={[{ required: true }]}>
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
          onFinish={onRequestUpdate}
          validateMessages={validateMessages}
          ref={tradingformRef}
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
            className='mt-20'
            name={'amount'}
            label={tradingPageLocales.amount}
            rules={[{ type: 'number', min: 10000, max: 1000000, required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name={'locked_time'}
            label={tradingPageLocales.locked_time}
            rules={[{ type: 'number', min: 0, max: 99, required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name={'send_addr'} label={tradingPageLocales.send_addr} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'received_addr'} label={tradingPageLocales.received_addr} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Row>
              <p>status : Accepted</p>
              <Button className='ml-10' type='primary' htmlType='submit'>
                Request for update
              </Button>
            </Row>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type='primary'>Cancel</Button>
          </Form.Item>
        </Form>
      </TabPane>
    </Tabs>
  )
}
