//----- ヘッダーDOM操作 -----//
import { signOut } from 'firebase/auth'
import $ from 'jquery'

import { auth } from './firebase'
import { sleep } from './functions'
import { sync } from './syncData'

const headerOnClick = () => {
  if (location.pathname === '/login') {
    $('header div').remove()
  }
  $('header i.open').on('click', async function () {
    $(this).next('ul').fadeIn().addClass('showing')
    await sleep(700)
    $(this).next('ul').attr('data-showing', 'true')
  })
  $('header ul li').on('click', async function () {
    $(this).parent().fadeOut().removeClass('showing')
    await sleep(700)
    $(this).parent().removeAttr('data-showing')
  })
  $('header ul li#sync').on('click', sync)
  $('header ul li#settings').on('click', () => {
    $('div.setting_container').show().animate({ top: 20 }, 700)
  })
  $('li#logout').on('click', () => {
    if (confirm('ログアウトしますか？')) {
      signOut(auth).catch(console.error)
    }
  })
}

export { headerOnClick }
