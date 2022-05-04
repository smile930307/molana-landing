import { Dashboard, AttachMoney } from '@styled-icons/material'

type MenuOption = {
  name: string
  icon: React.ComponentType
  url: string
  subItems?: MenuOption[]
}

const MENU_OPTIONS: MenuOption[] = [
  {
    name: 'Global Settings',
    icon: Dashboard,
    url: '/admin/global_setting'
  },
  {
    name: 'Create Vaults',
    icon: AttachMoney,
    url: '/admin/create_vaults'
  },
  {
    name: 'Trade Vaults',
    icon: AttachMoney,
    url: '/admin/trade_vaults'
  }
]

export type MenuItem = {
  name: string
  icon: React.ComponentType
  url: string
  id: string
  depth: number
  subItems?: MenuItem[]
}

function makeMenuLevel(options: MenuOption[], depth = 0): MenuItem[] {
  return options.map((option, idx) => ({
    ...option,
    id: depth === 0 ? idx.toString() : `${depth}.${idx}`,
    depth,
    subItems: option.subItems && option.subItems.length > 0 ? makeMenuLevel(option.subItems, depth + 1) : undefined
  }))
}

export const MENU_ITEMS: MenuItem[] = makeMenuLevel(MENU_OPTIONS)
