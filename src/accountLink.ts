//----- メールアドレスで作成したアカウントを他のアカウントに紐づける作業 -----//

import $ from 'jquery'

import { auth, firebase, userData } from './firebase'
import { modal, toast } from './functions'
import { Provider } from './type'

/**
 * リンクをするときの処理を指定する
 * @param user - 現在ログイン中のユーザー情報
 * @param provider - プロバイダのクラス
 */
const linkFlow = (
  user: firebase.User | null,
  provider: Provider,
  elem: HTMLElement
): void => {
  if (user) {
    user
      .linkWithPopup(provider)
      .then((result) => {
        console.log('SUCCESS!', result)
        void toast('アカウントの紐づけを完了しました！')
        $(elem).next('p.status').addClass('linked')
      })
      .catch((err) => {
        console.error(err)
        void toast('アカウントの紐づけに失敗しました...')
      })
  }
}

// メールでリンクする際の処理
const mailLink = (mail: string, pass: string) => {
  const credential = firebase.auth.EmailAuthProvider.credential(mail, pass)
  auth.currentUser
    ?.linkWithCredential(credential)
    .then((usrCred) => {
      if (usrCred.user) {
        auth.currentUser
          ?.sendEmailVerification()
          .then(() => {
            void toast('確認メールを送信しました')
            $('.container.setting .btnC button#mail')
              .next('p.status')
              .addClass('linked')
            $('.modal').fadeOut()
          })
          .catch((err) => {
            console.error(err)
            void toast('エラーが発生しました')
          })
      }
    })
    .catch((err) => {
      console.error(err)
      void toast('メールアドレスの紐づけに失敗しました')
    })
}
const reauth4mailLink = (mail: string, pass: string, reauth: string) => {
  if (reauth === 'google') {
    auth.currentUser
      ?.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => mailLink(mail, pass))
      .catch((err) => {
        console.error(err)
        void toast('再認証に失敗しました')
      })
  }
  if (reauth === 'facebook') {
    auth.currentUser
      ?.reauthenticateWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(() => mailLink(mail, pass))
      .catch((err) => {
        console.error(err)
        void toast('再認証に失敗しました')
      })
  }
  if (reauth === 'twitter') {
    auth.currentUser
      ?.reauthenticateWithPopup(new firebase.auth.TwitterAuthProvider())
      .then(() => mailLink(mail, pass))
      .catch((err) => {
        console.error(err)
        void toast('再認証に失敗しました')
      })
  }
}
const updateEmail = (oldMail: string, pass: string, newMail: string) => {
  const oldCred = firebase.auth.EmailAuthProvider.credential(oldMail, pass)
  auth.currentUser
    ?.reauthenticateWithCredential(oldCred)
    .then(() => {
      auth.currentUser
        ?.updateEmail(newMail)
        .then(() => {
          auth.currentUser
            ?.sendEmailVerification()
            .then(() => {
              $('.modal').fadeOut()
              void toast('確認メールを送信しました')
              userData.mail = newMail
            })
            .catch((err) => {
              console.error(err)
              void toast('確認メールを送信できませんでした')
            })
        })
        .catch((err) => {
          console.error(err)
          void toast('エラーが発生しました')
        })
    })
    .catch((err) => {
      console.error(err)
      void toast('再認証に失敗しました')
    })
}

// アカウント削除
const userRemove = () => {
  auth.currentUser
    ?.delete()
    .then(() => {
      alert('アカウントを削除しました。ご利用ありがとうございました。')
      location.href = '/login'
    })
    .catch((err) => {
      console.error(err)
      void toast('エラーが発生しました')
    })
}

