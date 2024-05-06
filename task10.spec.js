import { test, expect } from '@playwright/test'

test.describe('task10', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/10/a.html')
  })

  test('init selectors on every page', async ({ page }) => {
    const pages = ['a.html', 'b.html', 'c.html']
    const links = ['a', 'b', 'c']
    for (let i = 0; i < pages.length; i++) {
      await page.goto(`/10/${pages[i]}`)
      const link = await page.locator(`text=${links[i]}`)
      expect(await link.count(), { message: `找不到 ${links[i]}` }).toBe(1)
      expect(await link.evaluate((e) => e.tagName), {
        message: '標籤錯誤',
      }).toBe('A')
    }
  })

  test('check every page is 200 ok', async ({ request }) => {
    const pages = ['a.html', 'b.html', 'c.html']
    for (const pageName of pages) {
      const response = await request.get(`/10/${pageName}`)
      expect(response.status(), { message: `${pageName} 頁面錯誤` }).toBe(200)
    }
  })

  const runClickEveryLinkWithPage = async (page, request, startPage, steps) => {
    await page.goto(`/10/${startPage}.html`)

    await page.evaluate(() => {
      window.addEventListener('beforeunload', function (e) {
        e.preventDefault()
        return false
      })
    })

    page.on('dialog', async (dialog) => {
      throw new Error('你刷新了頁面')
    })

    for (const step of steps) {
      const link = await page.locator(`text=${step}`)
      await link.click()
      const html = await (await request.get(`/10/${step}.html`)).text()
      const newBody = await page.evaluate((html) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        return doc.body.innerHTML
      }, html)

      await page.waitForLoadState('networkidle')
      const body = await page.locator('body').innerHTML()

      expect(body, { message: '頁面內容不正確' }).toBe(newBody)
    }
  }

  test('click every link start with a', async ({ page, request }) => {
    await runClickEveryLinkWithPage(page, request, 'a', [
      'b',
      'c',
      'a',
      'c',
      'b',
      'a',
    ])
  })

  test('click every link start with b', async ({ page, request }) => {
    await runClickEveryLinkWithPage(page, request, 'b', [
      'a',
      'c',
      'b',
      'c',
      'a',
      'b',
    ])
  })

  test('click every link start with c', async ({ page, request }) => {
    await runClickEveryLinkWithPage(page, request, 'c', [
      'a',
      'b',
      'c',
      'b',
      'a',
      'c',
    ])
  })
})
