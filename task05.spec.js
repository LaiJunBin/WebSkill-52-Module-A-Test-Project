import { test, expect } from '@playwright/test'
import { waitScreenshotUpdated } from './utils'

test.describe('task05', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/05/Task05.html')
  })

  test('happy path', async ({ page }) => {
    // upload csv file
    const input = await page.locator('#file-input')
    await input.setInputFiles('./data/05.csv')

    // wait for chart
    await waitScreenshotUpdated(page, '#chart')

    expect(await page.locator('#chart').screenshot(), {
      message: '圖表不正確',
    }).toMatchSnapshot('05-1-answer.png')
  })
})
