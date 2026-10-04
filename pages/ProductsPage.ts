import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly pageTitle = this.page.locator('.title');
  readonly sortDropdown = this.page.locator('[data-test="product-sort-container"]');
  readonly itemPrices = this.page.locator('.inventory_item_price');

  constructor(page: Page) {
    super(page);
  }

  async verifyOnProductsPage() {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.pageTitle).toHaveText('Products');
  }

  async addItemToCartByName(itemName: string) {
    const itemXpath = `//div[text()="${itemName}"]/ancestor::div[@class="inventory_item"]//button`;
    await this.page.locator(itemXpath).click();
  }

  async sortBy(optionValue: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getFirstItemPrice(): Promise<number> {
    const priceText = await this.itemPrices.first().textContent();
    return parseFloat(priceText?.replace('$', '') || '0');
  }

  async getAllItemPrices(): Promise<number[]> {
    const prices = await this.itemPrices.allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }
}