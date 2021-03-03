//----- 使用するタイプ一覧 -----//
import { firebase } from './firebase'

// 使用できるプロバイダのクラス。今のところGoogle、Facebook、Twitterの3種。
type Provider =
  | firebase.auth.GoogleAuthProvider
  | firebase.auth.FacebookAuthProvider
  | firebase.auth.TwitterAuthProvider

// 使用できるプロバイダの名前
type providers = 'facebook' | 'google' | 'twitter' | 'mail'

// ユーザー認証データ
type usrAuthData = {
  name: string | null
  uid: string | null
  mail: string | null | undefined
  google: string | null | undefined
  twitter: string | null | undefined
  facebook: string | null | undefined
  mailVerified: boolean
}

// モーダルの引数
type modal_option = {
  ttl: string
  detail: string
  link?: {
    show: boolean
    url: string
    ttl: string
  }
}

// ユーザー データベース内のデータ
type userDBData =
  | {
      barcode: string
      money: number
      history: {
        time: string
        place: string
        item: string
        amount: number
        cost: number
      }[]
    }
  | undefined

export { Provider, providers, usrAuthData, modal_option, userDBData }
