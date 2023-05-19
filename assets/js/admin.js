// const { default: axios, Axios } = require("axios");

function masks() {
  let elements = document.querySelectorAll(".timeMask");
  let maskOptions = {
    mask: "#&:1*",
    // mask: /^([1][0-9]|[2][0-4]):[0-5][0-9]$/,
    lazy: false,
    definitions: {
      // <any single char>: <same type as mask (RegExp, Function, etc.)>
      // defaults are '0', 'a', '*'
      "#": /[0-2]/,
      "&": /[0-9]/,
      1: /[0,1,2,3,4]/,
      "*": /[0,5]/,
    },
  };

  elements.forEach((element) => {
    let mask = new IMask(element, maskOptions);
  });
}

// let TIMEREGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
let TIMEREGEX = /^([0-1][0-9]|2[0-3]):(00|15|30|45)$/;

document.addEventListener("DOMContentLoaded", () => {
  masks();
});

function addTeachers(whereAddTeachers, whereTakeTpLesson) {
  var tpLessonsSelect = document.querySelector(`.${whereTakeTpLesson}`);
  var teacherSelect = document.querySelector(`.${whereAddTeachers}`);
  var selectedOption = tpLessonsSelect.value;

  console.log("Add teachers have just got", tpLessonsSelect, teacherSelect);

  teacherSelect.innerHTML = '<option value="" disabled>Преподаватель</option>';

  console.log("before axios");
  axios
    .get("http://localhost:3001/teachers", {
      params: {
        tp_lesson: selectedOption,
      },
    })
    .then(function (response) {
      let teachersIdName = response.data;
      console.log("teacher", teachersIdName);

      for (let i = 0; i < teachersIdName.length; i++) {
        var option = document.createElement("option");
        option.text = teachersIdName[i].teacher.full_name;
        option.value = teachersIdName[i].teacher.id;
        teacherSelect.add(option);
      }
    })
    .catch(function (error) {
      console.log("error", error);
    });
  // .finally(function () {
  //   // always executed
  // });

  // enable teachers select
  teacherSelect.disabled = false;
}
// отметить день недели checkbox по дате из input "Дата начала"
document.addEventListener("DOMContentLoaded", () => {
  let daysOfWeek = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];

  // когда изменяется поле "дата начала"
  document.getElementById("dt_start").onchange = function (event) {
    let valueFromInput = event.target.value;
    let dayOfWeekFromInput = new Date(valueFromInput).getDay();

    let reAmountInput = document.querySelector("#reAmount");
    reAmountInput.setAttribute("value", "1");
    reAmountInput.removeAttribute("disabled");

    // проверка года на 20**
    if (valueFromInput.slice(0, 2) == "20") {
      let allBtn = document.querySelectorAll("#btnDayOfWeek");
      for (let i = 0; i < 7; i++) {
        let currentBtn = allBtn[i].children[0];
        currentBtn.removeAttribute("checked");
        currentBtn.removeAttribute("disabled");
      }

      document.querySelector("#timeOnDayOfTheWeek").removeAttribute("disabled");

      let pressedBtn =
        dayOfWeekFromInput - 1 !== -1
          ? allBtn[dayOfWeekFromInput - 1].children[0]
          : allBtn[6].children[0];

      pressedBtn.setAttribute("checked", "");
      // pressedBtn.setAttribute("disabled", ""); // todo: разобраться что с кнопкой

      document.querySelector(
        ".timeForFirstRep"
      ).innerHTML = `${daysOfWeek[dayOfWeekFromInput]}`;

      let weekDays = document.querySelector(".weekDays");

      weekDays.onclick = function (event) {
        // console.log("event", event);

        // на какую кнопку нажал
        // console.log();
        let clickedBtnOuterText = event.srcElement.nextElementSibling.outerText;
        if (event.target.localName == "input") {
          if (event.target.checked == true) {
            const addDiv = document.querySelector(".addWeekDaysTime");
            const newDiv = document.createElement("div");
            newDiv.classList.add("row");
            newDiv.classList.add("pt-2");

            const col1 = document.createElement("div");
            col1.classList.add("col-lg-2");
            col1.classList.add("pt-xxl-2");
            col1.textContent = "По ";

            const span = document.createElement("span");
            span.style.color = "#AB9384";
            span.textContent = daysOfWeek[event.target.value];

            const textNode = document.createTextNode(" в");

            const col2 = document.createElement("div");
            col2.classList.add("col-lg-3");

            const input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("name", "timeOfDay[]");
            input.setAttribute("id", "timeOnDayOfTheWeek");
            input.classList.add("form-control");
            input.classList.add("timeMask");

            col2.appendChild(input);
            col1.appendChild(span);
            col1.appendChild(textNode);

            newDiv.appendChild(col1);
            newDiv.appendChild(col2);

            addDiv.appendChild(newDiv);

            // newDiv.innerHTML = `
            // <div class="col-lg-2">По <span style="color: #AB9384; class="forDelete">${
            //   daysOfWeek[event.target.value]
            // }</span> в</div>
            // <div class="col-lg-3">
            //   <input type="text" name="timeOfDay[]" class="form-control timeMask">
            // </div>
            // `;
            document.querySelector(".addWeekDaysTime").appendChild(newDiv);
            masks();
          } else {
            let deleteDiv = document.querySelectorAll(".addWeekDaysTime");
            let childrenIdx = Object.keys(deleteDiv[0].children);
            let childrenIdxWithoutFirst = childrenIdx.splice(
              1,
              childrenIdx.length
            );

            childrenIdxWithoutFirst.forEach((key) => {
              let currentRow = deleteDiv[0].children[key];
              let currentRowText = currentRow.outerText.slice(3, 5);
              // let clickedBtnOuterText = event.srcElement.nextElementSibling.outerText;

              if (currentRowText == clickedBtnOuterText) {
                currentRow.remove();
              }
            });
          }
        }
      };
    }
  };

  document.querySelector(".btnAdminAdd").onclick = function (event) {
    const form = document.querySelector("#addLessonForm");
    const formDate = new FormData(form);
    let inputForTime = document.querySelectorAll("#timeOnDayOfTheWeek");
    let spanInnerHtml = [];
    let daysOfWeekShort = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
    let checksWerePassed = true;
    let hallSelect = document.getElementById("hall");
    let tpLessonSelect = document.getElementById("tpLessons");
    let dtStartInput = document.querySelectorAll("#dt_start");
    console.log(dtStartInput);
    let formDateKeys = [];
    let formDateUniqueKeys = new Set();
    console.log(
      "-----------------------------------------------------------------"
    );
    console.log("Stage 1", "checkhallSelect");

    inputForTime.forEach((el, idx) => {
      console.log("Stage 2", "index = ", idx);
      spanInnerHtml.push(
        el.parentElement.previousElementSibling.children[0].innerHTML
      );
      console.log("current value", el.value);

      console.log("Stage 3. Hall ", hallSelect !== "Зал", hallSelect.value);

      /*
      проверка на валидность:
      1. выбран ли тип занятия
      2. выбран ли зал
      3. все ли input дат (#timeOnDayOfTheWeek) введены корректно
      4. кол-во в formDate соответствует 8?
      */

      if (tpLessonSelect.value !== "Тип занятия") {
        tpLessonSelect.classList.remove("is-invalid");
        checksWerePassed = checksWerePassed == false ? false : true;
        console.log("Stage 33 tp yes", checksWerePassed);
      } else {
        tpLessonSelect.classList.add("is-invalid");
        checksWerePassed = false;
        console.log("Stage 33 tp no", checksWerePassed);
      }

      if (hallSelect.value !== "Зал") {
        hallSelect.classList.remove("is-invalid");
        checksWerePassed = checksWerePassed == false ? false : true;
        console.log("Stage 3.1 yes", checksWerePassed);
      } else {
        hallSelect.classList.add("is-invalid");
        checksWerePassed = false;
        console.log("Stage 3.1 not", checksWerePassed);
      }

      if (TIMEREGEX.test(el.value)) {
        inputForTime[idx].classList.remove("is-invalid");
        // let amoutOfLessons = document.getElementById("reAmount").value;
        for (const key of formDate.keys()) {
          formDateKeys.push(key);
        }

        formDateUniqueKeys = new Set(formDateKeys);
        console.log(
          "Unique form date keys one",
          formDateUniqueKeys,
          formDateUniqueKeys.size
        );
        checksWerePassed = checksWerePassed == false ? false : true;
      } else {
        // console.log("Stage 4.1 no");
        inputForTime[idx].classList.add("is-invalid");
        checksWerePassed = false;
      }
    });

    if (checksWerePassed == true && formDateUniqueKeys.size == 8) {
      console.log("I make axios ");
      let spanInnerHtmlNumbers = []; // рельное расположение инпутов под кнопки
      spanInnerHtml.forEach(function (el) {
        spanInnerHtmlNumbers.push(daysOfWeekShort.indexOf(el));
      });
      formDate.append("spanInnerHtmlNumbers", spanInnerHtmlNumbers);
      console.log(spanInnerHtml);
      // аксиос
      axios
        .patch("http://localhost:3001/api/lessons", formDate, {
          headers: {
            "Content-Type": "multipart/form-date",
          },
        })
        .then(function (resp) {
          location.replace(location.href);
          console.log("respresp", resp);
          if (resp.data == "-1") {
            console.log("TOTAL ERROR");
          }
        });
    } else {
      console.log("NOT AXIOS");
    }
  };

  // document.querySelector(".btnAddTeacher").onclick = function (event) {
  //   const form = document.querySelector("#addTeacherForm");
  //   const formDate = new FormData(form);
  //   console.log("hereeeee", formDate);
  //   axios
  //     .patch("http://localhost:3001/api/teachers", formDate, {
  //       headers: {
  //         "Content-Type": "multipart/form-date",
  //       },
  //     })
  //     .then(function (resp) {
  //       console.log("Я добавил");
  //     });
  // };
});

