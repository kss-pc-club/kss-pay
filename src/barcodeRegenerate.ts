//----- ユーザーのバーコードを再生成する -----//
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'

import { firebaseApp, firestore, userData } from './firebase'

const randomBarcode = () => {
  // 重複が生じた場合、会計時に更新してもらう
  const rand = Array.from(String(Math.round(Math.random() * 1e12))).map((_) =>
    Number(_)
  )
  if (rand.length !== 12) {
    return ''
  }
  let calc = 0
  for (let i = 0; i < 12; i++) {
    calc += i % 2 === 0 ? rand[i] : rand[i] * 3
  }
  calc = (10 - (calc % 10)) % 10
  return rand.join('') + String(calc)
}

const barcodeRegenerate = async () => {
  // console.log(userData)
  const uid = userData.uid
  const user = doc(collection(firestore, 'users'), uid || undefined)
  if (!(await getDoc(user)).exists) {
    // User does not exist
    return false
  }
  while (true) {
    const newBarcode = randomBarcode()
    if (!newBarcode) {
      continue
    }
    await setDoc(user, { barcode: newBarcode }, { merge: true })
    break
  }
  return true
}

export { barcodeRegenerate }
