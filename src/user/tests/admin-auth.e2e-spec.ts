import { app, baseAfterAll, baseBeforeAll } from "@/../test/base_e2e_spec";
import { agent } from "supertest";

describe(" Auth ", () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let userToken: string;
  let refreshToken: string;

  it(" User login", async () => {
    return agent(app.getHttpServer())
      .post("/auth/admin/login")
      .send({
        email: "admin@test.com",
        password: "123123dd",
      })
      .expect(400)
  });

  it(" User login", async () => {
    return agent(app.getHttpServer())
      .post("/auth/admin/login")
      .send({
        email: "admin@test.com",
        password: "123123",
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.user.firstName).toEqual("superAdmin");
        expect(resultObject.data.user.password).toBeUndefined();
        userToken = resultObject.data.token;
        refreshToken = resultObject.data.refreshToken;
      });
  });

  it(" User refresh token", async () => {
    return agent(app.getHttpServer())
      .get("/auth/admin/refresh")
      .set("Authorization", `Bearer ${refreshToken}`)
      .expect(200)
  });

  it(" Change password", async () => {
    return agent(app.getHttpServer())
      .put("/auth/admin/change-password")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        oldPassword: "123123",
        newPassword: "123456",
      })
      .expect(200);
  });

  it(" User login with new password", async () => {
    return agent(app.getHttpServer())
      .post("/auth/admin/login")
      .send({
        email: "admin@test.com",
        password: "123456",
      })
      .expect(200);
  });

  it(" Forget password", async () => {
    return agent(app.getHttpServer())
      .put("/auth/admin/forget-password")
      .send({
        email: "admin2@test.com",
      })
      .expect(200);
  });

  it(" Panel user login", async () => {
    return agent(app.getHttpServer())
      .post("/auth/admin/login")
      .send({
        email: "content@test.com",
        password: "123123",
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        userToken = resultObject.data.token;
      });
  });

  it(" Panel user get permissions", async () => {
    return agent(app.getHttpServer())
      .get("/auth/admin/permissions")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        console.log(resultObject);
        expect(resultObject.data.tag.includes("Create")).toEqual(true);
      });
  });
});