document.addEventListener("DOMContentLoaded", () => {
  // change input "Amount" of lessons according to btns (days of week)
  document
    .querySelectorAll("#btnDayOfWeek")
    .forEach((el) => el.addEventListener("click", countCheckedButtons));

  // document.querySelector(".btnAdminAdd").onclick = function (event) {
  //   // console.log("im here");
  //   const form = document.querySelector("form");
  //   // console.log("form 333", form);
  //   const formDate = new FormData(form);
  //   // const queryString = new URLSearchParams(data1).toString();
  //   // console.log("query string", queryString);
  //   // console.log("form for rest", data.get("hall"));
  //   axios
  //     .patch("http://localhost:3001/api/lessons", formDate, {
  //       headers: {
  //         "Content-Type": "multipart/form-date",
  //       },
  //     })
  //     .then(function (resp) {
  //       // console.log("999");
  //     });
  // };
});

// Update lesson
document.addEventListener("DOMContentLoaded", () => {
  let table = document.querySelectorAll(".table");
  // console.log(document.querySelectorAll(".btn-close"));
  let clickedIdForDel = -1;
  let targetIdForDel = -1;
  let rowForUpd = -1;

  document.querySelector(".table").onclick = function (event) {
    let target = event.target; // где был клик ?
    targetIdForDel = target.parentElement.parentElement;

    let confirmationDeleteModelBody = document.getElementById(
      "confirmationDeleteModelBody"
    );
    console.log("confirm that thai", confirmationDeleteModelBody);

    if (target.classList.value === "btn-close") {
      let TeacherOfClickedLesson =
        target.parentElement.previousElementSibling.innerHTML;

      let timeOfClickedLesson =
        target.parentElement.previousElementSibling.previousElementSibling
          .previousElementSibling.previousElementSibling.innerHTML;
      // console.log("timeOfClickedLesson", timeOfClickedLesson);
      let timeOfClickedLessonArr = timeOfClickedLesson.split(" "); // example: ['', '17', 'апр', '13:00', '']
      // console.log("timeOfClickedLessonArr", timeOfClickedLessonArr);

      openModal("confirmation");
      confirmationDeleteModelBody.children[0].innerHTML +=
        timeOfClickedLessonArr[1] +
        " " +
        timeOfClickedLessonArr[2] +
        " " +
        " в " +
        timeOfClickedLessonArr[3] +
        ", которое ведет " +
        TeacherOfClickedLesson +
        "?";
      // paragraph.appendChild(text);
      clickedIdForDel =
        +target.parentElement.previousElementSibling.previousElementSibling
          .previousElementSibling.previousElementSibling.previousElementSibling
          .innerHTML;
    } else if (target.classList.length == 1) {
      /* regular cells have one class (cell)
       * header cells have two classes (cell, title)
       */
      rowForUpd = target.parentElement;
      let rowForUpdId = target.parentElement.children[0].innerHTML;
      let rowForUpdDt = target.parentElement.attributes[1].value;
      let rowForUpdTime = target.parentElement.attributes[2].value;
      let rowForUpdHall = target.parentElement.children[2].innerHTML;
      let rowForUpdTpLesson = target.parentElement.children[3].innerHTML;
      let rowForUpdTeacher = target.parentElement.children[4].innerHTML;

      console.log(
        "TARGETTTT",
        target.parentElement.attributes[1].value,
        target.parentElement.attributes[2].value,
        rowForUpd
      );
      console.log(
        rowForUpdId,
        rowForUpdDt,
        rowForUpdHall,
        rowForUpdTpLesson,
        rowForUpdTeacher
      );
      openModal("updateLesson");
      // console.log(
      //   ".............",
      //   document.querySelectorAll("#updateLesson")[0].children[0].children[0]
      //     .children[1]
      // );
      document.getElementById("idLessonTime").value = rowForUpdTime;
      document.getElementById("lessonDt").value = rowForUpdDt;

      optionsLessonHall = document.getElementById("idLessonHall").children;

      Array.from(optionsLessonHall).forEach(function (element, idx) {
        if (element.innerHTML == +rowForUpdHall) {
          optionsLessonHall[idx].setAttribute("selected", "");
        }
      });

      let idLesson = document.getElementById("idLesson");
      idLesson.value = +rowForUpdId;
      let lessonDt = document.getElementById("lessonDt");
      let rowForUpdDtArr = rowForUpdDt.split(" ");
      console.log("row for upd ", rowForUpdDtArr);

      let selectedOption = rowForUpdTpLesson;
      console.log(rowForUpdTpLesson);
      axios
        .get("http://localhost:3001/teachers", {
          params: {
            tp_lesson: selectedOption,
          },
        })
        .then(function (response) {
          console.log("resp data", response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  document
    .getElementById("btnDelLessonAfterConfirmation")
    .addEventListener("click", (eventDel) => {
      console.log("eventDel", eventDel);

      console.log("clickedIdForDel", clickedIdForDel);
      console.log("Сейчас полетит аксиос", clickedIdForDel);

      axios
        .delete("http://localhost:3001/api/lessons", {
          data: { id: clickedIdForDel },
        })
        // .delete("http://localhost:3001/api/lessons", { date: "helloVera!!!" })
        .then(function (resp) {
          confirmationDeleteModelBody.children[0].innerHTML =
            "Вы уверены, что хотите удалить занятие ";
          closeModal("confirmation");
          targetIdForDel.remove();
          location.replace(location.href);
        })
        .catch(function (error) {
          console.log(error);
        });
    });

  document
    .getElementById("updateLessonBtn")
    .addEventListener("click", (eventUpd) => {
      console.log("eventUpd", eventUpd);
      let checksWerePassed = true;

      // Check
      // 1. time
      // 2. tp lesson

      let timeFromInput = document.getElementById("idLessonTime");
      console.log(timeFromInput.value);
      if (TIMEREGEX.test(timeFromInput.value)) {
        timeFromInput.classList.remove("is-invalid");
        checksWerePassed = checksWerePassed == false ? false : true;
      } else {
        timeFromInput.classList.add("is-invalid");
        checksWerePassed = false;
      }

      let tpLessonInput = document.getElementById("idTpLesson");
      console.log(tpLessonInput.value, tpLessonInput.value == "_____");
      if (tpLessonInput.value !== "_____") {
        tpLessonInput.classList.remove("is-invalid");
        checksWerePassed = checksWerePassed == false ? false : true;
      } else {
        tpLessonInput.classList.add("is-invalid");
        checksWerePassed = false;
      }

      let formDate = new FormData(document.getElementById("updateLessonForm"));
      if (checksWerePassed == true) {
        axios
          .post("http://localhost:3001/api/lessons", formDate, {
            headers: {
              "Content-Type": "multipart/form-date",
            },
          })
          // .delete("http://localhost:3001/api/lessons", { date: "helloVera!!!" })
          .then(function (resp) {
            console.log("прилетело", resp.data);
            closeModal("updateLesson");
            location.replace(location.href); // ----------

            // rowForUpd.children[0].innerHTML;

            // confirmationDeleteModelBody.children[0].innerHTML =
            //   "Вы уверены, что хотите удалить занятие ";
            // closeModal("confirmation");
            // targetIdForDel.remove();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
});

// удалить модальное окно после нажатия на кнопки "Отмена" или крестик
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#btnСlose").forEach(function (el) {
    // console.log(el);
    el.addEventListener("click", (eventClose) => {
      let target = eventClose.target;
      // console.log("1 - Closed clicked", eventClose);
      // console.log("2 - el", el);
      // console.log("-------------------------------------");
      // console.log(target);
      confirmationDeleteModelBody.children[0].innerHTML =
        "Вы уверены, что хотите удалить занятие ";
      let closestModel = target.closest(".modal");
      closeModal(closestModel.id);
    });
  });
});

function countCheckedButtons() {
  let allBtns = document.querySelectorAll(".btn-check");
  let checkedBtns = [];
  allBtns.forEach((el) => {
    if (el.checked === true) {
      checkedBtns.push(el);
    }
  });
  // если количество выбранных дней в поле "Количество" меньше, чем
  // кол-во выбранных дней недели (buttons)
  let textInAmounInput = document.getElementById("reAmount");
  if (textInAmounInput.value < checkedBtns.length) {
    textInAmounInput.value = checkedBtns.length;
  }
}

function openModal1(id) {
  const modal = document.getElementById(id);
  modal.classList.toggle("show");
  modal.style.display = "block";
  document.body.classList.add("modal-open");
  document
    .querySelector(".container")
    .insertAdjacentHTML(
      "afterend",
      '<div class="modal-backdrop fade show"></div>'
    );
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.toggle("show");
  modal.style.display = "block";
  document.body.classList.add("modal-open");
  let mainContainer = document.querySelector(".container");

  const div = document.createElement("div");
  div.classList.add("modal-backdrop");
  div.classList.add("fade");
  div.classList.add("show");
  // mainContainer.appendChild(p);
  // input.classList.add("form-control");
  // input.classList.add("timeMask");
  mainContainer.append(div);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
  document
    .querySelector(".modal-backdrop")
    .classList.remove("modal-backdrop", "fade", "show");
}

// const getDatePickerTitle = (elem) => {
//   // From the label or the aria-label
//   const label = elem.nextElementSibling;
//   let titleText = "";
//   if (label && label.tagName === "LABEL") {
//     titleText = label.textContent;
//   } else {
//     titleText = elem.getAttribute("aria-label") || "";
//   }
//   return titleText;
// };

// const elems = document.querySelectorAll(".datepicker_input");
// for (const elem of elems) {
//   const datepicker = new Datepicker(elem, {
//     format: "dd/mm/yyyy", // RU format
//     title: getDatePickerTitle(elem),
//   });
// }
