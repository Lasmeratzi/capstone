const bcrypt = require("bcrypt");
const { createAdmin } = require("../models/adminModels");

(async () => {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const superAdminPassword = await bcrypt.hash("superadmin123", 10);

  await createAdmin("admin", adminPassword, "admin");
  await createAdmin("superadmin", superAdminPassword, "super_admin");

  console.log("✅ Admin and Super Admin accounts created successfully.");
})();