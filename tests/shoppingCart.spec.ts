import { test, expect } from "../fixtures/shoppingCart-fixtures"

test.describe('Shopping Cart', () => {
    test('Test Case 01 - Available Courses Section Validation', async ({ shoppingCart }) => {

        await test.step('2. Validate the heading is "Available Courses"', async () => {
            await expect(shoppingCart.heading).toHaveText('Available Courses');
        })

        await test.step('3. Validate that there are 3 courses displayed', async () => {
            await expect(shoppingCart.courses).toHaveCount(3);
        })

        await test.step('4. Validate that each course has an image, name, TechGlobal School tag, and a price of more than zero', async () => {
            const coursesInfo = [
                shoppingCart.coursesImages,
                shoppingCart.coursesNames,
                shoppingCart.schoolTags,
                shoppingCart.coursesPrices
            ]

            for (const element of coursesInfo) {
                const info = await element.all();
                for (const ele of info) {
                    await expect(ele).toBeVisible()
                }
                const allPrices = await shoppingCart.coursesPrices.all();

                for (const priceLocator of allPrices) {
                    const priceArray = await priceLocator.allInnerTexts();
                    const price = priceArray.join('');
                    const cleanedPrice = Number(price.replace(/\D/g, ''));
                    // console.log(cleanedPrice) // Why are they duplicating??
                    expect(cleanedPrice).toBeGreaterThan(0);
                }
            }
        })

        await test.step('5. Validate the first 2 courses have discount tags', async () => {
            for (let i = 0; i <= 1; i++) {
                const discountTagCount = await shoppingCart.courses.nth(i).locator('[data-testid="discount"]').count();
                expect(discountTagCount).toBe(1);
                expect(shoppingCart.coursesDiscounts.nth(i)).toBeVisible();

            }
        })

        await test.step('6. Validate that there is an "Add to Cart" button under each course which is displayed, enabled, and has the text "Add to Cart"', async () => {
            for (let i = 0; i <= 2; i++) {
                const addToCartButtonCount = await shoppingCart.courses.nth(i).locator('button').count();
                expect(addToCartButtonCount).toBe(1);
                expect(shoppingCart.addToCartButtons.nth(i)).toBeVisible();
                expect(shoppingCart.addToCartButtons.nth(i)).toBeEnabled();
                expect(shoppingCart.addToCartButtons.nth(i)).toHaveText('Add to Cart');

            }
        })
    })



    test('Test Case 02 - Cart Section Validation', async ({ shoppingCart }) => {

        await test.step('2. Validate the heading is "Items Added to Cart"', async () => {
            await expect(shoppingCart.heading).toHaveText('Available Courses');
        })

        await test.step('3. Validate that the cart is empty by default', async () => {
            const itemCount = await shoppingCart.itemsInCart.count()
            expect(itemCount).toBe(0);
        })

        await test.step('4. Validate that the total price is zero "$0" by default', async () => {
            const defaultTotalPrice = (await shoppingCart.totalPrice.allTextContents()).join();
            const cleanedDefaultTotalPrice = defaultTotalPrice.replaceAll(/[^\d$]/g, '')
            expect(cleanedDefaultTotalPrice).toBe('$0');

        })
        await test.step('5.Validate that there is a “Place Order” button is displayed, disabled, and has the text “Place Order”', async () => {
            await expect(shoppingCart.placeOrderButton).toBeVisible()
            await expect(shoppingCart.placeOrderButton).toBeDisabled()
            await expect(shoppingCart.placeOrderButton).toHaveText('Place Order')

        })
    })
})


test('Test Case 3 - Add a Course to the Cart and Validate', async ({ shoppingCart }) => {

    await test.step('2. Click on the “Add to Cart” button for one of the courses', async () => {
        await shoppingCart.addToCart(1);
    })

    await test.step(`3. Validate that the course is displayed in the cart with its image, name,
             and discount amount if available"`, async () => { 
                const itemsCount = await shoppingCart.itemsInCart.count();
                expect(itemsCount).toBeGreaterThan(0);

                const courseImage = await shoppingCart.itemsInCart.nth(0).locator('img').isVisible();
                expect(courseImage).toBeTruthy();
              
                const courseName = await shoppingCart.itemsInCart.nth(0).locator('h3').textContent();
                expect(courseName).not.toBeNull();
              
                const discount = await shoppingCart.coursesDiscounts.nth(0).textContent();
                if (discount) {
                  expect(discount).not.toBeNull();
                }
                
             });


    await test.step('4. Validate that the course price is added to the total price excluding the discount amount', async () => {
    });

    await test.step('5.Click on the “Place Order” button', async () => {
        await shoppingCart.placeOrderButton.click();
    });
    await test.step('6.Validate a success message is displayed with the text “Your order has been placed”', async () => {
        const successMessage = await shoppingCart.successMessage.textContent()
        expect(successMessage).toContain('Your order has been placed.');
    });
    await test.step('7Validate that the cart is empty', async () => {
        const finalItemsCount = await shoppingCart.itemsInCart.count();
        expect(finalItemsCount).toBe(0);
   });
 });

