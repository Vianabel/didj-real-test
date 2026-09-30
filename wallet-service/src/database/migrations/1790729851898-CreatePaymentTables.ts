import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentTables1790729851898 implements MigrationInterface {
  name = 'CreatePaymentTables1790729851898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."payment_history_action_enum" AS ENUM('purchase', 'refund', 'top_up')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "balance" numeric(12,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_history" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "action" "public"."payment_history_action_enum" NOT NULL, "amount" numeric(12,2) NOT NULL, "ts" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5fcec51a769b65c0c3c0987f11c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_payment_history_user_ts" ON "payment_history"  ("userId", "ts") `,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_history" ADD CONSTRAINT "FK_34d643de1a588d2350297da5c24" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_history" DROP CONSTRAINT "FK_34d643de1a588d2350297da5c24"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_payment_history_user_ts"`,
    );
    await queryRunner.query(`DROP TABLE "payment_history"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."payment_history_action_enum"`);
  }
}
