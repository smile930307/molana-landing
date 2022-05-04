/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useContext, useRef } from 'react'
import { getTraderAccount, initMolanaProgram, setTraderAccount } from '../../integration/molana-integration'
import { useSolana, useWallet } from '@saberhq/use-solana'
import * as anchor from '@project-serum/anchor'
import { config } from '../../constants/config'
import { printlog, showErrorToast, showInfoToast, showSuccessToast } from '../../functions/utils'
import { ConnectWalletButton } from '@gokiprotocol/walletkit'
import {
  Layout,
  Menu,
  Image,
  Button,
  Row,
  Form,
  Input,
  Select,
  Modal,
  List,
  Avatar,
  AutoComplete,
  AutoCompleteProps,
  FormInstance
} from 'antd'
import { UserOutlined, VideoCameraOutlined, UploadOutlined } from '@ant-design/icons'
import React from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../AppGlobalContext'
// import { tokens } from '../../constants/sol_tokens'
import { ENV, TokenListProvider } from '@solana/spl-token-registry'
import { ether_tokens } from '../../constants/ether_tokens'
import { bsc_tokens } from '../../constants/bsc_tokens'
import { our_tokens } from '../../constants/our_tokens'
import { BaseSelectRef } from 'rc-select'
import { globalMessage } from '../../constants/locales/locales'

type TradingLayoutProps = {
  children: React.ReactNode
}

