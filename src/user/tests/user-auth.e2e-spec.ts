import { app, baseAfterAll, baseBeforeAll } from "@/../test/base_e2e_spec";
import { agent } from "supertest";

describe(" Auth ", () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let userId: number;
  let userToken: string;
  let accessToken: string;


  it(" User login again", async () => {
    return agent(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "user1@test.com",
        password: "123123",
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.user.password).toBeUndefined();
        userToken=resultObject.data.token;
      });
  });


  it(" User logout", async () => {
    return agent(app.getHttpServer())
      .get("/auth/logout")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        console.log(resultObject.data);
      });
  });

});
