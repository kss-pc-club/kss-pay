//----- Firebase関連の処理 -----//
import { initializeApp } from 'firebase/app'
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
} from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'

import { firebaseConfig } from './firebaseConfig'
import { firebaseUserDataLoaded } from './main'
import { usrAuthData } from './type'

// ユーザーデータを保存
let userData: usrAuthData = {
  name: '',
  uid: '',
  mail: '',
  google: '',
  twitter: '',
  facebook: '',
  mailVerified: false,
}

// Firebaseを初期化
export const firebaseApp = initializeApp(firebaseConfig)
export const firestore = initializeFirestore(firebaseApp, {})
export const auth = getAuth(firebaseApp)

// ログイン状態が変更されたときの処理
onAuthStateChanged(auth, (user) => {
  if (user) {
    // ログイン状態
    if (location.pathname === '/login') {
      location.pathname = '/'
      return
    }
    userData = {
      name: user.displayName,
      uid: user.uid,
      mail: user.providerData.filter(
        (provider) => provider?.providerId === 'password'
      )[0]?.uid,
      google: user.providerData.filter(
        (provider) => provider?.providerId === 'google.com'
      )[0]?.photoURL,
      twitter: user.providerData.filter(
        (provider) => provider?.providerId === 'twitter.com'
      )[0]?.photoURL,
      facebook: user.providerData.filter(
        (provider) => provider?.providerId === 'facebook.com'
      )[0]?.photoURL,
      mailVerified: user.emailVerified,
    }

    firebaseUserDataLoaded()
  } else {
    // 非ログイン状態
    if (location.pathname !== '/login') {
      location.pathname = '/login'
    }
  }
})

// Firebaseの認証にデバイスの言語を利用する
auth.languageCode = 'ja'

// ログイン状態の保持期間の設定
setPersistence(auth, browserLocalPersistence).catch(console.error)

export { userData }
