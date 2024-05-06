import { test, expect } from '@playwright/test'

test.describe('task01', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/01/Task01.html')
  })

  test('check img tag', async ({ page }) => {
    const images = await page.locator('img').count()
    expect(images, { message: '你不可以使用 <img> 標籤' }).toBe(0)
  })

  test('check use grid layout', async ({ page }) => {
    const container = await page.locator('.container')
    const containerStyle = await container.evaluate((node) => {
      return window.getComputedStyle(node)
    })
    expect(containerStyle, { message: '你必須使用 grid 來排版' }).toMatchObject(
      {
        display: 'grid',
      }
    )
  })

  test('layout snapshot', async ({ page }) => {
    expect(await page.locator('.container').screenshot(), {
      message: 'Layout 不正確',
    }).toMatchSnapshot('01-answer.png')
  })
})
