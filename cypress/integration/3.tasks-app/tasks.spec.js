import tasks from "../../../src/data/tasks.json";

function generateScore(a, s, weight) {
  const attempt = cy.state("runnable")._currentRetry;
  s = attempt === 1 ? -weight : weight;
  a += s;
  a = a < 0 ? 0 : a;
  return a;
}

describe("Test", function () {
  let acc_score = 0;
  let score = 0;
  const users = [
    { link: "https://rct-101-e1.herokuapp.com/", userId: "rct-101.e1" },
    // { link: "http://localhost:3000/", userId: "ritesh-local" },
  ];
  users.map((user) => {
    it("checking Basic Structure", { retries: 1 }, () => {
      //for 2 marks

      // navbar check
      cy.visit(user.link);
      let taskApp = cy.get("[data-cy=task-app]");
      taskApp.should("exist");

      // Header
      let taskHeader = taskApp.get("[data-cy=task-header]");
      taskHeader.should("exist");
      taskHeader.get("[data-cy=header-remaining-task]").should("exist");
      taskHeader.get("[data-cy=header-total-task]").should("exist");

      // tasks
      let tasks = taskApp.get("[data-cy=tasks]");
      tasks.should("exist");

      let task = tasks.get("[data-cy=task]");
      task.should("exist");

      task.get("[data-cy=task-checkbox]").should("exist");
      task.get("[data-cy=task-text]").should("exist");
      task.get("[data-cy=task-counter-increment-button]").should("exist");
      task.get("[data-cy=task-counter-value]").should("exist");
      task.get("[data-cy=task-counter-decrement-button]").should("exist");
      task.get("[data-cy=task-remove-button]").should("exist");

      acc_score = generateScore(0, score, 2);
    });

    it("Check Data Rendering", { retries: 1 }, () => {
      cy.visit(user.link);
      let remaining = tasks.filter((t) => !t.done).length;
      cy.get("[data-cy=header-remaining-task]").should("have.text", remaining);
      cy.get("[data-cy=header-total-task]").should("have.text", tasks.length);

      cy.get("[data-cy=task]").should("have.length", 5);

      tasks.map((task, index) => {
        cy.get("[data-cy=task-text]").eq(index).should("have.text", task.text);
        cy.get("[data-cy=task-counter-value]")
          .eq(index)
          .should("have.text", task.count);
      });

      acc_score = generateScore(acc_score, score, 2);
    });

    it("Check add task", { retries: 1 }, () => {
      cy.visit(user.link);

      cy.get("[data-cy=add-task-input]")
        .type("run miles")
        .then(() => {
          cy.get("[data-cy=add-task-button]").click();
        });

      cy.get("[data-cy=task]").should("have.length", 6);
      cy.get("[data-cy=task-text]").eq(5).should("have.text", "run miles");
      cy.get("[data-cy=task-counter-value]").eq(5).should("have.text", 1);
      acc_score = generateScore(acc_score, score, 2);
    });

    it("Check add duplicate task", { retries: 1 }, () => {
      cy.visit(user.link);

      let task0 = tasks[0];
      cy.get("[data-cy=add-task-input]")
        .type(task0.text)
        .then(() => {
          cy.get("[data-cy=add-task-button]").click();
        });

      cy.get("[data-cy=task]").should("have.length", 5);
      acc_score = generateScore(acc_score, score, 1);
    });

    it("Check increment/decrement task count", { retries: 1 }, function () {
      cy.visit(user.link);

      cy.get("[data-cy=task-counter-value]").eq(3).should("have.text", 5);
      cy.get("[data-cy=task-counter-increment-button]")
        .eq(3)
        .click()
        .click()
        .click();
      cy.get("[data-cy=task-counter-value]").eq(3).should("have.text", 8);

      cy.get("[data-cy=task-counter-decrement-button]").eq(3).click().click();
      cy.get("[data-cy=task-counter-value]").eq(3).should("have.text", 6);
      acc_score = generateScore(acc_score, score, 2);
    });

    it("Check remove task", { retries: 1 }, () => {
      cy.visit(user.link);
      cy.get("[data-cy=task]").should("have.length", 5);
      cy.get("[data-cy=task-remove-button ]").eq(4).click();
      cy.get("[data-cy=task]").should("have.length", 4);
      acc_score = generateScore(acc_score, score, 1);
    });

    it(`${user.link} Generate score`, async () => {
      acc_score = acc_score === 0 ? 1 : acc_score;
      acc_score = acc_score === 10 ? 9 : acc_score;
      console.log(`${user.link} final score: `, acc_score);

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        ...user,
        score: user.link.trim().length != 0 ? acc_score : 0,
        time: new Date(),
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      await fetch("http://localhost:2445/scores/", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      cy.wait(2000);
    });
  });
});
