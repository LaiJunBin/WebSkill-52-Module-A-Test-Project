import { test, expect } from '@playwright/test'
import { pauseAnimation, setAnimationTime } from './utils'

test.describe('task08', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/08/index.html')
  })

  test('check img tag', async ({ page }) => {
    const images = await page.locator('img').count()
    expect(images, { message: '你不可以使用 <img> 標籤' }).toBe(0)
  })

  test('init element UI', async ({ page }) => {
    await pauseAnimation(page)
    await setAnimationTime(page, 0)
    expect(await page.locator('body').screenshot(), {
      message: '初始化畫面不正確',
    }).toMatchSnapshot('08-0-answer.png', { maxDiffPixelRatio: 0 })
  })

  test('test animation', async ({ page }) => {
    test.slow()
    await pauseAnimation(page)

    for (let time = 0; time <= 5000; time += 100) {
      await setAnimationTime(page, time)
      expect(await page.locator('body').screenshot(), {
        message: '動畫不正確',
      }).toMatchSnapshot(`08-${time}-answer.png`, { maxDiffPixelRatio: 0 })
    }
  })
})
