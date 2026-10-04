import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems = this.page.locator('.cart_item');
  readonly checkoutButton = this.page.locator('#checkout');

  constructor(page: Page) {
    super(page);
  }

  async verifyCartItemsCount(expectedCount: number) {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async verifyItemInCart(itemName: string) {
    const item = this.page.locator(`.cart_item:has-text("${itemName}")`);
    await expect(item).toBeVisible();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}