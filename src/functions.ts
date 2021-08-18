//----- 共通で使う関数 -----//
import $ from 'jquery'

import { modal_option } from './type'

/**
 * async関数内において待機
 * @param t - 待機する時間（ミリ秒）
 * @example await sleep(700)  // 700ms待機
 */
const sleep = (t: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, t))

/**
 * モーダルウィンドウを表示します
 * @param opt - 表示設定
 * @param close - 閉じるボタンを表示するか
 * @param form - メール紐づけ時かどうか
 */
const modal = (opt: modal_option, close = true, form = false): void => {
  if (!form) {
    $('.modal .modalContainer form#emailLinkForm').remove()
  }
  $('.modal p.ttl').text(opt.ttl)
  $('.modal p.detail').text(opt.detail)
  if (opt.link) {
    $('.modal p a').text(opt.link.ttl)
    $('.modal p a').attr('href', opt.link.url)
  } else {
    $('.modal p a').hide()
  }
  $('.modal').fadeIn().css('display', 'grid')
  if (!close) {
    $('.modal p.close').hide()
    $('.modal, .modal p.close i').off('click')
  } else {
    $('.modal p.close').show()
    $('.modal, .modal p.close i').on('click', (e) => {
      if (e.target !== e.currentTarget) return
      $('.modal').fadeOut()
    })
  }
}

/**
 * トーストメッセージを表示します
 * @param ttl - 表示するテキスト
 */
const toast = async (ttl: string): Promise<void> => {
  $('.toast p').text(ttl)
  $('.toast').fadeIn().css('display', 'grid')
  await sleep(3000)
  $('.toast').fadeOut()
}

export { sleep, modal, toast }
