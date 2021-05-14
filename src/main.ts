//----- メインファイル -----//
import './accountLink'
import './commonFileLoad'
import './footer'
import './login'
import './serviceWorkerRegister'
import './showHistory'

import $ from 'jquery'

import { auth, firebase, userData } from './firebase'
import { modal, sleep, toast } from './functions'
import { sync } from './syncData'
// import { generateBarcode } from './barcode/canvas'
import { providers } from './type'

window.addEventListener('offline', () => {
  location.href = './onlineCheck'
})

window.addEventListener('DOMContentLoaded', () => {
  // <main>の高さ = window - <header> - <footer>
  const headerHeight = $('header').outerHeight()
  const footerHeight = $('footer').outerHeight()
  if (headerHeight && footerHeight) {
    $('main')
      .css('margin-top', headerHeight)
      .css('height', window.innerHeight - headerHeight - footerHeight)
      .css('margin-bottom', footerHeight)
  }

  // カードのローテーション処理
  $('div.container.barcode').on('click', function () {
    $(this).toggleClass('rotate')
  })

  // サインアウト処理
  $('p#logout').on('click', () => {
    if (confirm('ログアウトしますか？')) {
      firebase.auth().signOut().catch(console.error)
    }
  })

  // 「決済するには？」
  $('p#help').on('click', () => {
    modal({
      ttl: '決済するには？',
      detail:
        '決済するために、上にあるカードをタップして、バーコードを表示しましょう。\nバーコードが表示されたら、店員に表示して読み取ってもらうだけで、決済が完了します。\nただし、事前にチャージをする必要があります。チャージ専用ブースへご来店ください。',
    })
  })
})

window.addEventListener('load', async () => {
  // 読み込み終了したらメインコンテンツを表示&ローダーを消す
  $('header,main,footer').fadeIn(700)
  $('div.loader_container').fadeOut(700)
  await sleep(700)
  $('div.loader_container').remove()

  // 遊び心。Self XSS詐欺をやめようという。
  console.log(
    '%cSTOP!!%c\nあなたが現在開いているのは、開発者向けのブラウザツールです。ユーザーが開くべきものではありません。\nここに何かをコピー・貼り付けするように言われた場合、第三者があなたのアカウントへのアクセスを得るための%c詐欺・不正行為%cです。\n\n心当たりのない方は、特別棟2F奥にあるパソコン室までお訪ねください。\n心当たりがある方も、パソコン室に来なさい（#^ω^）',
    'color: #f00; font-size: 64px;',
    'font-size: 24px;',
    'color: #f00; font-size: 24px',
    'font-size: 24px'
  )
})

// Firebaseでユーザー認証データが読み込まれた後の処理
const firebaseUserDataLoaded = () => {
  // ユーザーログイン状態取得
  const providers: providers[] = ['facebook', 'google', 'twitter', 'mail']
  providers.forEach((providerName: providers) => {
    if (userData[providerName]) {
      $(`.container.setting .column.sns .btnC button#${providerName}`)
        .next('p.status')
        .addClass('linked')
    } else {
      $(`.container.setting .column.sns .btnC button#${providerName}`)
        .next('p.status')
        .removeClass('linked')
    }
  })

  // ユーザーID表示
  $('p.userId.ttl').text(userData.uid || 'ID取得時にエラーが発生しました')

  // ようこそ
  if (userData && userData.name) {
    void toast(`ようこそ、${userData.name}さん！`)
  }

  // メール認証
  if (userData.mail && !userData.mailVerified) {
    $('.modal p a').on('click', function () {
      auth.currentUser
        ?.sendEmailVerification()
        .then(() => {
          void toast('確認メールを送信しました')
        })
        .catch((err) => {
          console.error(err)
          void toast('エラーが発生しました')
        })
      $(this).off('click')
    })

    modal(
      {
        ttl: 'メールアドレスが確認されていません',
        detail:
          'このアカウントのメールアドレスが認証されていません。メールを確認し、認証を行ってください。\n利用するのが初めての方はまだメールが送信されていないことがあります。\n以下リンクをクリックして、メールを送信してください。',
        link: { show: true, url: '#', ttl: '認証メールを送信' },
      },
      false
    )
  }

  // 同期させる
  void sync()
}

export { firebaseUserDataLoaded }
