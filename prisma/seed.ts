
import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

async function main() {
    // Delete in dependency order
    await prisma.userRole.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();

    // Create Super Admin Role
    const role = await prisma.role.create({
        data: {
            name: "Super Admin",
            slug: "super-admin",
            description: "Has full system access",
        },
    });

    // Permissions
    const permissions = [
        "List Roles", "Add Roles", "Edit Roles", "Delete Roles",
        "List Users", "Add Users", "Edit Users", "Delete Users",
    ];

    const permissionRecords = await Promise.all(
        permissions.map((permission) =>
            prisma.permission.create({
                data: {
                    module: permission.split(" ").slice(1).join(" "),
                    name: permission,
                    slug: permission
                        .toLowerCase()
                        .replace(/'/g, "")
                        .replace(/\s+/g, "-"),
                },
            })
        )
    );

    // Create Super Admin User
    const password = await bcrypt.hash("Admin@123", 10);

    const user = await prisma.user.create({
        data: {
            name: "Super Admin",
            email: "superadmin@gmail.com",
            password,
        },
    });

    // Assign role
    await prisma.userRole.create({
        data: {
            userId: user.id,
            roleId: role.id,
        },
    });

    console.log("✅ Super Admin user created.");
    console.log("✅ Super Admin role created.");
    console.log("✅ All permissions created.");
    console.log("✅ Super Admin role assigned.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });