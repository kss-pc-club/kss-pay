/**
 * 「右側用」のデータを生成します
 * @param left - 「左側用」のデータ
 * @returns right - 「右側用」のデータ
 */
function generateRight(left: number[]) {
  const right = []
  for (let i = 0; i < left.length; i++) {
    right[i] = Number(!left[i]) // 1なら0に、0なら1になる
  }
  return right
}

/**
 * 「1桁目用」のデータを生成します
 * @param right - 「右側用」のデータ
 * @returns digit1 - 「1桁目用」のデータ
 */
function generateDigit1(right: number[]) {
  return right.reverse()
}

// 1桁目 奇数偶数パリティ用データ
const digit1 = [
  [0, 0, 0, 0, 0, 0], // 0
  [0, 0, 1, 0, 1, 1], // 1
  [0, 0, 1, 1, 0, 1], // 2
  [0, 0, 1, 1, 1, 0], // 3
  [0, 1, 0, 0, 1, 1], // 4
  [0, 1, 1, 0, 0, 1], // 5
  [0, 1, 1, 1, 0, 0], // 6
  [0, 1, 0, 1, 0, 1], // 7
  [0, 1, 0, 1, 1, 0], // 8
  [0, 1, 1, 0, 1, 0], // 9
]

// 「左側用」データ
const left = [
  [0, 0, 0, 1, 1, 0, 1], // 0
  [0, 0, 1, 1, 0, 0, 1], // 1
  [0, 0, 1, 0, 0, 1, 1], // 2
  [0, 1, 1, 1, 1, 0, 1], // 3
  [0, 1, 0, 0, 0, 1, 1], // 4
  [0, 1, 1, 0, 0, 0, 1], // 5
  [0, 1, 0, 1, 1, 1, 1], // 6
  [0, 1, 1, 1, 0, 1, 1], // 7
  [0, 1, 1, 0, 1, 1, 1], // 8
  [0, 0, 0, 1, 0, 1, 1], // 9
]

export { left, digit1, generateDigit1, generateRight }
