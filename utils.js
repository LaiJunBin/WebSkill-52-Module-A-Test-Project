export async function pauseAnimation(page) {
  return await page.evaluate(() => {
    const style = document.createElement('style')
    style.innerHTML = `
        * {
          animation-play-state: paused !important;
        }
      `
    document.body.appendChild(style)
  })
}

export async function setAnimationTime(page, time, selector = '*') {
  return await page.evaluate(
    ({ time, selector }) => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((el) => {
        el.getAnimations().forEach((animation) => {
          animation.currentTime = time
        })
      })
    },
    { time, selector }
  )
}

export async function waitScreenshotUpdated(page, selector) {
  const bufferEqual = (a, b) => {
    if (a.length !== b.length) return false

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false
    }

    return true
  }

  let screenshot
  do {
    screenshot = await page.locator(selector).screenshot()
  } while (!bufferEqual(await page.locator(selector).screenshot(), screenshot))
}

export async function setAnimationTimeByIndex(
  page,
  time,
  index,
  selector = '*'
) {
  return await page.evaluate(
    ({ time, index, selector }) => {
      const animations = []
      const elements = document.querySelectorAll(selector)
      elements.forEach((el) => {
        el.getAnimations().forEach((animation) => {
          animations.push(animation)
        })
      })
      animations[index].currentTime = time
    },
    { time, index, selector }
  )
}
