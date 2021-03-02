//----- Footer -> 履歴 -----//
import $ from 'jquery'

import { sleep } from './functions'

const historyItemClicked = async function (this: HTMLElement) {
  if ($(this).hasClass('showing')) {
    // 閉じる
    $(this).animate({ height: 87 }, 500)
    await sleep(300)
    $(this).find('p.cost').fadeIn(200)
    $(this).removeClass('showing')
  } else {
    // 開く
    $(this).find('p.cost').fadeOut(200)
    await sleep(200)
    $(this).animate({ height: 125 }, 500)
    $(this).addClass('showing')
    $(this).find('p.what').fadeIn(100)
    $(this).find('p.amount').fadeIn(100)
    await sleep(50) // ここでSleepするのは Fadeoutと同じ200msちょうどにすると、そのあと表示されなくなるため
    $(this).find('p.cost').show()
  }
}

window.addEventListener('DOMContentLoaded', () => {
  $('div.container.history ul li').on('click', historyItemClicked)
})