export default function TradingLayout({ children }: TradingLayoutProps) {
  const { disconnect } = useSolana()
  const { setValue } = useAuth()
  const { Header, Sider, Content } = Layout
  const { connected, connection, wallet } = useWallet()
  const [traderAccountInfo, setTradeAccountData] = useState<any>()
  const [chain_type_a, setChainTypeA] = useState<string>('Payoneer')
  const [chain_type_b, setChainTypeB] = useState<string>('Payoneer')
  const [token_a, setTokenA] = useState<string>('')
  const [token_b, setTokenB] = useState<string>('')

  const [selected_token_a, setSelectedTokenA] = useState<any>()
  const [selected_token_b, setSelectedTokenB] = useState<any>()
  const [solanaTokens, setSolanaTokens] = useState<any>()

  const [disp_token_list_a, setDispTokenListA] = useState<any>()
  const [disp_token_list_b, setDispTokenListB] = useState<any>()

  const router = useRouter()
  const { Option } = Select

  const ethlist = [...ether_tokens.tokens, ...our_tokens.ether_tokens]
  const bsclist = [...bsc_tokens.tokens, ...our_tokens.bsc_tokens]

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 10 }
  }

  const formRef = React.createRef<FormInstance>()

  const onCreateTraderAccount = async () => {
    if (!connected) return showInfoToast(globalMessage.check_wallet_connection)
    try {
      await setTraderAccount().then((e) => {
        if (e.success) {
          showSuccessToast(e.msg)
          router.push('/trading')
        } else {
          showErrorToast(e.msg)
        }
      })
    } catch (e) {
      console.log('exception->', e)
      showErrorToast(globalMessage.error_occured)
    }
  }

  useEffect(() => {
    if (connected && wallet?.publicKey) {
      try {
        const res = initMolanaProgram(connection, wallet, new anchor.web3.PublicKey(config.molanaPid))
        if (res.success) {
          getTraderAccount().then((traderAccount) => {
            console.log(traderAccount)
            if (traderAccount) {
              setTradeAccountData(traderAccount)
            }
          })
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      console.log('Wallet not connected')
    }
  }, [connected, wallet, connection])

  useEffect(() => {
    new TokenListProvider().resolve().then((tokens) => {
      setSolanaTokens(tokens)
    })
  }, [])

  const onFilterTokenA = (e: any) => {
    if (solanaTokens == null) return
    const temp: any[] = []
    let list: any[]
    let exactitems: any[] = []
    if (chain_type_a == 'Solana') {
      const solana = solanaTokens?.filterByChainId(ENV.MainnetBeta).getList()
      list = [...solana, ...our_tokens.sol_tokens]
    } else if (chain_type_a == 'Ethereum') {
      list = ethlist
    } else {
      list = bsclist
    }
    console.log(list)
    list.map((item: any) => {
      if (item.symbol.toUpperCase().startsWith(e.toUpperCase())) {
        if (item.symbol.toUpperCase() == e.toUpperCase()) {
          exactitems.push(item)
        } else {
          temp.push(item)
        }
      }
    })
    exactitems = [...exactitems, ...temp]
    exactitems.sort((a, b) => a.symbol.charCodeAt(0) - b.symbol.charCodeAt(0))
    setDispTokenListA(exactitems.slice(0, 8))
  }

  const onFilterTokenB = (e: any) => {
    if (solanaTokens == null) return
    const temp: any[] = []
    let list: any[]
    let exactitems: any[] = []
    if (chain_type_b == 'Solana') {
      const solana = solanaTokens?.filterByChainId(ENV.MainnetBeta).getList()
      list = [...solana, ...our_tokens.sol_tokens]
    } else if (chain_type_b == 'Ethereum') {
      list = ethlist
    } else {
      list = bsclist
    }
    list.map((item: any) => {
      if (item.symbol.toUpperCase().startsWith(e.toUpperCase())) {
        if (item.symbol.toUpperCase() == e.toUpperCase()) {
          exactitems.push(item)
        } else {
          temp.push(item)
        }
      }
    })
    exactitems = [...exactitems, ...temp]
    exactitems.sort((a, b) => a.symbol.charCodeAt(0) - b.symbol.charCodeAt(0))
    setDispTokenListB(exactitems.slice(0, 8))
  }

  const onFindOffers = (values: any) => {
    printlog('onFindOffers', values)
    router.push('/trading/find_offers')
  }

  const onChangeChainA = (val: string) => {
    formRef.current?.setFieldsValue({ toke_addr_a: '' })
    setSelectedTokenA(null)
    setChainTypeA(val)
    setValue({
      chain_type_a: val,
      token_a: token_a,
      chain_type_b: chain_type_b,
      token_b: token_b
    })

    let list: any[]
    if (val == 'Solana') {
      const temp = solanaTokens?.filterByChainId(ENV.MainnetBeta).getList()
      list = [...temp, ...our_tokens.sol_tokens]
    } else if (val == 'Ethereum') {
      list = ethlist
    } else {
      list = bsclist
    }
    list.sort((a, b) => a.symbol.charCodeAt(0) - b.symbol.charCodeAt(0))
    setDispTokenListA(list.slice(0, 8))
  }

  const onChangeChainB = (val: string) => {
    formRef.current?.setFieldsValue({ toke_addr_b: '' })
    setSelectedTokenB(null)
    setChainTypeB(val)
    setValue({
      chain_type_a: chain_type_a,
      token_a: token_a,
      chain_type_b: val,
      token_b: token_b
    })

    let list: any[] = []
    if (val == 'Solana') {
      const temp = solanaTokens?.filterByChainId(ENV.MainnetBeta).getList()
      list = [...temp, ...our_tokens.sol_tokens]
    } else if (val == 'Ethereum') {
      list = ethlist
    } else {
      list = bsclist
    }
    list.sort((a, b) => a.symbol.charCodeAt(0) - b.symbol.charCodeAt(0))
    setDispTokenListB(list.slice(0, 8))
  }

  return (
    <Layout id='trading-layout' style={{ height: '100vh', overflow: 'scroll' }}>
      <Sider trigger={null} collapsible width={300} style={{ position: 'sticky', top: 0, left: 0 }}>
        <div className='logo'>
          <Image src={'/logo/top-logo.png'} alt='logo image' width={270} height={38} />
        </div>
        <Form {...layout} name='solana-solana' onFinish={onFindOffers} ref={formRef}>
          <h1 className='ml-10'>What &nbsp; I &nbsp; have</h1>
          <Form.Item name={'chain_type_a'}>
            <Select
              className='ml-10'
              showSearch
              style={{ width: 280 }}
              defaultValue='Payoneer'
              placeholder='Your Payment / Chain'
              onSelect={onChangeChainA}
            >
              <Option value='Payoneer'>Payoneer</Option>
              <Option value='Solana'>Solana</Option>
              <Option value='Ethereum'>Ethereum</Option>
              <Option value='BSC'>BSC</Option>
            </Select>
          </Form.Item>
          {chain_type_a == 'Payoneer' ? (
            <Form.Item name={'symbol_a'}>
              <Select
                className='ml-10'
                showSearch
                style={{ width: 280 }}
                placeholder='Currency'
                onSelect={(val: string) => {
                  setTokenA(val)
                  setValue({
                    chain_type_a: chain_type_a,
                    token_a: val,
                    chain_type_b: chain_type_b,
                    token_b: token_b
                  })
                }}
              >
                <Option value='USD'>USD</Option>
                <Option value='GBP'>GBP</Option>
                <Option value='EUR'>EUR</Option>
              </Select>
            </Form.Item>
          ) : (
            <Form.Item name={'toke_addr_a'}>
              <AutoComplete
                className='ml-10'
                style={{ width: 280 }}
                placeholder='Token address or Symbol'
                onSelect={(value: string, option: any) => {
                  console.log(option)
                  setSelectedTokenA(option)
                }}
                onChange={(val) => {
                  // console.log(val)
                  if (!val) {
                    setSelectedTokenA(null)
                  }
                }}
                onSearch={onFilterTokenA}
                dataSource={disp_token_list_a?.map((item: any) => (
                  <Option
                    key={
                      '(' +
                      item.symbol +
                      ') ' +
                      item.address.substring(0, 10) +
                      '...' +
                      item.address.substring(item.address.length - 10, item.address.length)
                    }
                  >
                    <div style={{ display: 'flex' }}>
                      <img src={item.logoURI} width={20} height={20} alt='' />
                      <div className='ml-5'>
                        <p className='m-0 text-sm '>{item.symbol}</p>
                        <p className='m-0 text-sm '>{item.address}</p>
                      </div>
                    </div>
                  </Option>
                ))}
              >
                <Input prefix={selected_token_a ? selected_token_a.children.props.children[0] : <></>} />
              </AutoComplete>
            </Form.Item>
          )}

          <h1 className='ml-10'>What &nbsp; I &nbsp; want</h1>
          <Form.Item name={'chain_type_b'}>
            <Select
              className='ml-10'
              showSearch
              defaultValue='Payoneer'
              style={{ width: 280 }}
              placeholder='Your Payment / Chain'
              onSelect={onChangeChainB}
            >
              <Option value='Payoneer'>Payoneer</Option>
              <Option value='Solana'>Solana</Option>
              <Option value='Ethereum'>Ethereum</Option>
              <Option value='BSC'>BSC</Option>
            </Select>
          </Form.Item>
          {chain_type_b == 'Payoneer' ? (
            <Form.Item name={'symbol_b'}>
              <Select
                className='ml-10'
                showSearch
                style={{ width: 280 }}
                placeholder='Currency'
                onSelect={(val: string) => {
                  setTokenB(val)
                  setValue({
                    chain_type_a: chain_type_a,
                    token_a: token_a,
                    chain_type_b: chain_type_b,
                    token_b: val
                  })
                }}
              >
                <Option value='USD'>USD</Option>
                <Option value='GBP'>GBP</Option>
                <Option value='EUR'>EUR</Option>
              </Select>
            </Form.Item>
          ) : (
            <Form.Item name={'toke_addr_b'}>
              <AutoComplete
                className='ml-10'
                style={{ width: 280 }}
                placeholder='Token address or Symbol'
                onSelect={(value: string, option: any) => {
                  console.log(option)
                  setSelectedTokenB(option)
                }}
                onChange={(val) => {
                  // console.log(val)
                  if (!val) {
                    setSelectedTokenB(null)
                  }
                }}
                onSearch={onFilterTokenB}
                dataSource={disp_token_list_b?.map((item: any) => (
                  <Option
                    key={
                      '(' +
                      item.symbol +
                      ') ' +
                      item.address.substring(0, 10) +
                      '...' +
                      item.address.substring(item.address.length - 10, item.address.length)
                    }
                  >
                    <div style={{ display: 'flex' }}>
                      <img src={item.logoURI} width={20} height={20} alt='' />
                      <div className='ml-5'>
                        <p className='m-0 text-sm '>{item.symbol}</p>
                        <p className='m-0 text-sm '>{item.address}</p>
                      </div>
                    </div>
                  </Option>
                ))}
              >
                <Input prefix={selected_token_b ? selected_token_b.children.props.children[0] : <></>} />
              </AutoComplete>
            </Form.Item>
          )}
          <Form.Item>
            <Button style={{ width: 280 }} className='ml-10' type='primary' htmlType='submit'>
              Find Offers
            </Button>
          </Form.Item>
        </Form>
        <hr />
        <Menu theme='dark' mode='inline'>
          {connected ? (
            traderAccountInfo ? (
              <>
                <Menu.Item
                  key='1'
                  icon={<UploadOutlined />}
                  onClick={() => {
                    router.push('/trading/my_offer')
                  }}
                >
                  My Offers
                </Menu.Item>
                <Menu.Item
                  key='2'
                  icon={<UserOutlined />}
                  onClick={() => {
                    router.push('/trading/my_trade_vaults')
                  }}
                >
                  My Trade Vaults
                </Menu.Item>
                <Menu.Item
                  key='3'
                  icon={<VideoCameraOutlined />}
                  onClick={() => {
                    router.push('/trading/my_cur_trading')
                  }}
                >
                  My Current Trading
                </Menu.Item>
              </>
            ) : (
              ''
            )
          ) : (
            ''
          )}
        </Menu>
      </Sider>
      <Layout className='site-layout'>
        <Header
          className='site-layout-background'
          style={{ position: 'sticky', top: 0, left: 0, padding: 0, zIndex: 100 }}
        >
          <Row style={{ alignItems: 'center', height: 68, background: '#001529' }}>
            {connected ? (
              traderAccountInfo ? (
                <>
                  <Button
                    className='ml-20 mr-10'
                    htmlType='button'
                    onClick={() => {
                      router.push('/trading/create_offer')
                    }}
                  >
                    Create an offer
                  </Button>
                  <Button
                    htmlType='button'
                    onClick={() => {
                      router.push('/trading/create_router')
                    }}
                  >
                    Payoneer router
                  </Button>
                  <div className='mx-auto'></div>
                  {/* <Button
                    className='mr-10'
                    htmlType='button'
                    onClick={() => {
                      router.push('/trading/my_info')
                    }}
                  >
                    My info
                  </Button> */}
                  <Button className='mr-20' onClick={() => disconnect()}>
                    {wallet?.publicKey?.toBase58()}
                  </Button>
                </>
              ) : (
                <>
                  <Button className='ml-20 mr-10' htmlType='button' onClick={onCreateTraderAccount}>
                    Create trader account
                  </Button>
                  <Button
                    htmlType='button'
                    onClick={() => {
                      router.push('/trading/create_router')
                    }}
                  >
                    Payoneer router
                  </Button>
                  <div className='mx-auto'></div>
                  <Button className='mr-20' onClick={() => disconnect()}>
                    {wallet?.publicKey?.toBase58()}
                  </Button>
                </>
              )
            ) : (
              <>
                <div className='mx-auto'></div>
                <ConnectWalletButton className='ml-20 mr-20' />
              </>
            )}
          </Row>
        </Header>
        <Content className='site-layout-background'>{children}</Content>
      </Layout>
    </Layout>
  )
}
