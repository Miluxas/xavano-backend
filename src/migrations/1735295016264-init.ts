import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1735295016264 implements MigrationInterface {
    name = 'Init1735295016264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`firstName\` varchar(80) NOT NULL, \`lastName\` varchar(80) NOT NULL, \`email\` varchar(255) NULL, \`phoneNumber\` varchar(255) NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`emailVerified\` tinyint NOT NULL DEFAULT 0, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`password\` varchar(255) NULL, \`parentalPin\` varchar(255) NULL, \`role\` varchar(255) NOT NULL, \`userType\` varchar(255) NOT NULL DEFAULT 'App', \`lastLogin\` datetime NULL, \`deleteReason\` text NULL, \`isTrialUsed\` tinyint NOT NULL DEFAULT 0, INDEX \`IDX_e11e649824a45d8ed01d597fd9\` (\`createdAt\`), INDEX \`IDX_92f09bd6964a57bb87891a2acf\` (\`deletedAt\`), FULLTEXT INDEX \`IDX_c322cd2084cd4b1b2813a90032\` (\`firstName\`, \`lastName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`refresh_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(255) NOT NULL, \`userId\` int NOT NULL, \`token\` varchar(255) NOT NULL, \`expiresAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`parentId\` int NULL, \`userId\` int NOT NULL, \`user\` json NOT NULL, \`content\` text NOT NULL, \`status\` varchar(255) NOT NULL, INDEX \`IDX_3edd3cdb7232a3e9220607eabb\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_3edd3cdb7232a3e9220607eabb\` ON \`comment\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP TABLE \`refresh_token\``);
        await queryRunner.query(`DROP INDEX \`IDX_c322cd2084cd4b1b2813a90032\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_92f09bd6964a57bb87891a2acf\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e11e649824a45d8ed01d597fd9\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
