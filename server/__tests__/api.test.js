const request = require("supertest");
const app = require("../app.js");
const db = require("../config/db/testDb");
const jwt_decode = require("jwt-decode");
const { faker } = require('@faker-js/faker');

beforeAll(async () => await db.connect());
afterAll(async () => await db.close());

let testApp = request(app);

let accessToken = "";
let admin = {};
let user = {};
let mentor = {};
let assessment = {};
let studentAccessToken = "";
let mentorAccessToken = "";
let refreshToken = "";
let assessmentSubmission = {};

/*
 * @Description: Test cases regarding registration and login
 */
describe("Auth Route", () => {
  // Register
  describe("Registration:/api/v1/auth/registration", () => {
    it("Should return 201", async () => {
      const res = await testApp.post("/api/v1/auth/registration").send({
        name: "Admin User",
        email: "admin@mail.com",
        phoneNumber: "01834123456",
        password: "admin123456",
        confirmPassword: "admin123456",
        role: "admin",
      });

      expect(res.status).toBe(201);
      expect(res.body.data).toBeDefined();
      admin = jwt_decode(res.body.data.accessToken);
    });

    it("Should return 201", async () => {
      const res = await testApp.post("/api/v1/auth/registration").send({
        name: "John Doe",
        email: "johnDoe@mail.com",
        phoneNumber: "01712123456",
        password: "user123456",
        confirmPassword: "user123456",
        role: "student",
      });

      expect(res.status).toBe(201);
      expect(res.body.data).toBeDefined();
      user = jwt_decode(res.body.data.accessToken);
      studentAccessToken = res.body.data.accessToken;
    });

    it("Should return 201", async () => {
      const res = await testApp.post("/api/v1/auth/registration").send({
        name: "John Smith",
        email: "johnSmith@mail.com",
        phoneNumber: "01712147852",
        password: "user123456",
        confirmPassword: "user123456",
        role: "mentor",
      });

      expect(res.status).toBe(201);
      expect(res.body.data).toBeDefined();
      mentor = jwt_decode(res.body.data.accessToken);
      mentorAccessToken = res.body.data.accessToken;
    });

  });

  describe("Login:/api/v1/auth/login", () => {
    it("Should return 200 for successful login", async () => {
      const res = await testApp.post("/api/v1/auth/login").send({
        email: "admin@mail.com",
        password: "admin123456",
      });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      accessToken = res.body.data.accessToken;
    });

    it("Should return 422 if email or password field is empty", async () => {
      const res = await testApp.post("/api/v1/auth/login").send({
        email: "admin@mail.com",
        password: "",
      });

      expect(res.status).toBe(422);
    });

    it("Should return 404 if login is failed", async () => {
      const res = await testApp.post("/api/v1/auth/login").send({
        email: "admin@mail.com",
        password: "admin1234556",
      });

      expect(res.status).toBe(404);
    });

  });
});

/*
 * @Description: Test cases regarding users
 */
