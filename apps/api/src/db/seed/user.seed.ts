import { faker } from "@faker-js/faker";
import {
    DbUser,
    ProjectDefinedRolesDal,
    projectRolesModel,
    usersModel,
} from "@taskcord/database";
import { uuidv7 } from "uuidv7";
import db from "../postgres.db";

export async function seedUsers() {
    const users = Array.from({ length: 5 }).map(() => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        return {
            id: uuidv7(),
            discordId: faker.string.numeric(18),
            fullName: `${firstName} ${lastName}`,
            nickName: faker.internet.username(),
            avatar: faker.image.avatar(),
            email: faker.internet.email({ firstName, lastName }),
            discordRefreshToken: faker.string.alphanumeric(40),
            discordAccessToken: faker.string.alphanumeric(40),
            discordAccessTokenExpiresAt: faker.date.soon({ days: 10 }),
            lastAuth: new Date(),
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    });

    const newUsers = await db.insert(usersModel).values(users).returning();

    return newUsers;
}

export async function seedRoles(users: DbUser[] = [], projectId: string) {
    if (users.length === 0) {
        return [];
    }
    let projectDefinedRoles =
        await ProjectDefinedRolesDal.getRolesByProjectId(projectId);

    projectDefinedRoles = projectDefinedRoles.filter(
        (role) => role.roleName !== "Owner",
    );

    const newProjectRoles = users.map((user) => ({
        projectId,
        userId: user.id,
        roleId: projectDefinedRoles[
            Math.floor(Math.random() * projectDefinedRoles.length)
        ].id,
    }));

    await db.insert(projectRolesModel).values(newProjectRoles);
}

export async function SeedUserAndRoles(projectId: string) {
    try {
        const seededUsers = await seedUsers();
        const seededRoles = await seedRoles(seededUsers, projectId);

        console.log("✅ Seeding completed successfully!");
        console.log("Seeded Users:", seededUsers);
        console.log("Seeded Roles:", seededRoles);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    }
}
