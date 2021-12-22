const { random } = require("lodash");
const request = require("supertest");
const app = require("../src/server/handler/admin");

describe("Cek Endpoint", () => {
  it("Test Endpoint", () => {
    request(app)
      .get("/api")
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toMatch("ok");
      });
  });
});

describe("Get EndPoints", () => {
  for (let i = 0; i < 5; i++) {
    let randomNumber = Math.floor(Math.random() * 10) + 1;
    it("Get Seminars per Page", () => {
      request(app)
        .get("/api/seminars/" + randomNumber)
        .then((res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.status).toMatch("Success");
          expect(res.body.data).toBeInstanceOf(Object);
        });
    });
  }

  for (let i = 0; i < 5; i++) {
    let randomNumber = Math.floor(Math.random() * 10) + 1;
    it("Get Detail Seminars", () => {
      request(app)
        .get("/api/seminars/detail/" + randomNumber)
        .then((res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.status).toMatch("Success");
          expect(res.body.data).toBeInstanceOf(Object);
        });
    });
  }

  for (let i = 0; i < 5; i++) {
    let randomNumber = Math.floor(Math.random() * 10) + 1;
    it("Get Participants per Page", () => {
      request(app)
        .get(`/seminar/${randomNumber}/participants/${randomNumber}`)
        .then((res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.status).toMatch("Success");
          expect(res.body.data).toBeInstanceOf(Object);
        });
    });
  }

  for (let i = 0; i < 5; i++) {
    let randomNumber = Math.floor(Math.random() * 10) + 1;
    it("Get Detail Participants", () => {
      request(app)
        .get(`/seminar/${random}/participants/${randomNumber}`)
        .then((res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.status).toMatch("Success");
          expect(res.body.data).toBeInstanceOf(Object);
        });
    });
  }
});

describe("Post Endpoints", () => {
  describe("Login Admin", () => {
    it("Login Success", () => {
      request(app)
        .post("/api/admin/login")
        .send({
          username: "admin",
          password: 123,
        })
        .then((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toMatch("token generated succesfully");
          expect(res.body.token).toBeInstanceOf(String);
        });
    });

    it("Login Failed with Username Null", () => {
      request(app)
        .post("/api/admin/login")
        .send({
          username: null,
          password: 123,
        })
        .then((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toMatch(
            "token generate failure: invalid auth"
          );
        });
    });

    it("Login Failed with Password null", () => {
      request(app)
        .post("/api/admin/login")
        .send({
          username: "admin",
          password: null,
        })
        .then((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toMatch(
            "token generate failure: invalid auth"
          );
        });
    });
  });

  describe("Post Seminar", () => {
    it("Post Seminar", () => {
      request(app)
        .post("/api/seminars/")
        .send({
          title: "Kebangsaan",
          partner: "UAD",
          speaker: "Presiden",
          moderator: "Menteri",
          date: "2021-06-12",
          starthour: "16:00",
          durationMinutes: "123",
        })
        .then((res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.status).toMatch("Success");
          expect(res.body.data).toBeInstanceOf(Object);
          expect(res.body.data.title).toBeInstanceOf(String);
        });
    });

    for (let i = 0; i < 5; i++) {
      let randomNumber = Math.floor(Math.random() * 10) + 1;
      it("Update Seminars", () => {
        request(app)
          .put("/api/seminars/" + randomNumber)
          .send({
            title: "Kebangsaan",
            partner: "UAD",
            speaker: "Presiden",
            moderator: "Menteri",
            date: "2021-06-12",
            starthour: "16:00",
            durationMinutes: "123",
          })
          .then((res) => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toMatch("Success");
          });
      });
    }

    for (let i = 0; i < 5; i++) {
      let randomNumber = Math.floor(Math.random() * 10) + 1;
      it("Delete Seminars", () => {
        request(app)
          .delete("/api/seminars/" + randomNumber)
          .then((res) => {
            expect(res.body.status).toMatch("Success");
          });
      });
    }
  });

  describe("Post Participant", () => {
    for (let i = 0; i < 5; i++) {
      let randomNumber = Math.floor(Math.random() * 10) + 1;
      it("Create Participant", () => {
        request(app)
          .post(`/seminar/${randomNumber}/participants`)
          .send({
            seminaritemid: randomNumber,
            itemid: randomNumber,
            name: "Heri Susanto Arisman",
            email: "heri@gmail.com",
            agency: "UAD",
            phone: "082240123456",
            proof: "bukti-bayar.jpg",
          })
          .then((res) => {
            expect(res.body.status).toMatch("Success");
            expect(res.body.data).toBeInstanceOf(Object);
          });
      });
    }

    for (let i = 0; i < 5; i++) {
      let randomNumber = Math.floor(Math.random() * 10) + 1;
      it("Update Participant", () => {
        request(app)
          .put(`/seminar/${randomNumber}/participants/${randomNumber}`)
          .send({
            seminaritemid: randomNumber,
            itemid: randomNumber,
            name: "Heri Susanto Arisman",
            email: "heri@gmail.com",
            agency: "UAD",
            phone: "082240123456",
            proof: "bukti-bayar.jpg",
          })
          .then((res) => {
            expect(res.body.status).toMatch("Success");
            expect(res.body.data).toBeInstanceOf(Object);
          });
      });
    }

    for (let i = 0; i < 5; i++) {
      let randomNumber = Math.floor(Math.random() * 10) + 1;
      it("Delete Participant", () => {
        request(app)
          .delete(`/seminar/${randomNumber}/participants/${randomNumber}`)
          .then((res) => {
            expect(res.body.status).toMatch("Success");
            expect(res.body.data).toBeInstanceOf(Object);
          });
      });
    }
  });
});
