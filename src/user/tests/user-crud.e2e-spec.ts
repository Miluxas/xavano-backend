import { agent } from "supertest";
import { app, baseAfterAll, baseBeforeAll } from "@/../test/base_e2e_spec";

describe(" User CRUD ", () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);
  let userId: number;
  let accessToken: string;
  it(" Device login", async () => {
    return agent(app.getHttpServer())
      .post("/device/auth")
      .send({
        device: {
          uid: "75D5782C-CA4B-45DA-9D95-F0E1991D458B",
          platform: "arm64",
          name: "iPhone 13",
          capacity: "494GB",
          disk: {
            total: 494384795648,
            free: 255612112896,
            totalStr: "494GB",
            freeStr: "255GB",
          },
          os: {
            version: "17.0.1",
            type: "iOS",
          },
        },
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.user).toBeUndefined();
        expect(resultObject.data.accessType).toBe("public");
        accessToken = resultObject.data.accessToken;
      });
  });

  let userToken: string;
  it(" User get otp by SMS", async () => {
    return agent(app.getHttpServer())
      .put("/auth/send-otp")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        phoneNumber: "+98-9123455566",
      })
      .expect(200);
  });

  it(" User login", async () => {
    return agent(app.getHttpServer())
      .post("/auth/login")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        phoneNumber: "+97-9123455566",
        otpCode: "12345",
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.user.password).toBeUndefined();
        userId = resultObject.data.user.id;
        userToken = resultObject.data.token;
      });
  });

  it(" User detail error by public token", async () => {
    return agent(app.getHttpServer())
      .get(`/users/2`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(403);
  });

  it(" User detail", async () => {
    return agent(app.getHttpServer())
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.firstName).toEqual("");
        expect(resultObject.data.lastName).toEqual("");
        expect(resultObject.data.id).toEqual(5);
        expect(resultObject.data.password).toBeUndefined();
      });
  });

  it(" User update", async () => {
    return agent(app.getHttpServer())
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ firstName: "Jonathon" })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.firstName).toEqual("Jonathon");
      });
  });

  it(" User get her/him account", async () => {
    return agent(app.getHttpServer())
      .get(`/users/my-account`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.firstName).toEqual("Jonathon");
      });
  });

  it(" User update her/him account", async () => {
    return agent(app.getHttpServer())
      .put(`/users/my-account`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ lastName: "Kidman" })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.lastName).toEqual("Kidman");
      });
  });
});
