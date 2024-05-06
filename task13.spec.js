import { test, expect } from '@playwright/test'
import {
  pauseAnimation,
  setAnimationTime,
  setAnimationTimeByIndex,
} from './utils'

test.describe('task13', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/13/index.html')
  })

  test('check img tag', async ({ page }) => {
    const images = await page.locator('img').count()
    expect(images, { message: '你不可以使用 <img> 標籤' }).toBe(0)
  })

  test('init element UI', async ({ page }) => {
    const button = await page.locator('#button')
    expect(await button.isVisible(), { message: '沒有看到按鈕' }).toBeTruthy()

    expect(await button.boundingBox(), {
      message: '按鈕大小不正確',
    }).toMatchObject({
      width: 300,
      height: 200,
    })
  })

  test('test click animation', async ({ page }) => {
    test.slow()
    for (let time = 0; time <= 800; time += 100) {
      await page.locator('#button').click()
      await pauseAnimation(page)
      await setAnimationTime(page, time)
      expect(await page.locator('#button').screenshot(), {
        message: '動畫不正確',
      }).toMatchSnapshot(`13-click-${time}-answer.png`, {
        maxDiffPixelRatio: 0.01,
      })
    }
  })

  test('test dbclick animation', async ({ page }) => {
    test.slow()
    for (let time = 0; time <= 600; time += 100) {
      await page.locator('#button').click({ position: { x: 50, y: 100 } })
      await page.locator('#button').click({ position: { x: 250, y: 100 } })
      await pauseAnimation(page)
      await setAnimationTimeByIndex(page, time + 200, 0)
      await setAnimationTimeByIndex(page, time, 1)
      expect(await page.locator('#button').screenshot(), {
        message: '動畫不正確',
      }).toMatchSnapshot(`13-dbclick-${time}-answer.png`, {
        maxDiffPixelRatio: 0.01,
      })
    }
  })
})
