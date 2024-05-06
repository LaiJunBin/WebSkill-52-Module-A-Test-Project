import { test, expect } from '@playwright/test'

test.describe('task09', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/09/index.html')
  })

  test('init element UI', async ({ page }) => {
    const container = await page.locator('#display-container')
    expect(await container.screenshot(), {
      message: '初始化畫面不正確',
    }).toMatchSnapshot('09-0-answer.png')
  })

  const testWithMs = async (page, ms) => {
    await page.goto('/09/index.html')

    const container = await page.locator('#display-container')
    const startButton = await page.locator('#start-button')
    const stopButton = await page.locator('#stop-button')

    const handler = await page.evaluateHandle(() => {
      const originalNow = window.performance.now.bind(performance)
      performance.now = () => {
        return 0
      }
      return originalNow
    })
    await startButton.click()
    await page.evaluate((ms) => {
      performance.now = () => {
        return ms
      }
    }, ms)

    await stopButton.click()
    await page.evaluate((handler) => {
      performance.now = handler
    }, handler)
    const duration = Math.min(Math.floor(ms / 10), 999)
    const snapshot = `09-${duration}-answer.png`

    expect(await container.screenshot(), {
      message: `ms=${duration} 時不正確`,
    }).toMatchSnapshot(snapshot)
  }

  test('test 111, 222, ..., 999', async ({ page }) => {
    for (let i = 111; i <= 999; i += 111) {
      await testWithMs(page, i * 10)
    }
  })

  test('test boundary case', async ({ page }) => {
    const testcases = [
      12, 123, 1234, 2345, 3456, 4567, 5678, 6789, 7891, 8901, 9012,
    ]
    for (const ms of testcases) {
      await testWithMs(page, ms)
    }
  })

  test('test overflow case', async ({ page }) => {
    await testWithMs(page, 9980)

    const container = await page.locator('#display-container')
    const startButton = await page.locator('#start-button')
    await startButton.click()
    await page.waitForTimeout(100)

    const snapshot = `09-999-answer.png`

    expect(await container.screenshot(), {
      message: `ms超過999時不正確`,
    }).toMatchSnapshot(snapshot)
  })

  test('clear timer', async ({ page }) => {
    const container = await page.locator('#display-container')
    const startButton = await page.locator('#start-button')
    const stopButton = await page.locator('#stop-button')
    const clearButton = await page.locator('#clear-button')

    await startButton.click()
    await page.waitForTimeout(1000)
    await stopButton.click()

    await clearButton.click()
    expect(await container.screenshot(), {
      message: '清除不正確',
    }).toMatchSnapshot('09-0-answer.png')
  })

  // test('generate all snapshots', async ({ page }) => {
  //   test.setTimeout(0)
  //   for (let ms = 0; ms <= 999; ms++) {
  //     await page.goto(`/09/index.html?ms=${ms}`)
  //     const container = await page.locator('#display-container')
  //     expect(await container.screenshot(), {
  //       message: `ms=${ms} 時不正確`,
  //     }).toMatchSnapshot(`09-${ms}-answer.png`, { maxDiffPixelRatio: 0.01 })
  //   }
  // })
})
