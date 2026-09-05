const bcrypt = require("bcrypt");
const authModel = require("../models/authModel");

exports.loginPage = (req, res) => {
  res.render("auth/login", {
    title: "Login",
    error: null,
    layout: false,
  });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await authModel.findUser(username);

    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        error: "Username tidak ditemukan",
        layout: false,
      });
    }

    // Convert hash PHP
    const hash = user.password.replace("$2y$", "$2b$").replace("$2a$", "$2b$");

    const valid = await bcrypt.compare(password, hash);

    if (!valid) {
      return res.render("auth/login", {
        title: "Login",
        error: "Password salah",
        layout: "layouts/main",
      });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
    };

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
