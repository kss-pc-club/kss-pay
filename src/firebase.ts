//----- Firebase関連の処理 -----//
// FirebaseUIが未対応のため、しばらくはfirebase/compatを使用
// ref: https://firebase.google.com/docs/web/modular-upgrade
import 'firebase/compat/auth'

import firebase from 'firebase/compat/app'

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
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()

// ログイン状態が変更されたときの処理
auth.onAuthStateChanged((user) => {
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
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(console.error)

export { firebase, userData, auth }
