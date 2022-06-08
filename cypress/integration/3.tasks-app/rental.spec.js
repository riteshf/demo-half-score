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
  const users = [{ link: "https://sparkly-daifuku-a97176.netlify.app" }];
  users.map((user) => {
    it("checking Basic Structure", { retries: 1 }, () => {
      //for 2 marks
      cy.visit(user.link);
      cy.get(".toggleForm").should("exist");
      cy.get(".rentalContainer")
        .should("exist")
        .children()
        .get(".sortingButtons")
        .should("exist")
        .get("button")
        .its("length")
        .should("be.gte", 4);
      cy.get(".rentalContainer>.searchAddress").should("exist");
      cy.get(".rentalContainer>.table").should("exist");

      cy.get(".toggleForm").click();
      cy.get(".addHouseContainer")
        .should("exist")
        .children()
        .get("form")
        .should("exist")
        .get("input")
        .its("length")
        .should("be.gte", 8);
      acc_score = generateScore(0, score, 2);
    });

    it("Check Add Details through form and submit", { retries: 1 }, () => {
      cy.visit(user.link);
      cy.get(".toggleForm").click();

      let data = [
        {
          name: "house1",
          ownerName: "Akhil",
          address: "Bangalore",
          areaCode: "650000",
          rent: "1000",
          bachelor: true,
          married: true,
          image:
            "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/streams/2013/March/130326/1C6639340-google-logo.jpg",
          id: 1,
        },
        {
          name: "house2",
          ownerName: "Krishna",
          address: "Patna",
          areaCode: "100000",
          rent: "1100",
          bachelor: true,
          married: true,
          image:
            "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/streams/2013/March/130326/1C6639340-google-logo.jpg",
          id: 2,
        },
        {
          name: "house3",
          ownerName: "Bicky",
          address: "Bangal",
          areaCode: "300000",
          rent: "900",
          bachelor: true,
          married: false,
          image:
            "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/streams/2013/March/130326/1C6639340-google-logo.jpg",
          id: 3,
        },
        {
          name: "house4",
          ownerName: "Sonam",
          address: "Bhilai",
          areaCode: "700000",
          rent: "1500",
          bachelor: false,
          married: true,
          image:
            "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/streams/2013/March/130326/1C6639340-google-logo.jpg",
          id: 4,
        },
        {
          name: "house5",
          ownerName: "Deevanshu",
          address: "Jaipur",
          areaCode: "600000",
          rent: "1500",
          bachelor: false,
          married: true,
          image:
            "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/streams/2013/March/130326/1C6639340-google-logo.jpg",
          id: 5,
        },
        {
          name: "fsdfsd",
          ownerName: "Ankit",
          address: "Delhi",
          areaCode: "500000",
          rent: "3000",
          bachelor: true,
          married: false,
          image:
            "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/streams/2013/March/130326/1C6639340-google-logo.jpg",
          id: 6,
        },
      ];

      data.forEach(async function (e) {
        cy.get(".name").type(e.name);
        cy.get(".ownerName").type(e.ownerName);
        cy.get(".address").type(e.address);
        cy.get(".areaCode").type(e.areaCode);
        cy.get(".rent").type(e.rent);
        e.bachelor && cy.get(".bachelor").click();
        e.married && cy.get(".married").click();
        cy.get(".image").type(e.image);

        cy.get(".name").should("have.value", e.name);
        cy.get(".ownerName").should("have.value", e.ownerName);

        cy.get(".submitBtn").click();

        cy.get(".name").clear();
        cy.get(".ownerName").clear();
        cy.get(".address").clear();
        cy.get(".areaCode").clear();
        cy.get(".rent").clear();
        e.bachelor && cy.get(".bachelor").click();
        e.married && cy.get(".married").click();
        cy.get(".image").clear();
        cy.wait(1000);
      });

      // if (cy.get(".image")) {
      //   acc_score = generateScore(acc_score, score, 2);
      // } else {
      //   acc_score = generateScore(acc_score, score, 1);
      // }
      acc_score = generateScore(acc_score, score, 2);
    });

    it("Check Data Rendering", { retries: 1 }, () => {
      cy.visit(user.link);
      cy.get(".houseDetails").its("length").should("be.gte", 6);
      cy.get(".ownersName")
        .should("exist")
        .first()
        .should("have.text", "Akhil");
      cy.get(".ownersName").should("exist").last().should("have.text", "Ankit");
      cy.get(".ownersName").eq(2).should("have.text", "Bicky");

      cy.get(".rent").its("length").should("be.gte", 6);
      cy.get(".address").its("length").should("be.gte", 6);
      cy.get(".areaCode").its("length").should("be.gte", 6);

      acc_score = generateScore(acc_score, score, 2);
    });

    it("Check Sorting by Rent", { retries: 1 }, () => {
      cy.visit(user.link);
      cy.get(".houseDetails").its("length").should("equal", 6);

      cy.get(".sortByRentAsc").click();

      cy.get(".rent").then((x) => {
        const temp = [];
        for (const el of x) {
          temp.push(Number(el.innerText));
        }
        let sorted = true;
        for (let x = 0; x < temp.length - 1; x++) {
          if (temp[x] > temp[x + 1]) {
            sorted = false;
            break;
          }
        }
        assert.isTrue(sorted);
      });

      cy.get(".sortByRentDesc").click();

      cy.get(".rent").then((x) => {
        const temp = [];
        for (const el of x) {
          temp.push(Number(el.innerText));
        }
        let sorted = true;
        for (let x = 0; x < temp.length - 1; x++) {
          if (temp[x] < temp[x + 1]) {
            sorted = false;
            break;
          }
        }
        assert.isTrue(sorted);
      });

      acc_score = generateScore(acc_score, score, 1.5);
    });

    it("Check Sorting by Area Code", { retries: 1 }, () => {
      cy.visit(user.link);
      cy.get(".houseDetails").its("length").should("equal", 6);

      cy.get(".sortByAreaAsc").click();

      cy.get(".areaCode").then((x) => {
        const temp = [];
        for (const el of x) {
          temp.push(Number(el.innerText));
        }
        let sorted = true;
        for (let x = 0; x < temp.length - 1; x++) {
          if (temp[x] > temp[x + 1]) {
            sorted = false;
            break;
          }
        }
        assert.isTrue(sorted);
      });

      cy.get(".sortByAreaDesc").click();

      cy.get(".areaCode").then((x) => {
        const temp = [];
        for (const el of x) {
          temp.push(Number(el.innerText));
        }
        let sorted = true;
        for (let x = 0; x < temp.length - 1; x++) {
          if (temp[x] < temp[x + 1]) {
            sorted = false;
            break;
          }
        }
        assert.isTrue(sorted);
      });

      acc_score = generateScore(acc_score, score, 1.5);
    });

    it("Check Search function", { retries: 1 }, function () {
      cy.visit(user.link);
      cy.get(".searchAddress").type("Bang");
      cy.wait(1000);

      cy.get(".houseDetails").its("length").should("be.eq", 2);
      cy.get(".ownersName")
        .should("exist")
        .first()
        .should("have.text", "Akhil");
      cy.get(".ownersName").should("exist").last().should("have.text", "Bicky");

      cy.get(".searchAddress").clear().type("Jaipur");
      cy.wait(1000);

      cy.get(".houseDetails").its("length").should("be.eq", 1);
      cy.get(".ownersName")
        .should("exist")
        .first()
        .should("have.text", "Deevanshu");

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
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      await fetch("http://localhost:2345/scores/", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      cy.wait(2000);
    });
  });
});
