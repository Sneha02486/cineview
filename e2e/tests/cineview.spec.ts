import { test, expect } from '@playwright/test';

test.describe('CineView Verified Kerala 3D Cinema Ticketing Experience', () => {

  test('1. Home page loads successfully with updated tagline & hero heading', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/CineView/i);

    // Verify updated tagline badge: "YOUR PERFECT VIEW STARTS HERE"
    const taglineBadge = page.locator('text=YOUR PERFECT VIEW STARTS HERE');
    await expect(taglineBadge).toBeVisible();

    // Verify retained main heading: "See Your View Before You Book."
    await expect(page.locator('h1')).toContainText(/See Your View Before You Book/i);

    // Verify search bar and Indian city selector
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="city-selector"]')).toBeVisible();

    // Verify real movie cards are rendered
    const movieCards = page.locator('[data-testid="movie-card"]');
    await expect(movieCards.first()).toBeVisible({ timeout: 10000 });
    const count = await movieCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('2. Malayalam filter displays Bouma, Disco, or Melcow Pondicherry under Now Showing', async ({ page }) => {
    await page.goto('/');

    // Switch city to Kochi
    const citySelector = page.locator('[data-testid="city-selector"]');
    await citySelector.selectOption('Kochi');
    await expect(page.locator('text=Now Showing in Kochi')).toBeVisible();

    // Click Malayalam language filter
    const malayalamFilter = page.locator('[data-testid="lang-btn-Malayalam"]');
    await expect(malayalamFilter).toBeVisible();
    await malayalamFilter.click();

    // Verify verified releases appear
    await expect(
      page.locator('text=Bouma').or(page.locator('text=Disco')).or(page.locator('text=Melcow Pondicherry')).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('3. Tamil filter displays Scene under Now Showing', async ({ page }) => {
    await page.goto('/');

    // Click Tamil language filter
    const tamilFilter = page.locator('[data-testid="lang-btn-Tamil"]');
    await expect(tamilFilter).toBeVisible();
    await tamilFilter.click();

    // Verify "Scene" is visible
    await expect(page.locator('text=Scene').first()).toBeVisible({ timeout: 10000 });
  });

  test('4. Old movies are removed from Now Showing', async ({ page }) => {
    await page.goto('/');

    // Verify that old 2024 filler movies do NOT appear in the Now Showing section
    const nowShowingSection = page.locator('section', { hasText: 'Now Showing in' });
    await expect(nowShowingSection.locator('text=Dune: Part Two')).toHaveCount(0);
    await expect(nowShowingSection.locator('text=Manjummel Boys')).toHaveCount(0);
    await expect(nowShowingSection.locator('text=Aavesham')).toHaveCount(0);
  });

  test('5. City switching updates movie count and verified cinemas', async ({ page }) => {
    await page.goto('/');

    // Check Kochi
    const citySelector = page.locator('[data-testid="city-selector"]');
    await citySelector.selectOption('Kochi');
    await expect(page.locator('text=Now Showing in Kochi')).toBeVisible();

    // Switch to Thiruvananthapuram
    await citySelector.selectOption('Thiruvananthapuram');
    await expect(page.locator('text=Now Showing in Thiruvananthapuram')).toBeVisible();

    // Open first movie in TVM
    const firstMovie = page.locator('[data-testid="movie-card"]').first();
    await firstMovie.click();

    // Verify Thiruvananthapuram cinema listings (e.g. Ariesplex or PVR INOX LuLu Akkulam)
    await expect(page.locator('text=Verified Cinemas & Showtimes in Thiruvananthapuram')).toBeVisible();
  });

  test('6. Theater tabs display verified multiplexes with INR pricing', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="movie-card"]').first().click();

    // Theaters tabs should be present
    const theaterTabs = page.locator('[data-testid="theater-tab"]');
    await expect(theaterTabs.first()).toBeVisible();
    await theaterTabs.first().click();

    // Showtime button should show time, format and INR price (₹)
    const showtimeBtn = page.locator('[data-testid="showtime-button"]').first();
    await expect(showtimeBtn).toBeVisible();
    await expect(showtimeBtn).toContainText('₹');
    await showtimeBtn.click();

    // Navigates to seat selection
    await expect(page).toHaveURL(/\/seats\/.+/);
    await expect(page.locator('text=Curved Cinema Screen This Way')).toBeVisible();
  });

  test('7. Available seats can be selected with INR price accumulation', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="movie-card"]').first().click();
    await page.locator('[data-testid="showtime-button"]').first().click();

    const seatF7 = page.locator('[data-testid="seat-F7"]');
    await expect(seatF7).toBeVisible();
    await seatF7.click();

    // Bottom bar should show 1 selected seat and price in INR (₹)
    await expect(page.locator('text=Selected Seats (1)')).toBeVisible();
    await expect(page.locator('text=Total Amount (INR)')).toBeVisible();
    await expect(page.locator('text=₹').first()).toBeVisible();
  });

  test('8. Prominent 3D Preview button opens interactive 3D virtual cinema', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="movie-card"]').first().click();
    await page.locator('[data-testid="showtime-button"]').first().click();

    // Click prominent "Preview View From This Seat" button
    const previewBtn = page.locator('[data-testid="preview-3d-button"]');
    await expect(previewBtn).toBeVisible();
    await previewBtn.click();

    // Verify 3D Canvas and HUD metrics
    await expect(page).toHaveURL(/\/preview-3d\/.+/);
    await expect(page.locator('canvas')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="preview-seat-code"]')).toBeVisible();
    await expect(page.locator('[data-testid="preview-distance"]')).toBeVisible();
    await expect(page.locator('[data-testid="preview-angle"]')).toBeVisible();
    await expect(page.locator('text=₹')).toBeVisible(); // Price in INR
  });

  test('9. Complete Indian demo booking flow with ₹ INR pricing & e-ticket', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="movie-card"]').first().click();
    await page.locator('[data-testid="showtime-button"]').first().click();

    // Select available seat H4
    const seat = page.locator('[data-testid="seat-H4"]');
    await expect(seat).toBeVisible();
    await seat.click();

    const proceedBtn = page.locator('[data-testid="proceed-booking-button"]');
    await expect(proceedBtn).toBeEnabled();
    await proceedBtn.click();

    // Fill customer contact form
    await page.locator('[data-testid="input-name"]').fill('Rahul Menon');
    await page.locator('[data-testid="input-email"]').fill('rahul.menon@cineview.in');
    await page.locator('[data-testid="input-phone"]').fill('+91 98460 54321');

    // Confirm booking
    await page.locator('[data-testid="confirm-booking-btn"]').click();

    // Confirmation page should load
    await expect(page).toHaveURL(/\/confirmation\/.+/, { timeout: 15000 });
    await expect(page.locator('text=Booking Confirmed!')).toBeVisible();
    await expect(page.locator('[data-testid="booking-reference"]')).toBeVisible();
    await expect(page.locator('[data-testid="download-ticket-btn"]')).toBeVisible();
    await expect(page.locator('text=₹').first()).toBeVisible(); // Price in INR
  });

});
