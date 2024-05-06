import { test, expect } from '@playwright/test'

test.describe('task14', async () => {
  test('check status code and header', async ({ request }) => {
    const response = await request.get('/14/index.php?uri=/media/img.jpg')
    expect(response.status()).toBe(200)
    const contentType = response.headers()['content-type']
    expect(contentType).toMatch(/image\/(jpeg|jpg)/)
  })

  test('case 1', async ({ page }) => {
    await page.goto('/14/index.php?uri=/media/img.jpg')
    expect(await page.locator('img').screenshot(), {
      message: '浮水印處理不正確',
    }).toMatchSnapshot('14-1-image.png', { maxDiffPixelRatio: 0.01 })
  })
})
