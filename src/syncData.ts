//----- ユーザーデータを読み込む処理 -----//
import 'firebase/firestore'

import $ from 'jquery'

import { generateBarcode, loadingBarcode } from './barcode/canvas'
import { firebase } from './firebase'
import { FetchPOST, toast } from './functions'
import { userDBData } from './type'

const sync = async (): Promise<void> => {
  // 更新中であることを知らせるUI
  $('div.container.barcode p.money').html(
    '<span class="placeholder"><span class="placeholder-bg"></span></span>'
  )
  $('div.container.barcode p.unit').hide()
  loadingBarcode()

  const uId = firebase.auth().currentUser?.uid
  if (!uId) {
    void toast('更新に失敗しました。')
    return
  }

  // バーコード再生成
  const res = await FetchPOST(
    'https://admin.fes.kss-pc.club/pay/barcodeRegenerate',
    { uid: uId }
  )

  // 新規ユーザー
  if (res.status === 400) {
    await FetchPOST('https://admin.fes.kss-pc.club/pay/userInit', { uid: uId })
    await FetchPOST('https://admin.fes.kss-pc.club/pay/barcodeRegenerate', {
      uid: uId,
    })
  }

  // 更新処理
  firebase
    .firestore()
    .collection('users')
    .doc(uId)
    .get({})
    .then((response) => {
      const userData: userDBData = response.data() as userDBData

      // 描画
      if (userData) {
        $('div.container.barcode p.money').text(userData.money.toLocaleString())
        $('div.container.barcode p.unit').show()
        generateBarcode(Number(userData.barcode))
      }
    })
    .catch(console.error)
}

export { sync }
