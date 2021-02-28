import { digit1, generateDigit1, generateRight, left } from './data'

// 設定
const settings = {
  foregroundColor: '#000',
  backgroundColor: '#fff',
  showNumber: true,
  magnificate: 2,
  canvasSelector: 'canvas#barcode',
}

/**
 * キャンバスに描きます
 * @param x - 描画開始位置
 * @param px - 太さ
 * @param ctx - キャンバスのgetContext('2d')
 */
function draw(x: number, px: number, ctx: CanvasRenderingContext2D) {
  const m = settings.magnificate
  ctx.fillStyle = settings.foregroundColor
  ctx.fillRect(x * m, 5 * m, px * m, 55 * m)
}

/**
 * 1列のみ描画します
 * @param ctx - キャンバスのgetContext('2d')
 * @param x - 位置
 */
function draw1Line(ctx: CanvasRenderingContext2D, ...x: number[]) {
  for (let i = 0; i < x.length; i++) {
    draw(x[i], 1, ctx)
  }
}

function generateBarcode(num: number) {
  //----- 要素の取得 -----
  const canvas = <HTMLCanvasElement>(
    document.querySelector(settings.canvasSelector)
  )
  const ctx = canvas.getContext('2d')
  if (!canvas || !ctx) {
    console.error('指定されたセレクタに該当するcanvasが存在しません')
    return
  }

  // 全消し
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  //----- フォーマット -----
  let num2str = String(num)
  const len = num2str.length
  if (len > 0 && len <= 13) {
    const arr = Array.from(num2str) // 文字列を変更するためにまず配列にする
    for (let i = 0; i < 13; i++) {
      if (!arr[i]) arr[i] = '0' // 何もないところは「0」にする
    }
    num2str = arr.join('') // 文字列に戻す
  } else if (len === 0) {
    console.error('バーコードの値が指定されていません')
    return
  } else {
    console.error('バーコードの値は13桁以内で指定してください')
    return
  }
  const numTmp: number[] = []
  for (let i = 0; i < 13; i++) {
    numTmp[i] = Number(num2str[i])
  }

  //----- チェックディジットを確認 -----
  const inputCheckDigit = numTmp[12]
  let calcCheckDigit = 0
  for (let i = 0; i < 12; i++) {
    calcCheckDigit += i % 2 === 0 ? numTmp[i] : numTmp[i] * 3
  }
  calcCheckDigit = (10 - (calcCheckDigit % 10)) % 10

  if (inputCheckDigit !== calcCheckDigit) {
    console.warn(
      'チェックディジットが異なります',
      '正しいチェックディジットで描画します'
    )
    numTmp[12] = calcCheckDigit
  }

  const numCode = numTmp

  //----- 描画 -----

  // 左の余白（1-11; 全部白）

  // 左ガードバー（12-14; 黒白黒）
  draw1Line(ctx, 12, 14)

  // 左データキャラクタ（15-56）
  const digit1Parity = digit1[numCode[0]]
  for (let i = 0; i < 6; i++) {
    const code = numCode[i + 1]
    const parity = digit1Parity[i]
    let data: number[] = []
    if (parity === 0) {
      // 奇数パリティの場合
      data = left[code]
    } else if (parity === 1) {
      // 偶数パリティ
      data = generateDigit1(generateRight(left[code]))
    } else {
      console.error('設定にエラーがあります', 'data.tsを確認してください')
      return
    }
    for (let j = 0; j < 7; j++) {
      if (data[j] === 1) {
        draw1Line(ctx, 15 + 7 * i + j)
      }
    }
  }

  // センターバー（57-61; 白黒白黒白）
  draw1Line(ctx, 58, 60)

  // 右データキャラクターとチェックディジット（62-104）
  for (let i = 6; i < 12; i++) {
    const code = numCode[i + 1]
    const data = generateRight(left[code])
    for (let j = 0; j < 7; j++) {
      if (data[j] === 1) {
        draw1Line(ctx, 62 + 7 * (i - 6) + j)
      }
    }
  }

  // 右ガードバー（105-107; 黒白黒）
  draw1Line(ctx, 105, 107)

  // 右の余白（108-114）

  //----- 番号を表示 -----
  if (settings.showNumber) {
    ctx.font = '16px "Product Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(numCode.join(''), 118, 131)
  }
}

export { generateBarcode }
