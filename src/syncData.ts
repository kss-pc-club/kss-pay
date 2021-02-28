//----- ユーザーデータを読み込む処理 -----//
import 'firebase/firestore'

import $ from 'jquery'

import { generateBarcode } from './barcode/canvas'
import { firebase } from './firebase'
import { userDBData } from './type'

const sync = () => {
  // 更新中であることを知らせるUI
  $('div.container.barcode p.money').html(
    '<span class="placeholder"><span class="placeholder-bg"></span></span>'
  )
  $('div.container.barcode p.unit').hide()

  // 更新処理
  const uId = firebase.auth().currentUser?.uid
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
