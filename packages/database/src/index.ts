import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { resolve } from "path";
import { Pool } from "pg";
import { getCurrentEnv, getPostgresUrl } from "./utils/env";

// Create the database connection
const connectionString = getPostgresUrl();
if (!connectionString) {
    throw new Error(
        "Database URL is not defined. ENV =>" + process.env.NODE_ENV,
    );
}

// Configure the connection pool
const pool = new Pool({
    connectionString,
    max: 20, // maximum number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // how long to wait for a connection
    ssl: getCurrentEnv() === "prod" ? { rejectUnauthorized: false } : false, // Enable SSL in production
});

// Create the drizzle instance with the pooled connection
export const db = drizzle(pool);

// Connection check utility
export const checkConnection = async () => {
    try {
        const client = await pool.connect();
        await client.query("SELECT 1");
        client.release();
        return true;
    } catch (err) {
        console.error("❌ Unable to connect to postgres", err);
        throw err;
    }
};

// Migration utility
export const runMigrations = async () => {
    try {
        const migrationsPath = resolve(
            __dirname,
            "../drizzle",
            // "/app/packages/database/drizzle"
        );

        console.log("📢 Running database migrations...");

        await migrate(db, {
            migrationsFolder: migrationsPath,
        });
        console.log("✅ Migrations completed successfully");
    } catch (err) {
        console.error("❌ Migration failed", err);
        throw err;
    }
};

// generate migration file utility
export const generateMigration = async (migrationName?: string) => {
    const { execSync } = await import("child_process");

    try {
        const name = migrationName || `migration_${Date.now()}`;
        console.log(`📝 Generating migration: ${name}`);

        execSync(`npx drizzle-kit generate --name ${name}`, {
            stdio: "inherit",
            cwd: resolve(__dirname, ".."),
        });

        console.log("✅ Migration file generated successfully");
    } catch (err) {
        console.error("❌ Migration generation failed", err);
        throw err;
    }
};

// Pool event handlers
pool.on("error", () => {
    console.error("❌ Unexpected error on idle client");
    process.exit(-1);
});

pool.once("connect", (ev) => {
    console.log(`✅ Postgres Connected to ${ev?.host}:${ev.database}`);
});

// Export utilities
export { getCurrentEnv, getPostgresUrl };
//USER MODEL
export { usersModel, type DbNewUser, type DbUser } from "./models/user.model";
//USER DAL
export { UserDal } from "./dal/user.dal";
//PROJECT MODEL
export {
    projectModel,
    type DbNewProject,
    type DbProject,
} from "./models/project.model";
//PROJECT DAL
export { ProjectDal } from "./dal/project.dal";
//SERVER MODEL
export {
    ServerDal,
    serverModel,
    type DbNewServer,
    type DbServer,
} from "./models/server.model";

//LABEL MODEL
export {
    LabelDal,
    labelModel,
    type DbLabel,
    type DbNewLabel,
} from "./models/label.model";

//TASK TYPE MODEL
export {
    TaskTypeDal,
    taskTypeModel,
    type DbNewTaskType,
    type DbTaskType,
} from "./models/task-type.model";

//PROJECT ROLE MODEL
export {
    ProjectDefinedRolesDal,
    projectDefinedRolesModel,
    type DbNewProjectDefinedRole,
    type DbProjectDefinedRole,
} from "./models/project-defined-roles.model";

//PROJECT USER ROLE ASSIGNMENT MODEL
export {
    ProjectRolesDal,
    projectRolesModel,
    type DbNewProjectRole,
    type DbProjectRole,
    type DbProjectUserRoleRow,
} from "./models/project-roles.model";

//PROJECT INVITES MODEL
export {
    ProjectInvitesDal,
    projectInvitesModel,
    type DbNewProjectInvite,
    type DbProjectInvite,
} from "./models/project-invites.model";

//MILESTONE MODEL
export {
    MilestoneDal,
    milestoneModel,
    type DbMilestone,
    type DbNewMilestone,
} from "./models/milestone.model";

//TASK MODEL
export {
    TaskDal,
    taskModel,
    type DbNewTask,
    type DbTask,
} from "./models/task.model";
