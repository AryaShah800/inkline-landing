// End-to-end checks for the Inkline landing page, plus the submission screenshots.
//
// Run with the site already serving (npm run dev, or npm run build && npm run preview):
//   node <skills-folder>/playwright-skill/run.js tests/landing_check.cjs
// Optional environment variables:
//   TARGET_URL   page to test (default http://localhost:5173)
//   HEADED=1     watch the browser instead of running headless
//   REVIEW_DIR   also write extra full-page screenshots to this folder
const { chromium } = require('playwright')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5173'
const SHOTS_DIR = path.join(__dirname, '..', 'screenshots')
const REVIEW_DIR = process.env.REVIEW_DIR

const DESKTOP = { width: 1440, height: 900 }
const PHONE = { width: 390, height: 844 }

const results = []
const consoleProblems = []

async function check(name, fn) {
  try {
    await fn()
    results.push({ name, ok: true })
    console.log(`  PASS  ${name}`)
  } catch (error) {
    results.push({ name, ok: false })
    console.log(`  FAIL  ${name}\n        ${String(error.message).split('\n')[0]}`)
  }
}

async function openPage(browser, options, label) {
  const context = await browser.newContext(options)
  const page = await context.newPage()
  page.on('console', (message) => {
    if (message.type() === 'error') consoleProblems.push(`[${label}] ${message.text()}`)
  })
  page.on('pageerror', (error) => consoleProblems.push(`[${label}] ${error.message}`))
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' })
  return { context, page }
}

// Smooth scrolling takes a moment; wait until the scroll position stops changing.
async function settle(page) {
  let last = -1
  let stable = 0
  while (stable < 3) {
    await page.waitForTimeout(120)
    const now = await page.evaluate(() => Math.round(window.scrollY))
    stable = now === last ? stable + 1 : 0
    last = now
  }
}

async function headingTop(page, id) {
  return page.locator(`#${id}`).evaluate((element) => element.getBoundingClientRect().top)
}

async function visibleErrors(page) {
  const texts = await page.locator('[id$="-error"]').allInnerTexts()
  return texts.map((text) => text.trim()).filter(Boolean)
}

async function fillValidForm(page, email = 'priya@studio.example') {
  await page.getByLabel('Full name').fill('Priya Sharma')
  await page.getByLabel('Work email').fill(email)
  await page.getByLabel('Team size').selectOption('2 to 10 people')
}

// The hero plays one sequence on load: signature drawn, status flips to Signed, stamp lands.
// Wait for the last visible change, then a moment for the stamp to settle.
async function waitForHeroAnimation(page) {
  await page.waitForFunction(
    () => getComputedStyle(document.querySelector('.chip-signed')).visibility === 'visible',
    null,
    { timeout: 8000 },
  )
  await page.waitForTimeout(500)
}

