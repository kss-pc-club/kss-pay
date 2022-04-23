import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider,
} from 'firebase/auth'
import $ from 'jquery'

import { auth } from './firebase'

const GProvider = new GoogleAuthProvider()
const FProvider = new FacebookAuthProvider()
const TProvider = new TwitterAuthProvider()

window.addEventListener('DOMContentLoaded', () => {
  if (location.pathname === '/login') {
    $('#google-login').on('click', () => {
      signInWithPopup(auth, GProvider).catch(console.error)
    })
    $('#facebook-login').on('click', () => {
      signInWithPopup(auth, FProvider).catch(console.error)
    })
    $('#twitter-login').on('click', () => {
      signInWithPopup(auth, TProvider).catch(console.error)
    })
  }
})
