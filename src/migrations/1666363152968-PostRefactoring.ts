import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class PostRefactoring1666363152968 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "user",
                columns: [
                    {
                        name: "user_id",
                        type: "bigint",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: '255'
                    },
                    {
                        name: "password",
                        type: "char",
                        length: '60'
                    },
                    {
                        name: "last_login_date",
                        type: "timestamp",
                        isNullable: true
                    }
                ]
            }),
            true
        );

        await queryRunner.createIndex(
            "user",
            new TableIndex({
                name: "uk_User_email",
                columnNames: ["email"],
                isUnique: true
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "role",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: '50'
                    }
                ]
            }),
            true
        );

        await queryRunner.createTable(
            new Table({
                name: "user_role",
                columns: [
                    {
                        name: "user_id",
                        type: "bigint",
                        isPrimary: true
                    },
                    {
                        name: "role_id",
                        type: "int",
                        isPrimary: true
                    }
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "user_role",
            new TableForeignKey({
                name: "fk_UserRole_userId",
                columnNames: ["user_id"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "user"
            })
        );

        await queryRunner.createForeignKey(
            "user_role",
            new TableForeignKey({
                name: "fk_UserRole_roleId",
                columnNames: ["role_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "role"
            })
        );

        await queryRunner.query('INSERT INTO role (id, name) VALUES (1, "admin"), (2, "user")');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM role');
        await queryRunner.dropForeignKey("user_role", 'fk_UserRole_roleId');
        await queryRunner.dropForeignKey("user_role", 'fk_UserRole_userId');
        await queryRunner.dropTable("user_role");
        await queryRunner.dropTable("role");
        await queryRunner.dropIndex("user", "uk_User_email")
        await queryRunner.dropTable("user");
    }

}
