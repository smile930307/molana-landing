/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, InputNumber, Button, Tabs, Row, Select } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { globalMessage, tradingPageLocales } from '../../../constants/locales/locales'
import {
  buySolOffer,
  checkWalletATA,
  getSolOffer,
  initMolanaProgram,
  sellSolOffer
} from '../../../integration/molana-integration'
import * as anchor from '@project-serum/anchor'
import { FormInstance } from 'antd/es/form'
import React from 'react'
import { useWallet } from '@saberhq/use-solana'
import { printlog, showErrorToast, showInfoToast, showSuccessToast } from '../../../functions/utils'
import { config } from '../../../constants/config'
import { useAuth } from '../../AppGlobalContext'

export default function SolanaSolanaPage(props: any) {
  const { value } = useAuth()
  const formRef = React.createRef<FormInstance>()
  const { TabPane } = Tabs
  const [offerId, setOfferId] = useState<string>(props ? props.offer_id : '')
  const { connected, connection, wallet } = useWallet()
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

  const onAccept = async (values: any) => {
    console.log('filter value->', value)
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    try {
      // console.log(values)
      const solOfferData = await getSolOffer(new anchor.web3.PublicKey(values.offer_id))
      if (solOfferData != null) {
        const tradeMintA = solOfferData.tokenMintA.toBase58()
        const tradeMintB = solOfferData.tokenMintB.toBase58()
        const userTadeVaultA = await checkWalletATA(tradeMintA)
        const userTadeVaultB = await checkWalletATA(tradeMintB)
        if (value.chain_type_a == 'Solana' && value.chain_type_b == 'Solana') {
          if (userTadeVaultA && userTadeVaultB) {
            if (tradeMintA == value.token_a) {
              sellSolOffer(
                new anchor.BN(values.amount),
                new anchor.web3.PublicKey(values.offer_id),
                userTadeVaultA,
                userTadeVaultB
              ).then((res) => {
                if (res.success) {
                  showSuccessToast(res.msg)
                } else {
                  showErrorToast(res.msg)
                }
              })
            } else {
              buySolOffer(
                new anchor.BN(values.amount),
                new anchor.web3.PublicKey(values.offer_id),
                userTadeVaultA,
                userTadeVaultB
              ).then((res) => {
                if (res.success) {
                  showSuccessToast(res.msg)
                } else {
                  showErrorToast(res.msg)
                }
              })
            }
          } else {
            showErrorToast(globalMessage.error_occured)
          }
        } else {
          showInfoToast('Please select filter')
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onSearch = () => {
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    if (offerId != null && offerId != '') {
      try {
        getSolOffer(new anchor.web3.PublicKey(offerId)).then((offer) => {
          printlog('searched offer data', offer)
          if (offer != null) {
            const temp = {
              offer_id: props.offer_id,
              owner: offer.owner.toBase58(),
              rate: 0,
              volume: 0,
              speed: 0,
              reserved: 0,
              provider: 'Bot',
              amount: 10000,
              userTreasury_a: offer.userTreasuryA.toBase58(),
              userTreasury_b: offer.userTreasuryB.toBase58()
            }
            formRef.current?.setFieldsValue(temp)
          } else {
            showInfoToast('No result')
          }
        })
      } catch (e) {
        showErrorToast('Something was wrong.')
      }
    } else {
      showInfoToast('Please input offer id.')
    }
  }

  useEffect(() => {
    if (connected && props != null && props.offer_id) {
      try {
        initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        getSolOffer(new anchor.web3.PublicKey(props.offer_id)).then((offer) => {
          console.log('offer data -> ', offer)
          if (offer != null) {
            const temp = {
              offer_id: props.offer_id,
              owner: offer.owner.toBase58(),
              rate: 0,
              volume: 0,
              speed: 0,
              reserved: 0,
              provider: 'Bot',
              amount: 10000,
              userTreasury_a: offer.userTreasuryA.toBase58(),
              userTreasury_b: offer.userTreasuryB.toBase58()
            }
            formRef.current?.setFieldsValue(temp)
          } else {
            showErrorToast('No offer data')
          }
        })
      } catch (e) {
        console.log('exception->', e)
        showErrorToast('Something was wrong')
      }
    }
  }, [connected])

  return (
    <Tabs defaultActiveKey='1'>
      <TabPane tab='Accepting...' key='1'>
        <Form
          className='mt-20'
          {...layout}
          name='solana-solana-accepting'
          onFinish={onAccept}
          validateMessages={validateMessages}
          ref={formRef}
        >
          <Form.Item name={'offer_id'} label={tradingPageLocales.offer_id} rules={[{ required: true }]}>
            <Row>
              <Input
                style={{ marginBottom: 10 }}
                defaultValue={props ? props.offer_id : ''}
                onChange={(e: any) => {
                  setOfferId(e.target.value)
                }}
              />
              <Button type='primary' onClick={onSearch}>
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
          <Form.Item className='display-none' name={'userTreasury_a'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item className='display-none' name={'userTreasury_b'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name={'amount'}
            label={tradingPageLocales.amount}
            rules={[{ type: 'number', min: 10000, max: 1000000, required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button className='mr-10' type='primary' htmlType='submit'>
              Accept
            </Button>
          </Form.Item>
        </Form>
      </TabPane>
    </Tabs>
  )
}
