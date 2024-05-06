import { test, expect } from '@playwright/test'

test.describe('task04', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/04/Task04.html')
  })

  test('check dashed line', async ({ page }, testInfo) => {
    // upload image
    const input = await page.locator('#file-input')
    await input.setInputFiles('./images/dog.jpg')

    await page.locator('#submit-btn').click()

    // check preview
    const preview = await page.locator('#preview')
    expect(await preview.screenshot(), {
      message: '預覽不正確',
    }).toMatchSnapshot('04-1-answer.png', { maxDiffPixelRatio: 0.01 })
    const originalImageData = await page.evaluate(() => {
      const canvas = document.querySelector('#preview')
      const ctx = canvas.getContext('2d')

      return ctx.getImageData(10, 10, 310, 1)
    })

    // crop area
    await preview.dragTo(preview, {
      sourcePosition: { x: 10, y: 10 },
      targetPosition: { x: 320, y: 290 },
    })

    const imageData = await page.evaluate(() => {
      const canvas = document.querySelector('#preview')
      const ctx = canvas.getContext('2d')

      return ctx.getImageData(10, 10, 310, 1)
    })

    let diff = 0
    const dataLength = Object.values(imageData.data).length
    for (let i = 0; i < dataLength; i += 4) {
      if (
        imageData.data[i] !== originalImageData.data[i] ||
        imageData.data[i + 1] !== originalImageData.data[i + 1] ||
        imageData.data[i + 2] !== originalImageData.data[i + 2] ||
        imageData.data[i + 3] !== originalImageData.data[i + 3]
      ) {
        diff++
      }
    }

    try {
      expect(diff === dataLength / 4, {
        message: '裁切預覽虛線設置不正確',
      }).toBeFalsy()
    } catch (e) {
      const screenshot = await preview.screenshot({
        type: 'jpeg',
        quality: 70,
      })
      await testInfo.attach('screenshot', {
        contentType: 'image/jpeg',
        body: screenshot,
      })
      throw e
    }
  })

  test('happy path', async ({ page }) => {
    // upload image
    const input = await page.locator('#file-input')
    await input.setInputFiles('./images/dog.jpg')

    await page.locator('#submit-btn').click()

    // check preview
    const preview = await page.locator('#preview')
    expect(await preview.screenshot(), {
      message: '預覽不正確',
    }).toMatchSnapshot('04-1-answer.png', { maxDiffPixelRatio: 0.01 })

    // crop area
    await preview.dragTo(preview, {
      sourcePosition: { x: 50, y: 50 },
      targetPosition: { x: 150, y: 150 },
    })

    expect(await preview.screenshot(), {
      message: '裁切預覽不正確',
    }).toMatchSnapshot('04-2-answer.png', { maxDiffPixelRatio: 0.01 })

    // crop image
    await page.locator('#crop-btn').click()
    expect(await preview.screenshot(), {
      message: '裁切不正確',
    }).toMatchSnapshot('04-3-answer.png', { maxDiffPixelRatio: 0.01 })

    // download image
    const downloadPromise = page.waitForEvent('download')
    await page.locator('#download-btn').click()
    const download = await downloadPromise
    const downloadPath = download.suggestedFilename()
    expect(downloadPath).toBe('crop_dog.jpg')
  })
})
