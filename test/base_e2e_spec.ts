import { Test, TestingModule } from "@nestjs/testing";

import { INestApplication } from "@nestjs/common";
import { hashSync } from "bcryptjs";
import { AppModule } from "../src/app.module";

import { Connection } from "typeorm";
export let app: INestApplication;

export const baseBeforeAll = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleFixture.createNestApplication();
  await initDb();

  await app.init();
};

export const baseAfterAll = async () => {
  await sleep(100);
  if (app) await app.close();
};

const hash = async (text: string) => {
  const SALT_ROUND = 10;
  return hashSync(text, SALT_ROUND);
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function initDb() {
  const connection = app.get(Connection);
  const queryRunner = connection.driver.createQueryRunner("master");
  const passHash = await hash("123123");
  await queryRunner.query(`
  INSERT INTO user(id, createdAt, updatedAt, deletedAt, firstName, lastName, email,password,role,emailVerified) VALUES 
  ('1','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',NULL,'superAdmin','superAdmin','admin@test.com','${passHash}','Administrator','1'),
  ('2','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',NULL,'user1','user','user1@test.com','${passHash}','User','1'),
  ('3','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',NULL,'user2','user','user2@test.com','${passHash}','User','1'),
  ('4','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',NULL,'user3','user','user3@test.com','${passHash}','User','1');
  `);
}
