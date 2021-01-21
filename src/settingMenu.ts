import $ from 'jquery'

import { sleep } from './functions'

const settingMenuClose = (): void => {
  $('div.setting_container div.top i').on('click', async () => {
    const e = $('div.setting_container')
    e.animate({ top: '120vh' }, 700)
    await sleep(700)
    e.hide()
  })
}

export { settingMenuClose }
