require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const layouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(flash());

app.set("view engine", "ejs");
app.use(layouts);

app.set("layout", "layouts/main");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRoutes);
app.use("/dashboard", dashboardRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});
