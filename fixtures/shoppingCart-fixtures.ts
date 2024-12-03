import { test as base } from "@playwright/test";
import { ShoppingCart } from "../pages/ShoppingCart";

type MyFixtures = {
    shoppingCart: ShoppingCart
}

export const test = base.extend<MyFixtures>({


    shoppingCart: async({ page }, use) => {

      const shoppingCart = new ShoppingCart(page)
      await shoppingCart.goto()
      await use(shoppingCart)

    }
    
   
  })
  
  export { expect } from '@playwright/test';




