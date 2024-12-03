import { test, expect } from "@playwright/test";
import { clickButton, typeText } from "../helpers/click_and_fill_helpers";

test.use({
  launchOptions: {
    slowMo: 3000,
  },
});

test.describe("random test", () => {
  let url = "https://techglobal-training.com/frontend";
  const modalTitleSelector = 'nav:has-text("My Tasks")';
  const todoInputSelector = "#input-add";
  const addButtonSelector = "#add-btn";
  const searchFieldSelector = "#search";
  const taskListMessageSelector = 'div[class$="danger"]';
  const taskListSelector = "#panel .panel-block div";
  const deleteButtonSelector = '[class*="has-text-danger"]';
  const removeCompletedTaskButtonSelector = "button#clear";
  const task = "homework";

  test.beforeEach(async ({ page }) => {
    await test.step("01. Navigate to the URL", async () => {
      await page.goto(url);

      await page.getByRole("link", { name: "Todo List" }).click();
    });
  });

  test("Case 01 - Todo-app Modal Verification", async ({ page }) => {
    const modalTitle = page.locator(modalTitleSelector);
    const todoInput = page.locator(todoInputSelector);
    const addButton = page.locator(addButtonSelector);
    const searchField = page.locator(searchFieldSelector);
    const taskListMessage = page.locator(taskListMessageSelector);

    await test.step("2.Verify modal title is visible", async () => {
      await expect(modalTitle).toBeVisible();
    });

    await test.step("3.Validate New todo input field is enabled", async () => {
      await expect(todoInput).toBeEditable();
    });

    await test.step("4.Validate ADD button is enabled", async () => {
      await expect(addButton).toBeEnabled();
    });

    await test.step("5.Validate Search field is enabled", async () => {
      await expect(searchField).toBeEditable();
    });

    await test.step("6.Validate task list is empty", async () => {
      await expect(taskListMessage).toBeVisible();
    });
  });

  test("Case 02 - Single Task Addition and Removal", async ({ page }) => {
    const todoInput = page.locator("#input-add");
    const addButton = page.locator(addButtonSelector);
    const newTask = page.locator("#panel .panel-block span").first();
    const deleteButton = page.locator(deleteButtonSelector);
    const tasks = page.locator("#panel .panel-block div");

    await test.step("2.Enter new task in todo input and add to list", async () => {
      await typeText(page, "New todo", "homework");
      await addButton.click();
    });

    await test.step("3.Validate new task appears in the list", async () => {
      await expect(tasks).toHaveText("homework");
    });

    await test.step("4.Validate that the number of tasks in the list is exactly one", async () => {
      await expect(tasks).toHaveCount(1);
    });

    await test.step("5.Mark the task as completed by clicking on it", async () => {
      await newTask.click();
    });

    await test.step("6.Validate item is marked as completed.", async () => {
      await expect(newTask).toHaveClass(/has-text-success/);
    });

    await test.step("7.Click on the button to remove the item you have added.", async () => {
      deleteButton.click();
    });

    // await test.step("8.Remove the completed task by clicking the designated removal button.", async () => {
    // //   const removeCompletedTaskButton = page.locator(
    // //     removeCompletedTaskButtonSelector
    // //   );
    //
    // });

    await test.step("9.Validate that the task list is empty, displaying the message “No tasks found!”.", async () => {
      await expect(tasks).toHaveCount(0);
      await expect(page.getByText("No tasks found!")).toBeVisible();
    });
  });

  test(" Case 03 - Multiple Task Operations", async ({ page }) => {
    const tasks = page.locator("#panel .panel-block div");
    const myTasks = ["task1", "task2", "task3", "task4", "task5"];
    const addButton = page.locator(addButtonSelector);
    const message = page.locator(".has-text-danger");

    await test.step("2.Enter and add 5 to-do items individually", async () => {
      for (const task of myTasks) {
        await typeText(page, "New todo", task);
        await clickButton(page, "ADD");
      }
    });

    await test.step("3.Validate that all added items match the items displayed on the list.", async () => {
      const tasksArray = await tasks.all();

      for (let i = 0; i < tasksArray.length; i++) {
        await expect(tasksArray[i]).toHaveText(myTasks[i]);
      }
    });

    await test.step("4.Mark all the tasks as completed by clicking on them.", async () => {
      const tasksArray = await tasks.all();
      for (const task of tasksArray) {
        await task.click();
      }
    });

    await test.step("5.Click on the “Remove completed tasks!” button to clear them.", async () => {
      await page.click(removeCompletedTaskButtonSelector);
    });

    await test.step("6.Validate that the task list is empty, displaying the message “No tasks found!”.", async () => {
      await expect(page.getByText("No tasks found!")).toBeVisible();
    });
  });

  test(" Case 04 - Search and Filter Functionality in Todo App", async ({
    page,
  }) => {
    const myTasks = ["task1", "task2", "task3", "task4", "task5"];
    const tasks = page.locator("#panel .panel-block div");

    await test.step("2.Enter and add 5 to-do items individually.", async () => {
      for (const task of myTasks) {
        await typeText(page, "New todo", task);
        await clickButton(page, "ADD");
      }
    });

    await test.step("3.Validate that all added items match the items displayed on the list.", async () => {
      for (const task of myTasks) {
        const taskLocator = page.getByText(task);
        await expect(taskLocator).toBeVisible();
      }
    });

    await test.step("4. Enter the complete name of the previously added to-do item into the search bar", async () => {
      await typeText(page, "Type to search", myTasks[0]);
    });

    await test.step("5. Validate that the list is now filtered to show only the item you searched for", async () => {
      await expect(tasks).toHaveText(myTasks[0]);
    });

    await test.step("6. Validate that the number of tasks visible in the list is exactly one", async () => {
      await expect(tasks).toHaveCount(1);
    });
  });

  test("Test Case 05 - Task Validation and Error Handling", async ({
    page,
  }) => {
    const invalidTask = "This task is to long to be completed";
    const validTask = "Study";
    const taskListMessage = page.locator(taskListMessageSelector);
    const tasks = page.locator("#panel .panel-block div");
    const errorMessage = page.locator(".is-danger");
    const addButton = page.locator(addButtonSelector);
    await test.step("2. Attempt to add an empty task to the to-do list", async () => {
      await addButton.click();
    });

    await test.step('3. Validate that the task list is empty, displaying the message "No task found!"', async () => {
      await expect(tasks).toHaveCount(0);
      await expect(taskListMessage).toHaveText("No tasks found!");
    });

    await test.step("4. Enter an item name exceeding 30 characters into the list", async () => {
      await typeText(page, "New todo", invalidTask);
      await addButton.click();
    });

    await test.step('5. Validate error message appears and says "Error: Todo cannot be more than 30 characters!"', async () => {
      expect(errorMessage).toHaveText(
        "Error: Todo cannot be more than 30 characters!",
      );
    });

    await test.step("6. Add a valid item name to the list", async () => {
      await typeText(page, "New todo", validTask);
      clickButton(page, "ADD");
    });

    await test.step("7. Validate that the active task count is exactly one", async () => {
      await expect(tasks).toHaveCount(1);
    });

    await test.step("8. Try to enter an item with the same name already present on the list", async () => {
      await typeText(page, "New todo", validTask);
      await addButton.click();
    });

    await test.step('9. Validate that an error message is displayed, indicating "Error: You already have {ITEM} in your todo list."', async () => {
      expect(errorMessage).toHaveText(
        `Error: You already have ${validTask} in your todo list.`,
      );
    });
  });
});
