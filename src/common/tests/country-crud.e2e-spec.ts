import { agent } from "supertest";
import {
  app,
  baseAfterAll,
  baseBeforeAll,
} from "@/../test/base_e2e_spec";

describe(" Country CRUD ", () => {
  beforeAll(async () => {
    await baseBeforeAll();
  });

  afterAll(baseAfterAll);

  let userToken: string;

  it(" Content manager login", async () => {
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
        userToken = resultObject.data.token;
      });
  });

  let countryId: number;
  it(" Content manager add new country", async () => {
    return agent(app.getHttpServer())
      .post("/countries/create")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: 'Turkey',
        isActive: true,
        dialCode: '953',
        code2Char: 'TR',
        code3Char: 'TRY',
        flag: '🇶🇦',
        timeZone: 'UTC +03:06',
        currencyIso: 'TL',
        currency: 'TL',
        decimal: 2,
        rate:10.56
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.title).toEqual("Turkey");
        countryId = resultObject.data.id;
      });
  });

  it(" Content manager edit a country", async () => {
    return agent(app.getHttpServer())
      .put(`/countries/${countryId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rate:10.9
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.title).toEqual("Turkey");
        expect(resultObject.data.rate).toEqual(10.9);
      });
  });

  it(" Content manager get countries list", async () => {
    return agent(app.getHttpServer())
      .post("/countries")
      .set("Authorization", `Bearer ${userToken}`)
      .send()
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.items[0].title).toEqual("Turkey");
      });
  });

  it(" Content manager get countries mini list", async () => {
    return agent(app.getHttpServer())
      .post("/countries/mini-list")
      .set("Authorization", `Bearer ${userToken}`)
      .send()
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.items[0].title).toEqual("Turkey");
      });
  });

  it(" Content manager get countries list by search", async () => {
    return agent(app.getHttpServer())
      .post("/countries")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        search: "Turkey",
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        // console.log(resultObject);
        expect(resultObject.data.items[0].title).toEqual("Turkey");
      });
  });

  it(" Content manager get country by id", async () => {
    return agent(app.getHttpServer())
      .get(`/countries/${countryId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send()
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.title).toEqual("Turkey");
      });
  });

  it(" Content manager delete a country", async () => {
    return agent(app.getHttpServer())
      .delete(`/countries/${countryId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.data.result).toEqual("Country is deleted");
      });
  });
});
