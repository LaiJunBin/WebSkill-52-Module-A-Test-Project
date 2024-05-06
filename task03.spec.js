import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'parallel' })

test.describe('task03', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/03/Task03.html')
  })

  test('check selector', async ({ page }) => {
    const selectors = [
      '#btn-0',
      '#btn-1',
      '#btn-2',
      '#btn-3',
      '#btn-4',
      '#btn-5',
      '#btn-6',
      '#btn-7',
      '#btn-8',
      '#btn-9',
      '#btn-dot',
      '#btn-clear',
      '#btn-add',
      '#btn-sub',
      '#btn-mul',
      '#btn-div',
      '#btn-calc',
      '#result',
    ]

    for (const selector of selectors) {
      expect(await page.locator(selector).count(), {
        message: `找不到 ${selector}`,
      }).toBe(1)
    }
  })

  test('init result value', async ({ page }) => {
    expect(await page.locator('#result').innerText(), {
      message: '初始化結果不正確',
    }).toBe('0')
  })

  test('click button', async ({ page }) => {
    await page.locator('#btn-1').click()
    await page.locator('#btn-2').click()
    await page.locator('#btn-3').click()
    expect(await page.locator('#result').innerText(), {
      message: '按鈕點擊不正確',
    }).toBe('123')
  })

  test('click add button', async ({ page }) => {
    await page.locator('#btn-1').click()
    await page.locator('#btn-add').click()
    await page.locator('#btn-2').click()
    await page.locator('#btn-calc').click()
    expect(await page.locator('#result').innerText(), {
      message: '加法不正確',
    }).toBe('3')
  })

  test('click sub button', async ({ page }) => {
    await page.locator('#btn-1').click()
    await page.locator('#btn-sub').click()
    await page.locator('#btn-2').click()
    await page.locator('#btn-calc').click()
    expect(await page.locator('#result').innerText(), {
      message: '減法不正確',
    }).toBe('-1')
  })

  test('click mul button', async ({ page }) => {
    await page.locator('#btn-2').click()
    await page.locator('#btn-mul').click()
    await page.locator('#btn-3').click()
    await page.locator('#btn-calc').click()
    expect(await page.locator('#result').innerText(), {
      message: '乘法不正確',
    }).toBe('6')
  })

  test('click div button', async ({ page }) => {
    await page.locator('#btn-6').click()
    await page.locator('#btn-div').click()
    await page.locator('#btn-3').click()
    await page.locator('#btn-calc').click()
    expect(await page.locator('#result').innerText(), {
      message: '除法不正確',
    }).toBe('2')
  })

  test('click clear button', async ({ page }) => {
    await page.locator('#btn-6').click()
    await page.locator('#btn-clear').click()
    expect(await page.locator('#result').innerText(), {
      message: '清除不正確',
    }).toBe('0')
  })

  test('click multiple operator', async ({ page }) => {
    await page.locator('#btn-6').click()
    await page.locator('#btn-add').click()
    await page.locator('#btn-3').click()
    await page.locator('#btn-mul').click()
    await page.locator('#btn-2').click()
    await page.locator('#btn-calc').click()
    expect(await page.locator('#result').innerText(), {
      message: '多重運算不正確',
    }).toBe('12')
  })

  test('click div button with infinite float', async ({ page }) => {
    await page.locator('#btn-1').click()
    await page.locator('#btn-div').click()
    await page.locator('#btn-3').click()
    await page.locator('#btn-calc').click()
    expect(await page.locator('#result').innerText(), {
      message: '除法不正確',
    }).toBe('0.33')
  })

  test('click add with float', async ({ page }) => {
    await page.locator('#btn-1').click()
    await page.locator('#btn-dot').click()
    await page.locator('#btn-3').click()
    await page.locator('#btn-add').click()
    await page.locator('#btn-2').click()
    await page.locator('#btn-calc').click()
    expect(await page.locator('#result').innerText(), {
      message: '小數加法不正確',
    }).toBe('3.3')
  })

  test('click sub with float', async ({ page }) => {
    await page.locator('#btn-1').click()
    await page.locator('#btn-dot').click()
    await page.locator('#btn-3').click()
    await page.locator('#btn-sub').click()
    await page.locator('#btn-2').click()
    await page.locator('#btn-calc').click()
    expect(await page.locator('#result').innerText(), {
      message: '小數減法不正確',
    }).toBe('-0.7')
  })

  test('click mul with float', async ({ page }) => {
    await page.locator('#btn-1').click()
    await page.locator('#btn-dot').click()
    await page.locator('#btn-3').click()
    await page.locator('#btn-mul').click()
    await page.locator('#btn-2').click()
    await page.locator('#btn-calc').click()
    expect(await page.locator('#result').innerText(), {
      message: '小數乘法不正確',
    }).toBe('2.6')
  })

  test('click div with float', async ({ page }) => {
    await page.locator('#btn-1').click()
    await page.locator('#btn-dot').click()
    await page.locator('#btn-3').click()
    await page.locator('#btn-div').click()
    await page.locator('#btn-3').click()
    await page.locator('#btn-calc').click()
    expect(await page.locator('#result').innerText(), {
      message: '小數除法不正確',
    }).toBe('0.43')
  })

  test('click div with round', async ({ page }) => {
    await page.locator('#btn-1').click()
    await page.locator('#btn-dot').click()
    await page.locator('#btn-1').click()
    await page.locator('#btn-div').click()
    await page.locator('#btn-4').click()
    await page.locator('#btn-calc').click()
    expect(await page.locator('#result').innerText(), {
      message: '小數除法進位不正確',
    }).toBe('0.28')
  })
})
