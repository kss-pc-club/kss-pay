//----- ユーザーデータを読み込む処理 -----//
import { collection, doc, getDoc } from 'firebase/firestore'
import $ from 'jquery'

import { generateBarcode, loadingBarcode } from './barcode/canvas'
import { barcodeRegenerate } from './barcodeRegenerate'
import { auth, firestore } from './firebase'
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

  const uId = auth.currentUser?.uid
  if (!uId) {
    void toast('更新に失敗しました。')
    return
  }

  const usersCollection = collection(firestore, 'users')
  const userDoc = doc(usersCollection, uId)

  // 残高取得
  const res = (await getDoc(userDoc)).data() as userDBData
  // 新規ユーザー
  if (!res || !res.initialized) {
    await userInitialize()
  }

  // バーコード再生成
  await barcodeRegenerate()

  // 更新処理
  getDoc(userDoc)
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
          userData.history.sort((a, b) => b.time.toMillis() - a.time.toMillis())
          userData.history.forEach((hist) => {
            const when = hist.time.toDate()
            $('div.container.history ul').append(`
            <li>
              <p class="when">${when.getFullYear()}.${String(
              when.getMonth() + 1
            ).padStart(2, '0')}.${String(when.getDate()).padStart(
              2,
              '0'
            )} ${String(when.getHours()).padStart(2, '0')}:${String(
              when.getMinutes()
            ).padStart(2, '0')}</p>
              <p class="details" data-where="${hist.place}" data-what="${
              hist.item
            }" data-amount="${hist.amount}"></p>
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
