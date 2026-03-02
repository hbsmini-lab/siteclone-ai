import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@siteclone.ai" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@siteclone.ai",
      password: adminPassword,
      role: "admin",
      credits: 999,
      plan: "enterprise",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create demo user
  const userPassword = await bcrypt.hash("demo123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@siteclone.ai" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@siteclone.ai",
      password: userPassword,
      role: "user",
      credits: 5,
      plan: "free",
    },
  });
  console.log("✅ Demo user created:", user.email);

  // Create packages
  const packages = [
    {
      name: "Starter",
      slug: "starter",
      description: "Perfect for getting started",
      price: 9,
      credits: 10,
      features: JSON.stringify([
        "10 Website Clones/month",
        "Basic Visual Editor",
        "HTML/CSS Export",
        "Email Support",
        "1 Published Site",
      ]),
      isPopular: false,
      duration: 30,
    },
    {
      name: "Pro",
      slug: "pro",
      description: "Best for professionals",
      price: 29,
      credits: 50,
      features: JSON.stringify([
        "50 Website Clones/month",
        "Advanced Visual Editor",
        "All Export Formats",
        "Priority Support",
        "10 Published Sites",
        "Custom Domains",
        "Version History",
      ]),
      isPopular: true,
      duration: 30,
    },
    {
      name: "Enterprise",
      slug: "enterprise",
      description: "For teams and agencies",
      price: 99,
      credits: 999,
      features: JSON.stringify([
        "Unlimited Clones",
        "Full Editor Suite",
        "API Access",
        "24/7 Support",
        "Unlimited Sites",
        "Custom Domains",
        "White Label",
        "Team Collaboration",
      ]),
      isPopular: false,
      duration: 30,
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }
  console.log("✅ Packages created");

  // Create sample campaign
  await prisma.campaign.upsert({
    where: { code: "WELCOME50" },
    update: {},
    create: {
      title: "Welcome Discount",
      description: "50% off for new users",
      code: "WELCOME50",
      discount: 50,
      maxUses: 1000,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    },
  });
  console.log("✅ Sample campaign created");

  // Create features
  const features = [
    { title: "AI-Powered Cloning", description: "Clone any website with AI", icon: "wand", order: 1 },
    { title: "Live Visual Editor", description: "Edit websites visually", icon: "edit", order: 2 },
    { title: "One-Click Publish", description: "Publish instantly", icon: "rocket", order: 3 },
    { title: "Version Control", description: "Track all changes", icon: "git", order: 4 },
    { title: "Custom Domains", description: "Use your own domain", icon: "globe", order: 5 },
    { title: "Export Code", description: "Export clean code", icon: "code", order: 6 },
  ];

  for (const feature of features) {
    await prisma.feature.create({ data: feature });
  }
  console.log("✅ Features created");

  console.log("\n🎉 Seeding complete!");
  console.log("\n📧 Admin login: admin@siteclone.ai / admin123");
  console.log("📧 Demo login: demo@siteclone.ai / demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
