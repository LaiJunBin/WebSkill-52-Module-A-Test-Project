import { test, expect } from '@playwright/test'

test.describe('task07', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/07/index.html')
  })

  test('happy path', async ({ page }) => {
    const img = await page.locator('img')
    expect(await img.getAttribute('src'), { message: 'src 不正確' }).toContain(
      'index.php'
    )
    expect(await img.screenshot(), { message: '圖片不正確' }).toMatchSnapshot(
      '07-1-answer.png'
    )
  })

  test('check index.php 403', async ({ request }) => {
    const response = await request.get('/07/index.php')
    expect(response.status()).toBe(403)
  })
})
