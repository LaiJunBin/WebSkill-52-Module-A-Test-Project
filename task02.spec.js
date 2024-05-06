import { test, expect } from '@playwright/test'
import { pauseAnimation, setAnimationTime } from './utils'

test.describe('task02', async () => {
  test.use({ javaScriptEnabled: false })
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => {
      const style = document.createElement('style')
      style.innerHTML = `
        body {
          margin: 0;
          padding: 0;
        }
        `

      document.head.appendChild(style)
    })

    await page.goto('/02/Task02.html')
  })

  test('check img tag', async ({ page }) => {
    const images = await page.locator('img').count()
    expect(images, { message: '你不可以使用 <img> 標籤' }).toBe(0)
  })

  test('init element UI', async ({ page }) => {
    await pauseAnimation(page)
    await setAnimationTime(page, 0)

    expect(await page.locator('body').screenshot({}), {
      message: '初始化畫面不正確',
    }).toMatchSnapshot('02-0-answer.png', { maxDiffPixelRatio: 0.01 })
  })

  test('test animation', async ({ page }) => {
    await pauseAnimation(page)

    for (let time = 0; time <= 2000; time += 100) {
      await setAnimationTime(page, time)
      expect(await page.locator('body').screenshot(), {
        message: '動畫不正確',
      }).toMatchSnapshot(`02-${time}-answer.png`, { maxDiffPixelRatio: 0.01 })
    }
  })
})