// アカウントリンクのボタンにイベントリスナーを登録する
window.addEventListener('DOMContentLoaded', () => {
  $('button#mail').on('click', function () {
    if ($(this).next('p.status').hasClass('linked')) {
      if (confirm('メールアドレスを紐づけ解除しますか？')) {
        auth.currentUser
          ?.unlink('password')
          .then(() => {
            void toast('紐づけを解除しました')
            $(this).next('p.status').removeClass('linked')
          })
          .catch((err) => {
            console.error(err)
            void toast('紐づけ解除に失敗しました')
          })
      }
    } else {
      if (confirm('メールアドレスを紐づけしますか？')) {
        const form = `
          <form action="#" id="emailLinkForm">
            <input type="email" id="mail" required placeholder="メールアドレス">
            <input type="password" id="pass" required placeholder="パスワード">
            <select id="reauth" required>
              <option selected value="">再認証に利用するサービスを選択してください</option>
              <option value="google" ${
                userData.google || 'disabled'
              }>Google</option>
              <option value="facebook" ${
                userData.facebook || 'disabled'
              }>Facebook</option>
              <option value="twitter" ${
                userData.twitter || 'disabled'
              }>Twitter</option>
            </select>
            <input type="submit" value="確認メール送信">
          </form>
        `
        modal({ ttl: '', detail: '' }) // リセット
        $('.modal .modalContainer').append(form)
        modal(
          {
            ttl: '必要情報入力',
            detail:
              'メールアドレスとパスワードを入力してください。\n確認メールが届きます。利用できるメールアドレスを登録してください。',
          },
          true,
          true
        )
        $('.modal .modalContainer form#emailLinkForm').on('submit', (e) => {
          e.preventDefault()
          const mail = $('.modal .modalContainer input#mail').val()
          const pass = $('.modal .modalContainer input#pass').val()
          const reauth = $('.modal .modalContainer select').val()
          if (mail && pass && reauth) {
            reauth4mailLink(String(mail), String(pass), String(reauth))
          }
        })
      }
    }
  })
  $('button#google').on('click', function () {
    if ($(this).next('p.status').hasClass('linked')) {
      if (confirm('Googleアカウントを紐づけ解除しますか？')) {
        auth.currentUser
          ?.unlink('google.com')
          .then(() => {
            void toast('紐づけを解除しました')
            $(this).next('p.status').removeClass('linked')
          })
          .catch((err) => {
            console.error(err)
            void toast('紐づけ解除に失敗しました')
          })
      }
    } else {
      if (confirm('Googleアカウントを紐づけしますか？')) {
        linkFlow(
          firebase.auth().currentUser,
          new firebase.auth.GoogleAuthProvider(),
          this
        )
      }
    }
  })
  $('button#facebook').on('click', function () {
    if ($(this).next('p.status').hasClass('linked')) {
      if (confirm('Facebookアカウントを紐づけ解除しますか？')) {
        auth.currentUser
          ?.unlink('facebook.com')
          .then(() => {
            void toast('紐づけを解除しました')
            $(this).next('p.status').removeClass('linked')
          })
          .catch((err) => {
            console.error(err)
            void toast('紐づけ解除に失敗しました')
          })
      }
    } else {
      if (confirm('Facebookアカウントを紐づけしますか？')) {
        linkFlow(
          firebase.auth().currentUser,
          new firebase.auth.FacebookAuthProvider(),
          this
        )
      }
    }
  })
  $('button#twitter').on('click', function () {
    if ($(this).next('p.status').hasClass('linked')) {
      if (confirm('Twitterアカウントを紐づけ解除しますか？')) {
        auth.currentUser
          ?.unlink('twitter.com')
          .then(() => {
            void toast('紐づけを解除しました')
            $(this).next('p.status').removeClass('linked')
          })
          .catch((err) => {
            console.error(err)
            void toast('紐づけ解除に失敗しました')
          })
      }
    } else {
      if (confirm('Twitterアカウントを紐づけしますか？')) {
        linkFlow(
          firebase.auth().currentUser,
          new firebase.auth.TwitterAuthProvider(),
          this
        )
      }
    }
  })

  $('.change p#changeMail').on('click', () => {
    const form = `
      <form action="#" id="emailLinkForm">
        <input type="email" id="oldMail" required placeholder="古いメールアドレス">
        <input type="password" id="pass" required placeholder="パスワード">
        <input type="email" id="newMail" required placeholder="新しいメールアドレス">
        <input type="submit" value="更新">
      </form>
    `
    modal({ ttl: '', detail: '' }) // リセット
    $('.modal .modalContainer').append(form)
    modal(
      {
        ttl: '必要情報入力',
        detail:
          'メールアドレスとパスワードを入力してください。\n確認メールが届きます。利用できるメールアドレスを登録してください。',
      },
      true,
      true
    )
    $('.modal .modalContainer form#emailLinkForm').on('submit', (e) => {
      e.preventDefault()
      const oldMail = $('.modal .modalContainer input#oldMail').val()
      const newMail = $('.modal .modalContainer input#newMail').val()
      const pass = $('.modal .modalContainer input#pass').val()
      if (oldMail && pass && newMail) {
        updateEmail(String(oldMail), String(pass), String(newMail))
      }
    })
  })
  $('.change p#changePass').on('click', () => {
    if (userData.mail) {
      auth
        .sendPasswordResetEmail(userData.mail)
        .then(() => {
          void toast('パスワード再設定メールを送信しました')
        })
        .catch((err) => {
          console.error(err)
          void toast('メールを送信できませんでした')
        })
    } else {
      void toast('メールアドレスを取得できませんでした')
    }
  })

  $('.dl p.ttl#delete').on('click', () => {
    const form = `
      <form action="#" id="emailLinkForm">
        <select id="reauth" required>
          <option selected value="">再認証に利用するサービスを選択してください</option>
          <option value="mail" ${
            userData.mail || 'disabled'
          }>メールアドレス</option>
          <option value="google" ${
            userData.google || 'disabled'
          }>Google</option>
          <option value="facebook" ${
            userData.facebook || 'disabled'
          }>Facebook</option>
          <option value="twitter" ${
            userData.twitter || 'disabled'
          }>Twitter</option>
        </select>
        <div id="input" style="display:none">
          <input type="email" id="mail" placeholder="メールアドレス">
          <input type="password" id="pass" placeholder="パスワード">
        </div>
        <input type="submit" value="再認証してアカウント削除">
      </form>
    `
    modal({ ttl: '', detail: '' }) // リセット
    $('.modal .modalContainer').append(form)
    $('.modal .modalContainer select').on('change', function () {
      const $inputContainer = $(this).next('div#input')
      if ($(this).val() === 'mail') {
        $inputContainer.show()
        $inputContainer.find('input').attr('required', 'required')
      } else {
        $inputContainer.hide()
        $inputContainer.find('input').removeAttr('required')
      }
    })
    modal(
      {
        ttl: 'アカウントを削除しますか？',
        detail:
          'アカウントに残高が残っている場合、お金は戻ってきません。残高が0円であることを確認して進んでください。\nまた、これまでの購入履歴やアカウントの紐づけが削除されます。\n\nアカウントを削除するには、再認証が必要です。以下選択肢からサービスを選択してください。',
      },
      true,
      true
    )
    $('.modal .modalContainer form#emailLinkForm').on('submit', (e) => {
      e.preventDefault()
      const mail = $('.modal .modalContainer input#mail').val()
      const pass = $('.modal .modalContainer input#pass').val()
      const reauth = $('.modal .modalContainer select').val()
      if (reauth === 'mail' && mail && pass) {
        const cred = firebase.auth.EmailAuthProvider.credential(
          String(mail),
          String(pass)
        )
        auth.currentUser
          ?.reauthenticateWithCredential(cred)
          .then(userRemove)
          .catch((err) => {
            console.error(err)
            void toast('再認証に失敗しました')
          })
      } else if (reauth) {
        if (reauth === 'google') {
          auth.currentUser
            ?.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider())
            .then(userRemove)
            .catch((err) => {
              console.error(err)
              void toast('再認証に失敗しました')
            })
        }
        if (reauth === 'facebook') {
          auth.currentUser
            ?.reauthenticateWithPopup(new firebase.auth.FacebookAuthProvider())
            .then(userRemove)
            .catch((err) => {
              console.error(err)
              void toast('再認証に失敗しました')
            })
        }
        if (reauth === 'twitter') {
          auth.currentUser
            ?.reauthenticateWithPopup(new firebase.auth.TwitterAuthProvider())
            .then(userRemove)
            .catch((err) => {
              console.error(err)
              void toast('再認証に失敗しました')
            })
        }
      }
    })
  })
})
