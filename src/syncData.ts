//----- ユーザーデータを読み込む処理 -----//
import 'firebase/firestore'

import $ from 'jquery'

import { generateBarcode, loadingBarcode } from './barcode/canvas'
import { barcodeRegenerate } from './barcodeRegenerate'
import { firebase } from './firebase'
import { toast } from './functions'
import { historyItemClicked } from './showHistory'
import { userDBData } from './type'
import { userInitialize } from './userInitialize'

const sync = async (): Promise<void> => {
  // 更新中であることを知らせるUI
  $('div.container.barcode p.money').html(
    '<span class="placeholder"><span class="placeholder-bg"></span></span>'
  )
  $('div.container.barcode p.unit').hide()
  loadingBarcode()
  $('div.container.history ul').children().remove()
  $('div.container.history ul').append(
    `<li><p class="when">Loading...</p></li>`
  )

  const uId = firebase.auth().currentUser?.uid
  if (!uId) {
    void toast('更新に失敗しました。')
    return
  }

  // バーコード再生成
  const res = await barcodeRegenerate()

  // 新規ユーザー
  if (!res) {
    await userInitialize()
    await barcodeRegenerate()
  }

  // 更新処理
  firebase
    .firestore()
    .collection('users')
    .doc(uId)
    .get({})
    .then((response) => {
      const userData: userDBData = response.data() as userDBData
      if (userData) {
        // 描画
        $('div.container.barcode p.money').text(userData.money.toLocaleString())
        $('div.container.barcode p.unit').show()
        generateBarcode(Number(userData.barcode))

        // 買い物履歴
        $('div.container.history ul').children().remove()
        if (userData.history.length === 0) {
          $('div.container.history ul').append(`
          <li>
            <p class="when">購入履歴がありません</p>
            <p class="details" data-where="KSS Payで決済してみましょう！"></p>
          </li>`)
        } else {
          userData.history.forEach((hist) => {
            $('div.container.history ul').append(`
            <li>
              <p class="when">${hist.time}</p>
              <p class="details" data-where="${hist.place}" data-what="${hist.item}" data-amount="${hist.amount}"></p>
              <p class="cost">${hist.cost}</p>
            </li>`)
          })
          $('div.container.history ul li').on('click', historyItemClicked)
        }
      } else {
        void toast('ユーザーデータを発見できませんでした...')
      }
    })
    .catch(console.error)
}

export { sync }
