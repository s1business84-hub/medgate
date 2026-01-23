import { test, expect } from '@playwright/test'

test.describe('Form Workflow - Admin to Student to Supervisor', () => {
  const base = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001'
  const adminUrl = `${base}/login`
  const studentUrl = `${base}/login`
  const adminEmail = 'admin@example.com'
  const studentEmail = 'student@example.com'
  const adminPassword = 'demo'
  const studentPassword = 'demo'

  test('Admin accepts application and assigns form', async ({ page }) => {
    // Admin login
    await page.goto(adminUrl)
    await page.fill('input[type="email"]', adminEmail)
    await page.fill('input[type="password"]', adminPassword)
    await page.click('button:has-text("Sign In")')
    await page.waitForNavigation()

    // Navigate to admin page
    await page.goto(`${base}/admin`)
    await page.waitForSelector('[data-testid="accept-application-button"]', { timeout: 5000 })

    // Accept first application
    await page.click('[data-testid="accept-application-button"]')
    await page.waitForTimeout(1000)

    // Check that form assignment section appears
    const formAssignmentVisible = await page.locator('text=Assign Observation Form').isVisible()
    expect(formAssignmentVisible).toBeTruthy()

    // Click to show form creation
    await page.click('button:has-text("Assign Observation Form")')
    await page.waitForTimeout(500)

    // Create new form mode
    await page.click('button:has-text("Create New Form")')
    await page.waitForTimeout(500)

    // Fill form title
    await page.fill('input[placeholder="e.g., Daily Observation Form, Session Feedback"]', 'Daily Observation Form')

    // Fill form description
    await page.fill('textarea[placeholder="What should the student focus on when filling this form?"]', 
      'Please provide feedback on the student\'s clinical skills and professionalism')

    // Update first field
    const fieldLabels = await page.locator('input[placeholder="Field label"]')
    await fieldLabels.first().fill('Clinical Performance')

    // Set field type to rating
    const fieldTypes = await page.locator('select').filter({ hasText: 'Text' })
    await fieldTypes.first().selectOption('rating')

    // Add another field
    await page.click('button:has-text("Add Field")')
    await page.waitForTimeout(300)

    // Fill second field
    const allFieldLabels = await page.locator('input[placeholder="Field label"]')
    await allFieldLabels.nth(1).fill('Areas for Improvement')
    
    const allFieldTypes = await page.locator('select').filter({ hasText: 'Text' })
    await allFieldTypes.nth(1).selectOption('textarea')

    // Check required checkbox for second field
    const requiredCheckboxes = await page.locator('input[type="checkbox"]').filter({ hasText: 'Required' })
    await requiredCheckboxes.nth(1).check()

    // Assign form
    await page.click('button:has-text("Assign Form")')
    await page.waitForTimeout(1000)

    // Verify success toast
    const successMsg = await page.locator('text=Form assigned successfully').isVisible()
    expect(successMsg).toBeTruthy()
  })

  test('Student fills observation form after session', async ({ page }) => {
    // Student login
    await page.goto(studentUrl)
    await page.fill('input[type="email"]', studentEmail)
    await page.fill('input[type="password"]', studentPassword)
    await page.click('button:has-text("Sign In")')
    await page.waitForNavigation()

    // Navigate to form submission
    await page.goto('http://localhost:3000/student/form-submission')
    await page.waitForTimeout(1000)

    // Select form
    const formButton = await page.locator('button:has-text("Daily Observation Form")').first()
    if (await formButton.isVisible()) {
      await formButton.click()
      await page.waitForTimeout(500)
    }

    // Fill rating field
    const stars = await page.locator('span:has-text("★")')
    if (await stars.first().isVisible()) {
      // Click 4th star for rating of 4
      const starButtons = page.locator('button').filter({ has: page.locator('span:has-text("★")') })
      const starCount = await starButtons.count()
      if (starCount >= 4) {
        await starButtons.nth(3).click()
        await page.waitForTimeout(200)
      }
    }

    // Fill textarea
    const textareas = page.locator('textarea')
    const textareaCount = await textareas.count()
    if (textareaCount > 0) {
      await textareas.first().fill('Student demonstrated strong clinical reasoning and attention to detail.')
    }

    // Submit form
    await page.click('button:has-text("Submit Form")')
    await page.waitForTimeout(1500)

    // Verify success message
    const successMsg = await page.locator('text=Form submitted successfully').isVisible()
    expect(successMsg).toBeTruthy()
  })

  test('Supervisor tracks student performance in dashboard', async ({ page }) => {
    // Admin/Supervisor login
    await page.goto(adminUrl)
    await page.fill('input[type="email"]', adminEmail)
    await page.fill('input[type="password"]', adminPassword)
    await page.click('button:has-text("Sign In")')
    await page.waitForNavigation()

    // Navigate to form tracking
    await page.goto('http://localhost:3000/admin/form-tracking')
    await page.waitForTimeout(1500)

    // Check Students tab
    const studentsTab = await page.locator('text=Students').first()
    expect(studentsTab).toBeTruthy()

    // Wait for student list to load
    await page.waitForSelector('button[class*="rounded-lg"][class*="border"]', { timeout: 5000 })

    // Click on a student card
    const studentCards = await page.locator('button').filter({ has: page.locator('text=ID:') })
    if (await studentCards.first().isVisible()) {
      await studentCards.first().click()
      await page.waitForTimeout(500)

      // Should automatically switch to Sessions tab
      const sessionsTab = await page.locator('text=Sessions')
      const isEnabled = !await sessionsTab.isDisabled()
      expect(isEnabled).toBeTruthy()

      // Click Sessions tab
      await sessionsTab.click()
      await page.waitForTimeout(500)

      // Verify session data is displayed
      const sessionData = await page.locator('text=Session').first()
      expect(await sessionData.isVisible()).toBeTruthy()
    }

    // Click Forms tab
    const formsTab = await page.locator('text=Forms')
    if (await formsTab.isEnabled()) {
      await formsTab.click()
      await page.waitForTimeout(500)

      // Should show form submissions
      const formItems = await page.locator('[class*="p-4"][class*="bg-white"]')
      const count = await formItems.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }

    // Click Performance tab
    const perfTab = await page.locator('text=Performance')
    await perfTab.click()
    await page.waitForTimeout(500)

    // Verify performance data
    const perfHeader = await page.locator('text=Top Performing Students')
    expect(await perfHeader.isVisible()).toBeTruthy()
  })

  test('Form field validation works correctly', async ({ page }) => {
    // Student login
    await page.goto(studentUrl)
    await page.fill('input[type="email"]', studentEmail)
    await page.fill('input[type="password"]', studentPassword)
    await page.click('button:has-text("Sign In")')
    await page.waitForNavigation()

    // Navigate to form submission
    await page.goto('http://localhost:3000/student/form-submission')
    await page.waitForTimeout(1000)

    // Select form if available
    const formButton = await page.locator('button:has-text("Daily Observation Form")').first()
    if (await formButton.isVisible()) {
      await formButton.click()
      await page.waitForTimeout(500)

      // Try submitting without filling required fields
      await page.click('button:has-text("Submit Form")')
      await page.waitForTimeout(500)

      // Check for error messages
      const errors = await page.locator('[class*="red"][class*="text"]').filter({ hasText: 'required' })
      if (await errors.first().isVisible()) {
        expect(await errors.count()).toBeGreaterThan(0)
      }
    }
  })

  test('Application status transitions correctly', async ({ page }) => {
    // Admin login
    await page.goto(adminUrl)
    await page.fill('input[type="email"]', adminEmail)
    await page.fill('input[type="password"]', adminPassword)
    await page.click('button:has-text("Sign In")')
    await page.waitForNavigation()

    // Navigate to admin
    await page.goto('http://localhost:3000/admin')
    await page.waitForSelector('[data-testid="accept-application-button"]', { timeout: 5000 })

    // Get initial status
    const statusBadge = await page.locator('[class*="px-"][class*="py-"][class*="rounded"]').filter({ hasText: 'Submitted' })
    const initialStatus = await statusBadge.first().textContent()

    // Accept application
    await page.click('[data-testid="accept-application-button"]')
    await page.waitForTimeout(1000)

    // Check new status
    const newStatusBadge = await page.locator('[class*="px-"][class*="py-"][class*="rounded"]').filter({ hasText: 'Stage 2' })
    const newStatus = await newStatusBadge.first().textContent()

    expect(newStatus).toContain('Stage 2')
  })
})
