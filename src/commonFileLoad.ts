//----- ページで共通なファイルを読み込み -----//
import { headerOnClick } from './header'
import { mdiIcon } from './mdiIcon'
import { settingMenuClose } from './settingMenu'

// <header>と<meta>などは全ページでほぼ同じなので、それを読み込む。
window.addEventListener('DOMContentLoaded', () => {
  fetch('/_header.html')
    .then((res) => res.text())
    .then((text) => {
      const e = document.querySelector('header')
      if (e) e.innerHTML = text
    })
    .then(mdiIcon)
    .then(headerOnClick)
    .then(settingMenuClose)
    .catch(console.error)

  fetch('/_common.html')
    .then((res) => res.text())
    .then((text) => {
      const e = document.querySelector('head')
      if (e) e.innerHTML += text
    })
    .catch(console.error)
})
