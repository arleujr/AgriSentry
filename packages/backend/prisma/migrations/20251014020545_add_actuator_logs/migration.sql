-- DropForeignKey
ALTER TABLE "public"."actuators" DROP CONSTRAINT "actuators_environment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."environments" DROP CONSTRAINT "environments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."rules" DROP CONSTRAINT "rules_action_actuator_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."rules" DROP CONSTRAINT "rules_environment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."sensors" DROP CONSTRAINT "sensors_environment_id_fkey";

-- CreateTable
CREATE TABLE "actuator_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "triggered_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actuator_id" TEXT NOT NULL,

    CONSTRAINT "actuator_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "environments" ADD CONSTRAINT "environments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sensors" ADD CONSTRAINT "sensors_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actuators" ADD CONSTRAINT "actuators_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actuator_logs" ADD CONSTRAINT "actuator_logs_actuator_id_fkey" FOREIGN KEY ("actuator_id") REFERENCES "actuators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rules" ADD CONSTRAINT "rules_action_actuator_id_fkey" FOREIGN KEY ("action_actuator_id") REFERENCES "actuators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rules" ADD CONSTRAINT "rules_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
