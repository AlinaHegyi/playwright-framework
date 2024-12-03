import { type Locator, type Page } from "@playwright/test";

export class ShoppingCart {

    readonly page: Page
    readonly heading: Locator
    readonly courses: Locator
    readonly coursesImages: Locator
    readonly coursesNames: Locator
    readonly schoolTags: Locator
    readonly coursesPrices: Locator
    readonly coursesDiscounts: Locator
    readonly addToCartButtons: Locator
    readonly cartHeading: Locator
    readonly itemsInCart: Locator
    readonly totalPrice: Locator
    readonly placeOrderButton: Locator
    readonly successMessage: Locator
  
    constructor(page: Page) {
      this.page = page
      this.heading = page.locator('.mt-2')
      this.courses = page.locator('[id^="course"]')
      this.coursesImages = page.locator('[id^="course"] img')
      this.coursesNames = page.locator('[id^="course"] h3')
      this.schoolTags = page.locator('[id^="course"] .my-3')
      this.coursesPrices = page.locator('[data-testid="full-price"] strong')
      this.coursesDiscounts = page.locator('[data-testid="discount"]')
      this.addToCartButtons = page.locator('[id^="course"] button')
      this.cartHeading = page.locator('.mb-2')
      this.itemsInCart = page.locator('.course-card-content')
      this.totalPrice = page.locator('#total-price')
      this.placeOrderButton = page.locator('.columns > div').last().locator('button')
      this.successMessage = page.locator('.is-success')
    }

    async goto() {
        await this.page.goto('https://www.techglobal-training.com/frontend/project-8');
    }
    async addToCart( num: number ) {
        await this.addToCartButtons.nth(num).click();
      }
}