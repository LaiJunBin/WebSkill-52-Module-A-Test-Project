import { test, expect } from '@playwright/test'

test.describe('task06', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/06/06.php')
  })

  const getCaptchaAnswer = async (context) => {
    const page = await context.newPage()
    await page.goto('/06/hack-answer.php')

    const answer = await page.locator('body').innerText()
    await page.close()
    return answer
  }

  test('check answer format', async ({ page, context }) => {
    for (let i = 0; i < 10; i++) {
      await page.goto('/06/06-captcha.php')
      const answer = await getCaptchaAnswer(context)
      expect(answer, { message: '驗證碼格式不正確' }).toMatch(/^[2-9A-Z]{4}$/)
    }
  })

  test('correct case', async ({ page, context }) => {
    const answer = await getCaptchaAnswer(context)
    const captchInput = await page.locator('#captcha-input')
    await captchInput.fill(answer)
    const submitButton = await page.locator('#submit-btn')
    await submitButton.click()

    const result = await page.locator('#result').innerText()
    expect(result, { message: '驗證結果不正確' }).toBe('成功')
    expect(await page.locator('#result').screenshot(), {
      message: '結果樣式不正確',
    }).toMatchSnapshot('06-1-answer.png')
  })

  test('wrong case', async ({ page }) => {
    const captchInput = await page.locator('#captcha-input')
    await captchInput.fill('123')
    const submitButton = await page.locator('#submit-btn')
    await submitButton.click()

    const result = await page.locator('#result').innerText()
    expect(result, { message: '驗證結果不正確' }).toBe('失敗')
    expect(await page.locator('#result').screenshot(), {
      message: '結果樣式不正確',
    }).toMatchSnapshot('06-2-answer.png')
  })

  test('refresh captcha', async ({ page, context }) => {
    const oldAnswer = await getCaptchaAnswer(context)
    const refreshButton = await page.locator('#refresh-btn')
    await refreshButton.click()
    const newAnswer = await getCaptchaAnswer(context)
    expect(oldAnswer, { message: '驗證碼沒有刷新' }).not.toBe(newAnswer)
  })

  test('check 06-captcha.php file header', async ({ request }) => {
    const response = await request.get('/06/06-captcha.php')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toMatch(/image\/jpeg|image\/jpg/)
  })
})
