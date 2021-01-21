//----- ログイン処理 -----//
import * as firebaseui from 'firebaseui'

import { firebase } from './firebase'

if (location.pathname === '/login') {
  const ui = new firebaseui.auth.AuthUI(firebase.auth())
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => {
        return true
      },
    },
    signInSuccessUrl: '/',
    privacyPolicyUrl: '/policy',
  })
}
