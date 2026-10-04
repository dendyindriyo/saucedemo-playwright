import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('SauceDemo E2E Automation Test Suite', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.navigate('/');
  });

  test('1. Customer Login & Validation (Positive & Negative Cases)', async () => {
    // Negative Case: Locked out user
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.verifyErrorMessage('Epic sadface: Sorry, this user has been locked out.');

    // Negative Case: Invalid password
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.passwordInput.fill('wrong_password');
    await loginPage.loginButton.click();
    await loginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service');

    // Positive Case: Valid credentials
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.loginButton.click();

    await productsPage.verifyOnProductsPage();
  });

  test('2. End-to-End Checkout Flow with Total Calculation Assertion', async () => {
    // Login
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.verifyOnProductsPage();

    // Add two distinct items to the cart
    const item1Name = 'Sauce Labs Backpack';
    const item2Name = 'Sauce Labs Bike Light';

    await productsPage.addItemToCartByName(item1Name);
    await productsPage.addItemToCartByName(item2Name);

    expect(await productsPage.getCartBadgeCount()).toBe('2');

    // Navigate to Cart page & verify items
    await productsPage.clickCartIcon();
    await cartPage.verifyCartItemsCount(2);
    await cartPage.verifyItemInCart(item1Name);
    await cartPage.verifyItemInCart(item2Name);

    // Proceed to Checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInformation('John', 'Doe', '12345');

    // Critical Assertion: Item Total + Tax = Total
    await checkoutPage.verifyAndAssertTotals();

    // Complete order
    await checkoutPage.finishCheckout();
    await checkoutPage.verifyOrderSuccess();
  });

  test('3. Sorting Functionality - Price (high to low)', async () => {
    // Login
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.verifyOnProductsPage();

    // Change sort order to "Price (high to low)"
    await productsPage.sortBy('hilo');

    const prices = await productsPage.getAllItemPrices();
    const firstItemPrice = await productsPage.getFirstItemPrice();

    // Assert first item is the most expensive
    const maxPrice = Math.max(...prices);
    expect(firstItemPrice).toBe(maxPrice);

    // Verify list is sorted in descending order
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });
});