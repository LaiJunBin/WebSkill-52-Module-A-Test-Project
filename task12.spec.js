import { test, expect } from '@playwright/test'

const testBackgroundColor = async (page, mode) => {
  await page.evaluate(() => {
    const style = document.createElement('style')
    style.innerHTML =
      'body *, body::after, body::before { visibility: hidden; }'
    document.body.appendChild(style)

    const script = document.createElement('script')
    script.innerHTML = `
      for (let child of document.body.childNodes) {
        child.remove()
      }
      `
    document.body.appendChild(script)
  })

  expect(await page.screenshot(), {
    message: '背景顏色不正確',
  }).toMatchSnapshot(`12-${mode}-answer.png`)
}

const testContent = async (page, content, targetColor) => {
  const targetElements = await page.evaluate((content) => {
    return Array.from(document.querySelectorAll('*'))
      .map((el) => {
        const text = el.textContent
        const style = window.getComputedStyle(el)

        const beforeElement = window.getComputedStyle(el, '::before')
        const beforeContent = beforeElement.content

        const afterElement = window.getComputedStyle(el, '::after')
        const afterContent = afterElement.content

        return [
          [style.color, text],
          [beforeElement.color, beforeContent.trim().slice(1, -1)],
          [afterElement.color, afterContent.trim().slice(1, -1)],
        ]
      })
      .flat()
      .filter((pair) => pair[1].trim() === content)
  }, content)

  expect(targetElements?.length, {
    message: '文字不存在或不正確',
  }).toBeGreaterThan(0)

  expect(
    targetElements.some((element) => element[0] === targetColor),
    { message: '文字顏色不正確' }
  ).toBeTruthy()
}

test.describe('task12 with light', async () => {
  test.use({ colorScheme: 'light' })

  test.beforeEach(async ({ page }) => {
    await page.goto('/12/index.html')
  })

  test('check light mode background color', async ({ page }) => {
    await testBackgroundColor(page, 'light')
  })

  test('check light content', async ({ page }) => {
    await testContent(page, 'Light Mode Test', 'rgb(0, 0, 0)')
  })
})

test.describe('task12 with dark', async () => {
  test.use({ colorScheme: 'dark' })

  test.beforeEach(async ({ page }) => {
    await page.goto('/12/index.html')
  })

  test('check dark mode background color', async ({ page }) => {
    await testBackgroundColor(page, 'dark')
  })

  test('check dark content', async ({ page }, testInfo) => {
    try {
      await testContent(page, 'Night Mode Test', 'rgb(255, 255, 255)')
    } catch (e) {
      // await page.screenshot({ path: '12-failed.png' })
      const screenshot = await page.screenshot()
      await testInfo.attach('screenshot', {
        body: screenshot,
        contentType: 'image/png',
      })
      throw e
    }
  })
})