describe("Users route", () => {
  /*
   * @Description: Get all users list
   */
  describe("Get all users:/api/v1/users", () => {

    it("Should return 200 if the login user is admin", async () => {
      const res = await testApp
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("Should return 403 if the login user is not admin", async () => {
      const res = await testApp
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${studentAccessToken}`);
      expect(res.status).toBe(403);
    });
  });

  /*
   * @Description: Get a user's details
   */
  describe("Get a user's details:/api/v1/users/:id", () => {

    it("Should return 200 if the user is admin", async () => {
      const res = await testApp.get(`/api/v1/users/${user._id}`).set("Authorization", `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    })

    it("Should return 200 if the user is student and the id is the same as his/her id", async () => {
      const res = await testApp.get(`/api/v1/users/${user._id}`).set("Authorization", `Bearer ${studentAccessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    })

    it("Should return 200 if the user is mentor and the id is the same as his/her id", async () => {
      const res = await testApp.get(`/api/v1/users/${mentor._id}`).set("Authorization", `Bearer ${mentorAccessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    })

    it("Should return 403 if the user is mentor/student and the id is not the same as his/her id", async () => {
      const res = await testApp.get(`/api/v1/users/${user._id}`).set("Authorization", `Bearer ${mentorAccessToken}`);
      expect(res.status).toBe(403);
    });

  })

  /*
   * @Description: Update a user details
   */
  describe(`Update a user's details:/api/v1/users/:id`, () => {

    it("Should return 200 if the user is admin", async () => {
      const res = await testApp
        .put(`/api/v1/users/${user._id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect("Content-Type", /json/)
        .send({
          name: "John Doe",
          email: "johnDoe@mail.com",
          phoneNumber: "01712123456",
          password: "user123456",
          confirmPassword: "user123456",
          role: "student",
        });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("Should return 403 if the user is not admin", async () => {
      const res = await testApp
        .put(`/api/v1/users/${user._id}`)
        .set("Authorization", `Bearer ${studentAccessToken}`)
        .expect("Content-Type", /json/)
        .send({
          name: "John Doe",
          email: "johnDoe@mail.com",
          phoneNumber: "01712123456",
          password: "user123456",
          confirmPassword: "user123456",
          role: "student",
        });
      expect(res.status).toBe(403);
    });
  });

  /*
  * @Description: Delete a user
  */
  describe(`Delete a user:/api/v1/users/:id`, () => {

    it("Should return 200 if the user is admin", async () => {
      const res = await testApp
        .delete(`/api/v1/users/${user._id}`)
        .set("Authorization", `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("Should return 403 if the user is not admin", async () => {
      const res = await testApp
        .delete(`/api/v1/users/${user._id}`)
        .set("Authorization", `Bearer ${studentAccessToken}`);
      expect(res.status).toBe(403);
    });
  });
});


/*
* @Description: Tests regarding assessments
*/
describe("Assessments route", () => {

  /*
  * * @Description: Create an assessment
  */
  describe("Create an assessment:/api/v1/assessments", () => {
    it("Should return 201 if the user is admin", async () => {
      const res = await testApp.post("/api/v1/assessments").set("Authorization", `Bearer ${accessToken}`).send({
        title: faker.name.jobTitle(),
        description: faker.lorem.paragraph(),
        mentor: mentor._id,
        deadline: faker.date.future(),
      })
      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      assessment = res.body.data;
    })

    it("Should return 403 if the user is not admin", async () => {
      const res = await testApp.post("/api/v1/assessments").set("Authorization", `Bearer ${mentorAccessToken}`).send({
        title: faker.name.jobTitle(),
        description: faker.lorem.paragraph(),
        mentor: mentor._id,
        deadline: faker.date.future(),
      })
      expect(res.status).toBe(403);
    })
  });

  /*
  * * @Description: Update an assessment 
  */
  describe(`Update an assessment:/api/v1/assessments/:id`, () => {

    it("Should return 200 status code if the user is admin", async () => {
      const res = await testApp.put(`/api/v1/assessments/${assessment._id}`).set("Authorization", `Bearer ${accessToken}`).send({
        title: faker.name.jobTitle(),
        description: faker.lorem.paragraph(),
        mentor: mentor._id,
        deadline: faker.date.future(),
      });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("Should return 403 status code if the user is not admin", async () => {
      const res = await testApp.put(`/api/v1/assessments/${assessment._id}`).set("Authorization", `Bearer ${mentorAccessToken}`).send({
        title: faker.name.jobTitle(),
        description: faker.lorem.paragraph(),
        mentor: mentor._id,
        deadline: faker.date.future(),
      });

      expect(res.status).toBe(403);
    })

    it("Should return 404 status code if the assessment is not found", async () => {
      const res = await testApp.put(`/api/v1/assessments/626e6d71026f769919bbdab2`).set("Authorization", `Bearer ${accessToken}`).send({
        title: faker.name.jobTitle(),
        description: faker.lorem.paragraph(),
        mentor: mentor._id,
        deadline: faker.date.future(),
      });
      expect(res.status).toBe(404);
    })

    it("Should return 422 status code if the assessment id or mentor id is not a valid id", async () => {
      const res = await testApp.put(`/api/v1/assessments/626e6d71026f769919bbdab21`).set("Authorization", `Bearer ${accessToken}`).send({
        title: faker.name.jobTitle(),
        description: faker.lorem.paragraph(),
        mentor: mentor._id + 234,
        deadline: faker.date.future(),
      });
      expect(res.status).toBe(422);
    });
  })

  /*
  * * @Description: Get all assessments
  */
  describe("Get all assessments:/api/v1/assessments", () => {

    it("Should return 200 status code if the assessment is valid", async () => {
      const res = await testApp.get("/api/v1/assessments").set("Authorization", `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    })

    it("Should return 401 status code the header is not containing authorization token", async () => {
      const res = await testApp.get("/api/v1/assessments");
      expect(res.status).toBe(401);
    });
  })

  /*
  * * @Description: Get an assessment's details
  */
  describe("Get all assessments:/api/v1/assessments/:id", () => {

    it("Should return 200 status code if the assessment is valid", async () => {
      const res = await testApp.get(`/api/v1/assessments/${assessment._id}`).set("Authorization", `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    })

    it("Should return 400 status code if the assessment id is not valid", async () => {
      const res = await testApp.get(`/api/v1/assessments/626e6d71026f769919bbdab3s`).set("Authorization", `Bearer ${accessToken}`);
      expect(res.status).toBe(400);
    })

    it("Should return 404 status code if the assessment id is not found", async () => {
      const res = await testApp.get(`/api/v1/assessments/626e6d71026f769919bbdab3`).set("Authorization", `Bearer ${accessToken}`);
      expect(res.status).toBe(404);
    })

  })

  /*
  * * @Description: Delete an assessment
  */
  describe("Delete an assessment:/api/v1/assessment/:id", () => {
    it("Should return 200 status code if the user is admin", async () => {
      const res = await testApp.delete(`/api/v1/assessments/${assessment._id}`).set("Authorization", `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    })

    it("Should return 403 status code if the user is admin", async () => {
      const res = await testApp.delete(`/api/v1/assessments/${assessment._id}`).set("Authorization", `Bearer ${mentorAccessToken}`);
      expect(res.status).toBe(403);
    })

    it("Should return 404 status code if the assessment is not found", async () => {
      const res = await testApp.delete(`/api/v1/assessments/${assessment._id}`).set("Authorization", `Bearer ${accessToken}`);
      expect(res.status).toBe(404);
    })

    assessment = {};

  })
})

/*
* @Description: Tests regarding submissions
*/
describe("Submission route", () => {

  /* 
  * @Description: Create an assessment
  */
  describe("Create an assessment:/api/v1/assessments", () => {
    it("Should return 201 if the user is admin", async () => {
      const res = await testApp.post("/api/v1/assessments").set("Authorization", `Bearer ${accessToken}`).send({
        title: faker.name.jobTitle(),
        description: faker.lorem.paragraph(),
        mentor: mentor._id,
        deadline: faker.date.future(),
      })
      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      assessment = res.body.data;
    })
  });


  /*
  * @Description: Make submission for an assessment
  */
  describe("Make submission:/api/v1/assessments/:id/submissions", () => {

    it("Should return 201 status code if the user is student", async () => {
      const res = await testApp.post(`/api/v1/assessments/${assessment._id}/submission`).set("Authorization", `Bearer ${studentAccessToken}`).send({
        link: 'https://www.google.com',
      })
      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      assessmentSubmission = res.body.data;
    })


    it("Should return 201 status code if the user is admin", async () => {
      const res = await testApp.post(`/api/v1/assessments/${assessment._id}/submission`).set("Authorization", `Bearer ${accessToken}`).send({
        link: 'https://www.google.com',
      })
      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      assessmentSubmission = res.body.data;
    })

    it("Should return 201 status code if the user is not admin or student", async () => {
      const res = await testApp.post(`/api/v1/assessments/${assessment._id}/submission`).set("Authorization", `Bearer ${mentorAccessToken}`).send({
        link: 'https://www.google.com',
      })
      expect(res.status).toBe(403);
    })

  })

  /*
  * @Description: Update submission for an assessment
  */
  describe("Update submission:/api/v1/assessments/:id/submission/:submissionId", () => {

    it("Should return 200 status code if the user is admin", async () => {
      const res = await testApp.put(`/api/v1/assessments/${assessment._id}/submission/${assessmentSubmission._id}`).set("Authorization", `Bearer ${accessToken}`).send({
        link: 'https://www.google.com',
      })
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    })

    it("Should return 403 status code if the user is not admin", async () => {
      const res = await testApp.put(`/api/v1/assessments/${assessment._id}/submission/${assessmentSubmission._id}`).set("Authorization", `Bearer ${studentAccessToken}`).send({
        link: 'https://www.google.com',

      })
      expect(res.status).toBe(403);
    })

    it("Should return 404 if the submission is not found", async () => {
      const res = await testApp.put(`/api/v1/assessments/${assessment._id}/submission/${assessment._id}`).set("Authorization", `Bearer ${accessToken}`).send({
        link: 'https://www.google.com',
      })
      expect(res.status).toBe(404);
    })

    it("Should return 400 if the submission id or assessment id is not valid", async () => {
      const res = await testApp.put(`/api/v1/assessments/${assessment._id + 1}/submission/${assessmentSubmission._id + 1}`).set("Authorization", `Bearer ${accessToken}`).send({
        link: 'https://www.google.com',
      })
      expect(res.status).toBe(400);
    })

  })

  /*
  * @Description: Add grade to submission for an assessment
  */
  describe("Add grade to submission:/api/v1/assessment/:id/submission/:submissionId/grade", () => {

    it("Should return 200 status code if the user is admin", async () => {
      const res = await testApp.put(`/api/v1/assessments/${assessment._id}/submission/${assessmentSubmission._id}/grade`).set("Authorization", `Bearer ${accessToken}`).send({ "mark": 80, "remark": "Good" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");

    })

    it("Should return 200 status code if the user is mentor", async () => {
      const res = await testApp.put(`/api/v1/assessments/${assessment._id}/submission/${assessmentSubmission._id}/grade`).set("Authorization", `Bearer ${mentorAccessToken}`).send({ "mark": 80, "remark": "Good" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");

    })

    it("Should return 403 status code if the user is not mentor and admin", async () => {
      const res = await testApp.put(`/api/v1/assessments/${assessment._id}/submission/${assessmentSubmission._id}/grade`).set("Authorization", `Bearer ${studentAccessToken}`).send({ "mark": 80, "remark": "Good" });

      expect(res.status).toBe(403);
    })

  })

  /*
  * @Description: Delete submission for an assessment
  */
  describe("Delete submission:/api/v1/assessments/:id/submission/:submissionId", () => {
    it("Should return 200 status code if the user is admin", async () => {
      const res = await testApp.delete(`/api/v1/assessments/${assessment._id}/submission/${assessmentSubmission._id}`).set("Authorization", `Bearer ${accessToken}`)
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("Should return 403 status code if the user is not admin", async () => {
      const res = await testApp.delete(`/api/v1/assessments/${assessment._id}/submission/${assessmentSubmission._id}`).set("Authorization", `Bearer ${studentAccessToken}`)
      expect(res.status).toBe(403);
    })

  })

})