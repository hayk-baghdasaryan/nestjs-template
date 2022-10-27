import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoring1666372202823 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const passHash = await bcrypt.hash("password", 10);
        const result = await queryRunner.query("INSERT INTO user (email, password) VALUES (?, ?)", ["test@test.com", passHash]);

        // await queryRunner.query("INSERT INTO user_role (user_id, role_id) VALUES (?, ?)", [result.insertId, 1]);
        await queryRunner.query("INSERT INTO user_role (user_id, role_id) VALUES (?, ?)", [result.insertId, 2]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
