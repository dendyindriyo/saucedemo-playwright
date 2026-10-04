import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstNameInput = this.page.locator('#first-name');
  readonly lastNameInput = this.page.locator('#last-name');
  readonly postalCodeInput = this.page.locator('#postal-code');
  readonly continueButton = this.page.locator('#continue');
  
  readonly itemTotalLabel = this.page.locator('.summary_subtotal_label');
  readonly taxLabel = this.page.locator('.summary_tax_label');
  readonly totalLabel = this.page.locator('.summary_total_label');
  readonly finishButton = this.page.locator('#finish');
  readonly completeHeader = this.page.locator('.complete-header');

  constructor(page: Page) {
    super(page);
  }

  async fillCustomerInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async verifyAndAssertTotals() {
    const subtotalText = await this.itemTotalLabel.textContent();
    const taxText = await this.taxLabel.textContent();
    const totalText = await this.totalLabel.textContent();

    const itemTotal = parseFloat(subtotalText?.replace(/[^0-9.]/g, '') || '0');
    const tax = parseFloat(taxText?.replace(/[^0-9.]/g, '') || '0');
    const displayedTotal = parseFloat(totalText?.replace(/[^0-9.]/g, '') || '0');

    const calculatedTotal = Number((itemTotal + tax).toFixed(2));
    expect(calculatedTotal).toBe(displayedTotal);
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async verifyOrderSuccess() {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
  }
}