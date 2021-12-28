import { auth } from 'firebaseui'

import { firebase } from './firebase'

window.addEventListener('DOMContentLoaded', () => {
  if (location.pathname === '/login') {
    const ui = new auth.AuthUI(firebase.auth())
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
        signInFailure: (err) => {
          console.error(err)
        },
        uiShown: () => {
          document.getElementById('loading')!.style.display = 'none'
        },
      },
      signInSuccessUrl: '/',
      privacyPolicyUrl: '/policy',
    })
  }
})
