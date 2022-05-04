/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useSolana, useWallet } from '@saberhq/use-solana'
import { ConnectWalletButton } from '@gokiprotocol/walletkit'
import { Layout, Menu, Image, Row } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined
} from '@ant-design/icons'
import React from 'react'
import { useRouter } from 'next/router'

type AdminLayoutProps = {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { disconnect } = useSolana()
  const { Header, Sider, Content } = Layout
  const { connected, wallet } = useWallet()
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const router = useRouter()

  const toggle = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout id='trading-layout' style={{ height: '100vh', overflow: 'scroll' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={300}
        style={{ position: 'sticky', top: 0, left: 0 }}
      >
        <div className='logo'>
          {collapsed ? (
            <Image src={'/logo/icon-logo-circle.png'} alt='logo image' width={38} height={38} />
          ) : (
            <Image src={'/logo/top-logo.png'} alt='logo image' width={270} height={38} />
          )}
        </div>
        <Menu theme='dark' mode='inline'>
          <Menu.Item
            key='1'
            icon={<UploadOutlined />}
            onClick={() => {
              router.push('/admin/global_setting')
            }}
          >
            Global Settings
          </Menu.Item>
          <Menu.Item
            key='2'
            icon={<UserOutlined />}
            onClick={() => {
              router.push('/admin/create_vaults')
            }}
          >
            Create Vaults
          </Menu.Item>
          <Menu.Item
            key='3'
            icon={<VideoCameraOutlined />}
            onClick={() => {
              router.push('/admin/trade_vaults')
            }}
          >
            Trade Vaults
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className='site-layout'>
        <Header
          className='site-layout-background'
          style={{ position: 'sticky', top: 0, left: 0, padding: 0, zIndex: 100 }}
        >
          <Row style={{ alignItems: 'center', height: 68, background: '#001529' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger color-white',
              onClick: toggle
            })}
            <div className='mx-auto' />
            {connected ? (
              <button className='disconnectBtn' onClick={() => disconnect()}>
                {wallet?.publicKey?.toBase58()}
              </button>
            ) : (
              <ConnectWalletButton style={{ marginRight: '20px' }} />
            )}
          </Row>
        </Header>
        <Content className='site-layout-background'>{children}</Content>
      </Layout>
    </Layout>
  )
}
