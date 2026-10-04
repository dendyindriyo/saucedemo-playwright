import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string = '/') {
    await this.page.goto(path);
  }

  async getCartBadgeCount(): Promise<string> {
    const badge = this.page.locator('.shopping_cart_badge');
    if (await badge.isVisible()) {
      return (await badge.textContent()) || '0';
    }
    return '0';
  }

  async clickCartIcon() {
    await this.page.locator('.shopping_cart_link').click();
  }
}