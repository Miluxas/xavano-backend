import { agent } from "supertest";
import { app, baseAfterAll, baseBeforeAll } from "@/../test/base_e2e_spec";

describe(" Admin Role Control ", () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let userId: number;
  let userToken: string;

  it(" Content Manager login", async () => {
    return agent(app.getHttpServer())
      .post("/auth/admin/login")
      .send({
        email: "content@test.com",
        password: "123123",
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.user.firstName).toEqual("Content");
        expect(resultObject.data.user.password).toBeUndefined();
        userId = resultObject.data.user.id;
        userToken = resultObject.data.token;
        console.log(userId)
      });
  });

  it(" Content Manager get list", async () => {
    return agent(app.getHttpServer())
      .post(`/users`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.items.length).toEqual(1);
      });
  });

  it(" Content Manager can edit him/her user", async () => {
    return agent(app.getHttpServer())
      .put("/users/" + userId)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        firstName: "new name",
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.firstName).toEqual("new name");
      });
  });

  it(" Content Manager can NOT edit other user", async () => {
    return agent(app.getHttpServer())
      .put("/users/2")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        firstName: "new name",
      })
      .expect(403);
  });

  it(" Content Manager can NOT get other user", async () => {
    return agent(app.getHttpServer())
      .get("/users/2")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(403);
  });

  it(" Panel user can NOT disable him/her self", async () => {
    return agent(app.getHttpServer())
      .put("/users/activation/" + userId)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        active: false,
      })
      .expect(403);
  });

  it(" Panel user can NOT delete him/her self", async () => {
    return agent(app.getHttpServer())
      .delete("/users/" + userId)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(403);
  });
});
