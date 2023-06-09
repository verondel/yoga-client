const express = require("express");
const axios = require("axios");
const CryptoJS = require("crypto-js");

const app = express();
const port = 3000;
app.use(express.static("assets")); // Статическая папка !!!!

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set("view engine", "ejs");

const cookierParser = require("cookie-parser");
app.use(cookierParser("abcdef-12345"));

app.get("/users", (req, res) => {
  axios
    .get("http://localhost:3001/users", {
      params: {
        ID: 123,
      },
    })
    .then(function (resp) {
      res.render("pages/index", { users: resp.data });
    })
    .catch(function (error) {
      res.render("pages/error");
    });
});

const DAYSOFWEEKSHORT = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const DAYSOFWEEKLONG = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

app.get("/", (req, res) => {
  axios
    .get("http://localhost:3001/typesAndLessons", {
      params: {
        ID: 123,
      },
    })
    .then(function (resp) {
      let hoursForTable = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "15:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
      ];

      let counter = 0;
      res.render("pages/main", {
        tp_lessons: resp.data.tp_lessons, // all types of lessons
        datesOfCurrentWeek: resp.data.datesOfCurrentWeek,
        todayStr: resp.data.todayStr,
        sft: resp.data.scheduleForTable,
        daysOfWeekShort: DAYSOFWEEKSHORT,
        daysOfWeekLong: DAYSOFWEEKLONG,
        hoursForTable: hoursForTable,
        counter: counter,
        hash: resp.data.hash,
      });
    })
    .catch(function (error) {
      res.render("pages/error");
    });
});

app.get("/login", (req, res) => {
  if (!req.signedCookies.user) {
    // если нет куки, то пускай регистрируется
    res.render("pages/login");
  } else {
    // кука есть, проверяем ее
    if (req.signedCookies.user == "admin") {
      res.redirect("http://localhost:3000/admin"); // редирект в будущую админку
    } else {
      // кука просрочена
      res.render("pages/login");
    }
  }
});

app.get("/logout", (req, res) => {
  res.cookie("user", "Leopold", {
    signed: true,
  });
  res.redirect("http://localhost:3000/login");
});

app.post("/auth", (req, res) => {
  if (req.body.length == 0) {
    res.render("pages/error");
  } else {
    if (req.body.login != "" && req.body.password != "") {
      axios
        .post("http://localhost:3001/auth", {
          params: {
            login: req.body.login,
            password: req.body.password,
          },
        })
        .then(function (resp) {
          if (resp.data.auth == true) {
            res.setHeader("Authorization", "Bearer " + resp.data.token);
            res.cookie("user", "admin", {
              signed: true,
            });
            res.redirect("http://localhost:3000/admin");
          } else {
            res.cookie("admin", {
              signed: false,
            });
            res.redirect("http://localhost:3000/login");
          }
        })

        .catch(function (error) {
          res.render("pages/error");
        });
    }
  }
});

app.get("/admin", (req, res) => {
  if (!req.signedCookies.user) {
    // если нет куки, то пускай регистрируется
    res.render("pages/login");
  } else {
    // кука есть, проверяем ее
    if (req.signedCookies.user == "admin") {
      axios
        .get("http://localhost:3001/infoForNewLesson", {
          params: {
            ID: 123,
          },
        })
        .then(function (resp) {
          let daysOfWeek = [
            "Moday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturnday",
            "Sunday",
          ];
          let btnValue = ["1", "2", "3", "4", "5", "6", "0"];

          let tableLessonHeaders = [
            "ID",
            "Дата и время",
            "Зал",
            "Тип занятия",
            "Преподаватель",
            "Удалить",
          ];

          res.render("pages/admin", {
            halls: resp.data.halls,
            tp_lessons: resp.data.tp_lessons,
            daysOfWeek: daysOfWeek,
            btnValue: btnValue,
            daysOfWeekShort: DAYSOFWEEKSHORT,
            tableLessonHeaders: tableLessonHeaders,
            lessons: resp.data.lessons,
          }); // редирект в админку
        })
        .catch(function (error) {
          res.render("pages/error");
        });
    } else {
      // кука просрочена
      res.render("pages/login");
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
