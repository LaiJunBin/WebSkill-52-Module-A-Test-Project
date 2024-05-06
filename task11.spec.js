import { test, expect } from '@playwright/test'

test.describe('task11', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/11/index.html')
  })

  test('happy path', async ({ page }) => {
    // upload image
    const input = await page.locator('#file-input')
    await input.setInputFiles('./images/dog.jpg')

    // check preview
    const canvas = await page.locator('#canvas')
    expect(await canvas.screenshot(), {
      message: '預覽不正確',
    }).toMatchSnapshot('11-1-answer.png', { maxDiffPixelRatio: 0.01 })

    // move mouse
    await canvas.hover(10, 10)
    const color = await page.locator('#color')
    await color.evaluate((el) => (el.style.backgroundColor = 'white'))
    expect(await color.screenshot(), {
      message: '顏色放大鏡不正確',
    }).toMatchSnapshot('11-2-answer.png', { maxDiffPixelRatio: 0.01 })

    const rgba = await page.locator('#rgba')
    await rgba.evaluate((el) => (el.style.backgroundColor = 'white'))
    expect(await rgba.screenshot(), { message: '色碼不正確' }).toMatchSnapshot(
      '11-3-answer.png',
      { maxDiffPixelRatio: 0.01 }
    )

    const canvasBox = await canvas.boundingBox()
    const x = canvasBox.x + canvasBox.width / 2
    const y = canvasBox.y + canvasBox.height / 2
    await page.mouse.move(x, y)

    const colorBox = await color.boundingBox()
    expect(colorBox.x - x).toBeGreaterThan(10)
    expect(colorBox.y - y).toBeGreaterThan(10)

    const rgbaBox = await rgba.boundingBox()
    expect(rgbaBox.x - x).toBeGreaterThanOrEqual(colorBox.width)
    expect(rgbaBox.y - y).toBeGreaterThanOrEqual(
      colorBox.height - rgbaBox.height
    )
  })
})