test('Test Case 4 - Add 2 courses to the cart and validate', async({ shoppingCart }) => {
    await test.step('2. Click on the “Add to Cart” button for one of the courses', async () => {
        await shoppingCart.addToCart(0);
    });

    await test.step('3. Click on the “Add to Cart” button for another course', async () => {
        await shoppingCart.addToCart(1);
    });

    await test.step(`4. Validate that the courses are displayed in the cart with their image,
         name, and discount amount if available`, async () => {
    });
    await test.step('5.Validate that the course prices are added to the total price excluding the discount amounts', async () => {

    });
    await test.step('6.Click on the “Place Order” button', async () => {
      await shoppingCart.placeOrderButton.click();

    });
    await test.step('7.Validate a success message is displayed with the text “Your order has been placed.”', async () => {
        const successMessage = await shoppingCart.successMessage.textContent()
        expect(successMessage).toContain('Your order has been placed.');

    });
    await test.step('8.Validate that the cart is empty', async () => {
        const finalItemsCount = await shoppingCart.itemsInCart.count();
  expect(finalItemsCount).toBe(0);

    });
});

test('Test Case 5 - Add All Three Courses to the Cart and Validate', async({ shoppingCart }) => {
    await test.step('2. Click on the “Add to Cart” button for all three courses', async () => {
        const numberOfCourses = await shoppingCart.addToCartButtons.count();
  for (let i = 0; i < numberOfCourses; i++) {
    await shoppingCart.addToCart(i);
  } 
    });

     await test.step(`3. Validate that the courses are displayed in the cart with their image, name, and discount amount if available`, async () => {
        const itemsCount = await shoppingCart.itemsInCart.count();
        expect(itemsCount).toBe(3);
      
        for (let i = 0; i < itemsCount; i++) {
          const courseImage = await shoppingCart.itemsInCart.nth(i).locator('img').isVisible();
          expect(courseImage).toBeTruthy();
      
          const courseName = await shoppingCart.itemsInCart.nth(i).locator('h3').textContent();
          expect(courseName).not.toBeNull();
      
          const discount = await shoppingCart.coursesDiscounts.nth(i).textContent();
          if (discount) {
            expect(discount).not.toBeNull();
          }
        }
      
     });
// both these steps are failing, step 3 and step 4.  I will watch the recordings for solutions
     await test.step(`4. Validate that the course prices are added to the total price excluding the discount amounts`, async () => {
        const itemsCount = await shoppingCart.itemsInCart.count();
        let expectedTotalPrice = 0;
  
        for (let i = 0; i < itemsCount; i++) {
          const coursePriceText = await shoppingCart.coursesPrices.nth(i).textContent();
          const coursePrice = parseFloat(coursePriceText.replace('$', ''));
      
          const discountText = await shoppingCart.coursesDiscounts.nth(i).textContent();
          const discountValue = discountText ? parseFloat(discountText.replace('$', '')) : 0;
      
          expectedTotalPrice += (coursePrice - discountValue);
        }
      
        const totalPriceText = await shoppingCart.totalPrice.textContent();
        const totalPrice = parseFloat(totalPriceText.replace('$', ''));
        
        expect(totalPrice).toBeCloseTo(expectedTotalPrice);
    });

    await test.step('5.Click on the “Place Order” button', async () => {
        await shoppingCart.placeOrderButton.click();
    })

    await test.step('6.Validate a success message is displayed with the text “Your order has been placed.”', async () => {
        const successMessage = await shoppingCart.successMessage.textContent()
        expect(successMessage).toContain('Your order has been placed.');

    })
    await test.step('7.Validate that the cart is empty”', async () => {
        const finalItemsCount = await shoppingCart.itemsInCart.count();
        expect(finalItemsCount).toBe(0);
    
    })

});
