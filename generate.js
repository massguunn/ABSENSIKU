const bcrypt = require("bcrypt");

async function generate() {
  const password = "admin123"; // Ganti dengan password yang Anda inginkan

  const hash = await bcrypt.hash(password, 10);

  console.log("Password :", password);
  console.log("Hash     :", hash);
}

generate();
