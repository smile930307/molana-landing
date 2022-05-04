import { notification } from 'antd'

const showlog = true
export const printlog = (title: string, content: any) => {
  if (showlog) {
    console.log('[DEV]' + title + '--> ', content)
  }
}

export const printloginfo = (content: string) => {
  if (showlog) {
    console.log('[DEV] info--> ', content)
  }
}

export const showErrorToast = (content: string) => {
  notification.error({
    message: 'Notification',
    description: content
  })
}

export const showSuccessToast = (content: string) => {
  notification.success({
    message: 'Notification',
    description: content
  })
}

export const showInfoToast = (content: string) => {
  notification.info({
    message: 'Notification',
    description: content
  })
}
