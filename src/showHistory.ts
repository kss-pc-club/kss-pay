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
    await sleep(210)
    $(this).removeAttr('style')
  } else {
    // 開く
    // 一度開いて高さを取得
    const height = $(this).addClass('showing').outerHeight()
    $(this).removeClass('showing')

    $(this).find('p.cost').fadeOut(200)
    await sleep(200)
    $(this).animate({ height: height }, 500)
    $(this).addClass('showing')
    await sleep(50) // ここでSleepするのは Fadeoutと同じ200msちょうどにすると、そのあと表示されなくなるため
    $(this).removeAttr('style')
    $(this).find('p.cost').fadeIn(500)
  }
}

export { historyItemClicked }

