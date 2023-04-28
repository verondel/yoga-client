const express = require("express");
const axios = require("axios");

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
  //res.send('Hello World!');
  axios
    .get("http://localhost:3001/users", {
      params: {
        ID: 123,
      },
    })
    .then(function (resp) {
      // console.log(resp.data);

      res.render("pages/index", { users: resp.data });
    })
    .catch(function (error) {
      res.render("pages/error");
    });
});

let daysOfWeekShort = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

app.get("/", (req, res) => {
  axios
    .get("http://localhost:3001/typesAndLessons", {
      params: {
        ID: 123,
      },
    })
    .then(function (resp) {
      // console.log(resp.data);
      let daysOfWeekLong = [
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
        "Воскресенье",
      ];

      let months = [
        "янв",
        "фев",
        "мар",
        "апр",
        "май",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек",
      ];
      hoursForTable = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
      ];

      minutesForTable = ["0", "15", "30", "45"];

      const currentDay = new Date();
      let todayDate = currentDay.getDate();
      let todayMonth = months[currentDay.getMonth()];
      let todayStr = todayDate + " " + todayMonth;

      while (currentDay.getDay() !== 1) {
        currentDay.setDate(currentDay.getDate() - 1); // минус 1 день
      }

      let monday = new Date(currentDay);
      let mondayItterable = new Date(currentDay.setHours(3, 0, 0));

      mondayItterable.setDate(currentDay.getDate() - 1);
      let classesForTd = [];

      // генерация массива со всеми class для td
      hoursForTable.forEach((time) => {
        mondayItterable.setHours(time.slice(0, 2));
        minutesForTable.forEach((minutes) => {
          for (i = 0; i < 7; i++) {
            mondayItterable.setDate(mondayItterable.getDate() + 1);
            mondayItterable.setMinutes(minutes);
            let newDt = new Date(mondayItterable);
            classesForTd.push(newDt);
          }
          mondayItterable.setDate(mondayItterable.getDate() - 7);
        });
      });
      // console.log(classesForTd);

      let mondayNumber = currentDay.getDate();
      let mondayMonth = months[currentDay.getMonth()];
      let datesOfCurrentWeek = [];
      datesOfCurrentWeek.push(mondayNumber + " " + mondayMonth);

      for (let i = 0; i < 6; i++) {
        monday.setDate(monday.getDate() + 1);
        let nextDay = new Date(monday);
        let day = nextDay.getDate();
        datesOfCurrentWeek.push(day + " " + months[monday.getMonth()]);
      }

      // console.log(datesOfCurrentWeek);

      let counter = 0;
      res.render("pages/main", {
        tp_lessons: resp.data.tp_lessons, // all types of lessons
        daysOfWeekShort: daysOfWeekShort,
        daysOfWeekLong: daysOfWeekLong,
        datesOfCurrentWeek: datesOfCurrentWeek,
        todayStr: todayStr,
        timeForTable: hoursForTable,
        classesForTd: classesForTd,
        counter: counter,
        // lessons
      });
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
  // console.log('скинул ', req.signedCookies.user)
  // console.log('ВОШЕЛ В 1 IF')
  if (req.body.length == 0) {
    res.render("pages/error");
  } else {
    // console.log(typeof(req.body.login), !req.body.password)
    if (req.body.login != "" && req.body.password != "") {
      // console.log('передаю парамсы')
      axios
        .post("http://localhost:3001/auth", {
          params: {
            login: req.body.login,
            password: req.body.password,
          },
        })
        .then(function (resp) {
          // console.log(resp.data.auth);

          if (resp.data.auth == true) {
            res.setHeader("Authorization", "Bearer " + resp.data.token);
            // console.log('перед готов к ')
            res.cookie("user", "admin", {
              signed: true,
            });
            // console.log('редирект на админ')
            res.redirect("http://localhost:3000/admin");
          } else {
            res.cookie("admin", {
              signed: false,
            });
            // console.log('редирект на логин')
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
      // console.log('в админа')
      axios
        .get("http://localhost:3001/infoForNewLesson", {
          params: {
            ID: 123,
          },
        })
        .then(function (resp) {
          // console.log(resp.data);
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
            daysOfWeekShort: daysOfWeekShort,
            tableLessonHeaders: tableLessonHeaders,
            lessons: resp.data.lessons,
          }); // редирект в будущую админку
        })
        .catch(function (error) {
          console.log(error);
          res.render("pages/error");
        });
    } else {
      // кука просрочена
      // console.log('в логин')
      res.render("pages/login");
    }
  }

  // axios.get('http://localhost:3001/admin1', {
  //   params: {
  //     ID: 123
  //   }
  // })
  // .then(function (resp) {
  //   res.render('pages/admin1')
  // })
  // .catch(function (error) {
  //   res.render('pages/error');
  // })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
