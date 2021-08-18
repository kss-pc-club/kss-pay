//----- ユーザーがいない場合の初期化 -----//

import { firebase, userData } from './firebase'

const userInitialize = async () => {
  const db = firebase.firestore()
  const uid = userData.uid
  const user = db.collection('users').doc(uid || undefined)
  if ((await user.get()).exists) {
    // User does exist
    return false
  }
  await user.set({
    barcode: '0000000000000',
    money: 0,
    history: [],
  })
  return true
}
export { userInitialize }
