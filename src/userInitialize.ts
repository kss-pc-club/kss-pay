//----- ユーザーがいない場合の初期化 -----//

import { collection, doc, getDoc, setDoc } from 'firebase/firestore'

import { firestore, userData } from './firebase'
import { userDBData } from './type'

const userInitialize = async () => {
  const uid = userData.uid
  const user = doc(collection(firestore, 'users'), uid || undefined)
  if (((await getDoc(user)).data() as userDBData)?.initialized) {
    // User has already been initialized
    return false
  }
  await setDoc(user, {
    barcode: '0000000000000',
    money: 0,
    history: [],
    initialized: true,
  } as userDBData)
  return true
}
export { userInitialize }
