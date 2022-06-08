import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "../App";
// import Navbar from "../Components/Navbar/index";
import tasks from "../data/tasks.json";

describe("Testing routing Application", () => {
  beforeAll(() => {
    global.score = 0;
    console.log("Resetting Score to 0");
  });

  describe("App component should", () => {
    beforeEach(() => {
      render(<App />);
    });

    it("render App and check structure", async () => {
      expect(screen.getByTestId("task-app")).toBeInTheDocument();
      // Header
      expect(screen.getByTestId("task-header")).toBeInTheDocument();
      expect(screen.getByTestId("header-remaining-task")).toBeInTheDocument();
      expect(screen.getByTestId("header-total-task")).toBeInTheDocument();

      // tasks
      expect(screen.getByTestId("tasks")).toBeInTheDocument();
      screen.getAllByTestId("task").forEach((el) => {
        const innerScreen = within(el);
        expect(innerScreen.getByTestId("task-checkbox")).toBeInTheDocument();
        expect(innerScreen.getByTestId("task-text")).toBeInTheDocument();
        expect(
          innerScreen.getByTestId("task-counter-increment-button")
        ).toBeInTheDocument();
        expect(
          innerScreen.getByTestId("task-counter-value")
        ).toBeInTheDocument();
        expect(
          innerScreen.getByTestId("task-counter-decrement-button")
        ).toBeInTheDocument();
        expect(
          innerScreen.getByTestId("task-remove-button")
        ).toBeInTheDocument();
      });

      global.score += 2;
    });

    it("Check Data Rendering", async () => {
      expect(screen.getAllByTestId("task").length).toBe(tasks.length);

      let remaining = tasks.filter((t) => !t.done).length;
      expect(screen.getByTestId("header-remaining-task")).toHaveTextContent(
        remaining
      );
      expect(screen.getByTestId("header-total-task")).toHaveTextContent(
        tasks.length
      );

      tasks.forEach((task, index) => {
        expect(screen.getAllByTestId("task-text")[index]).toHaveTextContent(
          task.text
        );
        expect(
          screen.getAllByTestId("task-counter-value")[index]
        ).toHaveTextContent(task.count);
      });

      global.score += 2;
    });

    it("Check add task", () => {
      expect(screen.getAllByTestId("task").length).toBe(tasks.length);
      let input = screen.getByTestId("add-task-input");
      fireEvent.change(input, { target: { value: "run miles" } });
      fireEvent.click(screen.getByTestId("add-task-button"));

      expect(screen.getAllByTestId("task").length).toBe(tasks.length + 1);
      expect(
        screen.getAllByTestId("task-text")[tasks.length]
      ).toHaveTextContent("run miles");
      expect(
        screen.getAllByTestId("task-counter-value")[tasks.length]
      ).toHaveTextContent(1);

      global.score += 2;
    });

    it("Check add duplicate task", () => {
      expect(screen.getAllByTestId("task").length).toBe(tasks.length);
      let task0 = tasks[0];
      let input = screen.getByTestId("add-task-input");
      fireEvent.change(input, { target: { value: task0.text } });
      fireEvent.click(screen.getByTestId("add-task-button"));
      // length is still the same
      expect(screen.getAllByTestId("task").length).toBe(tasks.length);
      global.score += 1;
    });

    it("Check increment/decrement task count", function () {
      let task = screen.getAllByTestId("task")[3];
      const innerScreen = within(task);
      expect(innerScreen.getByTestId("task-counter-value")).toHaveTextContent(
        5
      );
      fireEvent.click(innerScreen.getByTestId("task-counter-increment-button"));
      fireEvent.click(innerScreen.getByTestId("task-counter-increment-button"));
      fireEvent.click(innerScreen.getByTestId("task-counter-increment-button"));
      expect(innerScreen.getByTestId("task-counter-value")).toHaveTextContent(
        8
      );
      fireEvent.click(innerScreen.getByTestId("task-counter-decrement-button"));
      fireEvent.click(innerScreen.getByTestId("task-counter-decrement-button"));

      expect(innerScreen.getByTestId("task-counter-value")).toHaveTextContent(
        6
      );
      global.score += 2;
    });

    it("Check remove task", () => {
      expect(screen.getAllByTestId("task").length).toBe(tasks.length);
      let task = screen.getAllByTestId("task")[4];
      const innerScreen = within(task);
      fireEvent.click(innerScreen.getByTestId("task-remove-button"));
      expect(screen.getAllByTestId("task").length).toBe(tasks.length - 1);
    });
  });

  afterAll(() => {
    console.log("Final Score is", global.score);
  });
});
