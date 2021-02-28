//----- <footer>のクリック処理 -----//
import $ from 'jquery'

import { sleep } from './functions'

// アニメーションしているか保存しておく
let animating = false

window.addEventListener('DOMContentLoaded', () => {
  $('footer div').on('click', async function () {
    // アニメーションしていないときに実行する
    if (!animating) {
      animating = true

      // ここにはクリックされた要素のクラスが入る
      const cls = $(this).attr('class')

      // 今表示されているものをフェードアウト
      $('main div.container.showing').removeClass('showing')
      $('footer div.showing').removeClass('showing')

      // フェードアウト中待機
      await sleep(700)

      // クリックされたものを表示
      $('main div.container.show').removeClass('show')
      if (cls)
        $(`main div.container.${cls}`).addClass('show').addClass('showing')
      else console.error('Variable "cls" is undefined')
      $(this).addClass('showing')

      animating = false
    }
  })
})