async function run() {
  fs.mkdirSync(SHOTS_DIR, { recursive: true })
  if (REVIEW_DIR) fs.mkdirSync(REVIEW_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: !process.env.HEADED })

  console.log(`\nDesktop ${DESKTOP.width}x${DESKTOP.height}`)
  const desktop = await openPage(browser, { viewport: DESKTOP }, 'desktop')
  const d = desktop.page

  await check('page has one h1 and all section headings', async () => {
    assert.equal(await d.locator('h1').count(), 1)
    for (const id of ['features', 'how-it-works', 'pricing', 'contact']) {
      assert.equal(await d.locator(`#${id}-title`).count(), 1, `missing heading for ${id}`)
    }
  })

  await check('each nav link scrolls to its section, below the sticky header', async () => {
    for (const [label, id] of [
      ['Features', 'features'],
      ['How it works', 'how-it-works'],
      ['Pricing', 'pricing'],
      ['Contact', 'contact'],
    ]) {
      await d
        .getByRole('navigation', { name: 'Primary' })
        .getByRole('link', { name: label })
        .click()
      await settle(d)
      const top = await headingTop(d, `${id}-title`)
      assert.ok(top >= 70, `${label} heading is hidden under the header (top=${Math.round(top)})`)
      assert.ok(top < 500, `${label} heading is not near the top (top=${Math.round(top)})`)
    }
  })

  await check('active nav link follows the section in view', async () => {
    await d
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Pricing' })
      .click()
    await settle(d)
    await d.waitForTimeout(200)
    const current = await d
      .getByRole('navigation', { name: 'Primary' })
      .locator('[aria-current="location"]')
      .innerText()
    assert.equal(current, 'Pricing')
  })

  await check('Get started scrolls to pricing', async () => {
    await d.evaluate(() => window.scrollTo(0, 0))
    await d.getByRole('link', { name: 'Get started' }).first().click()
    await settle(d)
    assert.ok((await headingTop(d, 'pricing-title')) < 500)
  })

  await check('Book a demo scrolls to the form and focuses the name field', async () => {
    await d.evaluate(() => window.scrollTo(0, 0))
    await d.getByRole('link', { name: 'Book a demo' }).click()
    await settle(d)
    await d.waitForTimeout(150)
    assert.ok((await headingTop(d, 'contact-title')) < 500)
    assert.equal(await d.evaluate(() => document.activeElement?.id), 'field-name')
  })

  await check('pricing buttons preselect their plan in the form', async () => {
    await d.evaluate(() => window.scrollTo(0, 0))
    for (const [button, plan] of [
      ['Choose Agency', 'agency'],
      ['Start free', 'free'],
      ['Choose Pro', 'pro'],
    ]) {
      await d.getByRole('link', { name: button }).click()
      await settle(d)
      assert.equal(
        await d.locator('#field-plan').inputValue(),
        plan,
        `${button} did not select ${plan}`,
      )
      assert.ok((await headingTop(d, 'contact-title')) < 500, `${button} did not reach the form`)
      await d.evaluate(() => window.scrollTo(0, document.querySelector('#pricing').offsetTop))
    }
  })

  await check('billing toggle switches prices', async () => {
    await d.getByRole('button', { name: 'Yearly, 20% off' }).click()
    const pro = d.locator('article', { has: d.getByRole('heading', { name: 'Pro' }) })
    assert.match(await pro.innerText(), /₹639/)
    assert.match(await pro.innerText(), /Billed ₹7,668 a year/)
    await d.getByRole('button', { name: 'Monthly' }).click()
    assert.match(await pro.innerText(), /₹799/)
  })

  await check('empty submit is blocked with three errors and focus on Full name', async () => {
    await d.locator('#contact-title').scrollIntoViewIfNeeded()
    await d.getByRole('button', { name: 'Request demo' }).click()
    const errors = await visibleErrors(d)
    assert.equal(errors.length, 3, `expected 3 errors, got ${JSON.stringify(errors)}`)
    assert.equal(await d.evaluate(() => document.activeElement?.id), 'field-name')
    assert.equal(await d.locator('#field-name').getAttribute('aria-invalid'), 'true')
    assert.equal(await d.getByRole('heading', { name: 'Demo requested' }).count(), 0)
  })

  await check('errors clear as the person fixes each field', async () => {
    await fillValidForm(d)
    assert.equal((await visibleErrors(d)).length, 0)
  })

  await check('bad email is rejected', async () => {
    await d.getByLabel('Work email').fill('name@')
    await d.getByRole('button', { name: 'Request demo' }).click()
    const errors = await visibleErrors(d)
    assert.equal(errors.length, 1)
    assert.match(errors[0], /Enter an email like name@company.com/)
    assert.equal(await d.evaluate(() => document.activeElement?.id), 'field-email')
  })

  await check('message over 500 characters is rejected', async () => {
    await d.getByLabel('Work email').fill('priya@studio.example')
    await d.getByLabel('Message (optional)').fill('x'.repeat(501))
    await d.getByRole('button', { name: 'Request demo' }).click()
    assert.match((await visibleErrors(d))[0], /under 500 characters/)
    await d.getByLabel('Message (optional)').fill('')
  })

  await check('valid submit shows sending, then a success message with the email', async () => {
    await d.getByRole('button', { name: 'Request demo' }).click()
    await d.getByRole('button', { name: 'Sending…' }).waitFor({ timeout: 2000 })
    await d.getByRole('heading', { name: 'Demo requested' }).waitFor({ timeout: 4000 })
    assert.match(await d.locator('#contact [role="status"]').innerText(), /priya@studio\.example/)
  })

  await check('Send another request reopens an empty form', async () => {
    await d.getByRole('button', { name: 'Send another request' }).click()
    assert.equal(await d.getByLabel('Full name').inputValue(), '')
    assert.equal((await visibleErrors(d)).length, 0)
  })

  await check('hero signature sequence completes and the status flips to Signed', async () => {
    await d.reload({ waitUntil: 'networkidle' })
    await waitForHeroAnimation(d)
    assert.equal(
      await d.locator('.chip-signed').evaluate((el) => getComputedStyle(el).visibility),
      'visible',
    )
  })

  await d.evaluate(() => window.scrollTo(0, 0))
  await d.screenshot({ path: path.join(SHOTS_DIR, 'desktop.png') })
  for (const [id, file] of [
    ['features-title', 'desktop-features.png'],
    ['pricing-title', 'desktop-pricing.png'],
  ]) {
    await d.evaluate((headingId) => {
      const heading = document.getElementById(headingId)
      window.scrollTo({
        top: window.scrollY + heading.getBoundingClientRect().top - 110,
        behavior: 'instant',
      })
    }, id)
    await settle(d)
    await d.screenshot({ path: path.join(SHOTS_DIR, file) })
  }
  if (REVIEW_DIR)
    await d.screenshot({ path: path.join(REVIEW_DIR, 'desktop-full.png'), fullPage: true })
  await desktop.context.close()

  console.log(`\nPhone ${PHONE.width}x${PHONE.height}`)
  const phone = await openPage(
    browser,
    { viewport: PHONE, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    'phone',
  )
  const m = phone.page

  await check('mobile menu opens, a link closes it and scrolls to the section', async () => {
    assert.equal(await m.locator('#mobile-menu').isVisible(), false)
    await m.getByRole('button', { name: 'Open menu' }).click()
    assert.equal(await m.locator('#mobile-menu').isVisible(), true)
    assert.equal(
      await m.getByRole('button', { name: 'Close menu' }).getAttribute('aria-expanded'),
      'true',
    )
    await m.locator('#mobile-menu').getByRole('link', { name: 'Pricing' }).click()
    await settle(m)
    assert.equal(await m.locator('#mobile-menu').isVisible(), false)
    const top = await headingTop(m, 'pricing-title')
    assert.ok(top >= 70 && top < 500, `Pricing heading at top=${Math.round(top)}`)
  })

  await check('Escape closes the mobile menu', async () => {
    await m.getByRole('button', { name: 'Open menu' }).click()
    await m.keyboard.press('Escape')
    assert.equal(await m.locator('#mobile-menu').isVisible(), false)
  })

  await check('mobile form validates and succeeds', async () => {
    await m.evaluate(() => window.scrollTo(0, 0))
    await m.getByRole('link', { name: 'Choose Agency' }).click()
    await settle(m)
    await m.getByRole('button', { name: 'Request demo' }).click()
    assert.equal((await visibleErrors(m)).length, 3)
    await fillValidForm(m)
    await m.getByRole('button', { name: 'Request demo' }).click()
    await m.getByRole('heading', { name: 'Demo requested' }).waitFor({ timeout: 4000 })
    assert.match(await m.locator('#contact [role="status"]').innerText(), /Agency plan/)
  })

  await check('a pricing button reopens the form after a success', async () => {
    await m.evaluate(() => window.scrollTo(0, document.querySelector('#pricing').offsetTop))
    await m.getByRole('link', { name: 'Choose Pro' }).click()
    await settle(m)
    assert.equal(await m.getByRole('button', { name: 'Request demo' }).count(), 1)
    assert.equal(await m.locator('#field-plan').inputValue(), 'pro')
  })

  // Screenshot of the success state: submit once more and frame the panel.
  await fillValidForm(m, 'priya@studio.example')
  await m.getByRole('button', { name: 'Request demo' }).click()
  await m.getByRole('heading', { name: 'Demo requested' }).waitFor({ timeout: 4000 })
  // Frame the success panel just below the sticky header.
  await m.evaluate(() => {
    const panel = document.querySelector('#contact [role="status"]')
    window.scrollTo({
      top: window.scrollY + panel.getBoundingClientRect().top - 140,
      behavior: 'instant',
    })
  })
  await settle(m)
  await m.screenshot({ path: path.join(SHOTS_DIR, 'form-success.png') })

  // Phone screenshots are one screen tall each, so they sit side by side in the README.
  await m.reload({ waitUntil: 'networkidle' })
  await waitForHeroAnimation(m)
  await m.evaluate(() => window.scrollTo(0, 0))
  await m.screenshot({ path: path.join(SHOTS_DIR, 'mobile-hero.png') })

  await m.getByRole('button', { name: 'Open menu' }).click()
  await m.locator('#mobile-menu').waitFor()
  await m.screenshot({ path: path.join(SHOTS_DIR, 'mobile-menu.png') })
  await m.keyboard.press('Escape')

  await m.evaluate(() => {
    document.activeElement?.blur()
    const heading = document.querySelector('#pricing-title')
    window.scrollTo({
      top: window.scrollY + heading.getBoundingClientRect().top - 100,
      behavior: 'instant',
    })
  })
  await settle(m)
  await m.screenshot({ path: path.join(SHOTS_DIR, 'mobile-pricing.png') })

  if (REVIEW_DIR) {
    await m.screenshot({ path: path.join(REVIEW_DIR, 'mobile-full.png'), fullPage: true })
  }
  await phone.context.close()

  console.log('\nNo sideways scrolling')
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await check(`no horizontal scroll at ${width}px`, async () => {
      const { context, page } = await openPage(
        browser,
        { viewport: { width, height: 800 } },
        `w${width}`,
      )
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      await context.close()
      assert.ok(overflow <= 0, `page is ${overflow}px wider than the screen`)
    })
  }

  console.log('\nReduced motion')
  await check('reduced motion shows the finished signature immediately', async () => {
    const { context, page } = await openPage(
      browser,
      { viewport: DESKTOP, reducedMotion: 'reduce' },
      'reduced-motion',
    )
    assert.equal(
      await page.locator('.chip-signed').evaluate((el) => getComputedStyle(el).visibility),
      'visible',
    )
    assert.equal(
      await page.locator('.chip-awaiting').evaluate((el) => getComputedStyle(el).display),
      'none',
    )
    assert.equal(
      await page.locator('.signature-live').evaluate((el) => getComputedStyle(el).strokeDashoffset),
      '0px',
    )
    await context.close()
  })

  await check('no console errors on any page', async () => {
    assert.equal(consoleProblems.length, 0, consoleProblems.join(' | '))
  })

  await browser.close()

  const failed = results.filter((result) => !result.ok)
  console.log(`\n${results.length - failed.length} of ${results.length} checks passed`)
  if (failed.length > 0) process.exit(1)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
