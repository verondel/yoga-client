// const { default: axios } = require("axios");

document.addEventListener("DOMContentLoaded", () => {
  let element = document.getElementById("phoneMask");
  // console.log('h',element)
  let maskOptions = {
    mask: "+7(000)000-00-00",
    lazy: false,
  };
  let mask = new IMask(element, maskOptions);
});

document.addEventListener("DOMContentLoaded", () => {
  let element = document.getElementById("dtBirth");
  console.log("h", element);
  let maskOptions = {
    mask: Date,
    min: new Date(1930, 0, 1),
    max: new Date(2008, 4, 1),
    lazy: false,
  };
  let mask = new IMask(element, maskOptions);
});

// -----------------------------------------------------------------

const eventSource = new EventSource("http://localhost:3001/sse-endpoint");
eventSource.onmessage = console.log;

document.addEventListener("DOMContentLoaded", () => {
  eventSource.addEventListener("message", (event) => {
    // console.log("Получено новое сообщение:", event.data);
    if (event.data == "1") {
      location.replace(location.href);
    }
  });
  eventSource.addEventListener("open", () => {
    // console.log("Соединение установлено");
  });
  eventSource.addEventListener("error", (event) => {
    // console.error("Ошибка соединения:", event);
  });
});

// -----------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  let flag = 0;
  let axiosFlag = false;
  let globalTarget = 0;
  document.getElementById("table").onclick = function (event) {
    event.stopPropagation();

    let target = event.target; // где был клик?
    globalTarget = event.target;
    console.log("1.0 - ", event);
    console.log("1.1 - ATTRIBUTES", target.attributes.id.value);
    // console.log(Object.values(target.attributes).includes("id"));

    if (
      target.tagName == "DIV" &&
      Object.values(target.attributes).length > 2
    ) {
      openModal("phoneModal");
      // let id_lesson = target.attributes.id.value;
      // let id_tp_lesson = target.attributes.id_tp_lesson.value;
      // let strDt = target.attributes.strdt.value;
      // let strTime = target.attributes.strtime.value;
      // let strTeacher = target.attributes.strteacher.value;
      // let tp_lesson = target.attributes.tp_lesson.value;

      // let newStrDt = strDt.split("").join("");
      // console.log("     2.01 - ", strDt, "  before btnPhoneModal ");
      // console.log("        newStrDt", newStrDt);

      // if (axiosCounter == 0) {
      // if (!axiosFlag) {

      document
        .querySelector(".btnPhoneModal")
        .removeEventListener("click", main);

      document.querySelector(".btnPhoneModal").addEventListener("click", main);
      // }
      // axiosFlag = true;
    }
  };

  function main() {
    console.log(globalTarget);
    let target = globalTarget;
    let id_lesson = target.attributes.id.value;
    let id_tp_lesson = target.attributes.id_tp_lesson.value;
    let strDt = target.attributes.strdt.value;
    let strTime = target.attributes.strtime.value;
    let dtTd = target.attributes.dtTd.value;
    let dtTdTS = new Date(dtTd).getTime();
    let strTeacher = target.attributes.strteacher.value;
    let tp_lesson = target.attributes.tp_lesson.value;

    // let newStrDt = strDt.split("").join("");
    // axiosCounter += 1;
    let phone = document.querySelector(".i-1").value;

    console.log("     2.1 - ", strDt, "  before axios "); // newStrDt,
    patternPhone = /^\+7\([0-9]{3}\)[0-9]{3}\-[0-9]{2}\-[0-9]{2}$/;

    if (patternPhone.test(phone)) {
      // && newStrDt == strDt
      closeModal("phoneModal");
      console.log("     2.2 - ", strDt, "  before axios ");

      // Axios: поиск в базе клиента по номеру телефона,
      // output = s.dt_begin, s.dt_end, s.amount, c.full_name, c.id, c.phone
      axios
        .get("http://localhost:3001/attempt", {
          params: {
            phone: phone,
          },
        })
        .then(function (response) {
          console.log("     2.3 - ", strDt, "  after axios ");
          console.log("response data length = ", response.data);

          // Клиента с введенным номером телефона не существует
          if (response.data == -1) {
            // Registration -----------------------
            openModal("registrationModal");
            registrationLogic(
              strDt,
              strTime,
              strTeacher,
              tp_lesson,
              id_lesson,
              dtTd
            );
          } else {
            // BOOK ---------------------------------------
            // Если
            // 1. На абонементе больше нуля занятий
            // 2. Срок действия абонемента валиден на день занятия

            let dt_begin = new Date(response.data[0].dt_begin);
            let dt_beginTS = dt_begin.getTime();
            let dt_end = new Date(response.data[0].dt_end);
            let dt_endTS = dt_end.getTime();
            let amount = response.data[0].amount;
            let full_name = response.data[0].full_name;
            let clientName = full_name.split(" ")[1];
            let id_client = response.data[0].id;

            // Проверка
            if (amount > 0 && dtTdTS >= dt_beginTS && dtTdTS <= dt_endTS) {
              bookLogic(
                flag,
                response,
                dt_begin,
                dt_end,
                tp_lesson,
                strDt,
                strTime,
                strTeacher,
                id_client,
                id_lesson,
                dtTd,
                amount,
                clientName
              );
            } else {
              // Абонемент недействителен
              openModal("buySubscrition");
              console.log(dtTdTS <= dt_endTS, dtTdTS >= dt_beginTS, amount > 0);
              let problemSpan = document.getElementById("problem");

              if (!(dtTdTS >= dt_beginTS)) {
                problemSpan.innerHTML =
                  "Ваш абонемент ещё не начал действовать";
                console.log("Абонемент ещё не начал действовать");
              } else if (!(dtTdTS <= dt_endTS)) {
                console.log("Срок действия истек");
                problemSpan.innerHTML = "Cрок действия Вашего абонемента истек";
              } else if (amount <= 0) {
                console.log("Количество занятий закончилось");
                problemSpan.innerHTML =
                  "Количество занятий на Вашем абонементе закончилось";
              }
              document
                .querySelector(".subscriptionModal")
                .addEventListener("click", () => {
                  /// VERA HERE WE ARE
                  const form = document.querySelector("#subsctiptionForm");
                  const formData = new FormData(form);
                  formData.append("id_client", id_client);
                  formData.append("dtLesson", dtTd);
                  axios
                    .patch("http://localhost:3001/api/subsctiption", formData, {
                      headers: {
                        "Content-Type": "multipart/form-date",
                      },
                    })
                    .then(function (resp) {
                      console.log("кто-то купил абонемент");
                      closeModal("buySubscrition");
                      bookLogic(
                        flag,
                        response,
                        dt_begin,
                        dt_end,
                        tp_lesson,
                        strDt,
                        strTime,
                        strTeacher,
                        id_client,
                        id_lesson,
                        dtTd,
                        amount,
                        clientName
                      );
                    });
                });
            }
            // console.log('sec', lessonModal)
          }
        })
        .catch(function (error) {
          console.log("error!", error); // выкидывай
        })
        .finally(function () {
          // always runs
        });
    } else {
      document.querySelector(".i-1").classList.add("is-invalid");
      document.getElementById("phoneHelpBlock").innerHTML = "";
    }
  }

  document.querySelectorAll("#btnСlose").forEach(function (el) {
    el.addEventListener("click", (event) => {
      console.log(
        "------------------------------------------------------------"
      );
      let target = event.target;
      let closestModel = target.closest(".modal");

      console.log(target.classList.value);
      if (target.classList.value.includes("clearBook")) {
        document.getElementById("bookLesson").innerHTML = "";
      }
      // console.log("cmID", closestModel.id);
      closeModal(closestModel.id);
    });
  });
});

// Создать эффект, чтобы занятие парило над таблицей
// (удалить border-bottom у всех элементов, которые заходят на границу времени
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[delborder='true']").forEach(function (el) {
    el.parentElement.style.borderBottom = "0px";
  });
});

// table ВСПЛЫТИЕ
document.addEventListener("DOMContentLoaded", () => {
  // document.getElementById("table").onclick = function (event) {
  //   let target = event.target; // где был клик?
  //   if (target.tagName == "DIV") {
  //     console.log(target);
  //   } // не на TD? тогда не интересует
  //   // highlight(target); // подсветить TD
  // };
});

function registrationLogic(
  strDt,
  strTime,
  strTeacher,
  tp_lesson,
  id_lesson,
  dtTd
) {
  let newPhone = document.querySelector(".i-1").value;
  document.getElementById("staticPhoneInRegistration").value = newPhone;
  console.log(document.getElementById("staticPhoneInRegistration"));

  // todo маска для ФИО
  let passport = document.getElementById("passportMask");
  console.log("h", passport);
  let maskOptions = {
    mask: "0000 000000",
    lazy: false,
  };
  let mask = new IMask(passport, maskOptions);

  // const phoneModal = document.getElementById("phoneModal");
  // phoneModal.classList.remove("show"); // add?
  // phoneModal.style.display = "none";
  // document.body.classList.remove("modal-open");

  console.log("тут могла бы быть ваша регистрация");

  document.querySelector("#btnRegistration").onclick = function (event) {
    const form = document.querySelector("#registrationForm");
    const formData = new FormData(form);
    let formDataKeys = [];
    let checksWerePassed = true;

    for (const key of formData.keys()) {
      formDataKeys.push(key);
      console.log(key);
    }
    let fullNameInput = document.getElementById("nameMask");
    let dtBirth = document.getElementById("dtBirth");
    let agreementCheckBox = document.getElementById("agreementCheckBox");
    console.log(agreementCheckBox);
    /* Валидация
     * 1. Введено ли ФИО
     * 2. TODO: Дата рождения
     * 3. TODO: Серия и номер паспорта
     * 4. TODO: email
     * 5. Согласие на обработку
     */

    if (fullNameInput.value !== "") {
      fullNameInput.classList.remove("is-invalid");
      checksWerePassed = checksWerePassed == false ? false : true;
      console.log("Stage 1 - yes", checksWerePassed);
    } else {
      fullNameInput.classList.add("is-invalid");
      checksWerePassed = false;
      console.log("Stage 1 - no", checksWerePassed);
    }

    if (agreementCheckBox.checked !== false) {
      agreementCheckBox.classList.remove("is-invalid");
      checksWerePassed = checksWerePassed == false ? false : true;
      console.log("Stage 2 - yes", checksWerePassed);
    } else {
      agreementCheckBox.classList.add("is-invalid");
      checksWerePassed = false;
      console.log("Stage 2 - no", checksWerePassed);
    }

    let formDataUniqueKeys = new Set(formDataKeys);
    console.log(
      "Unique form date keys one",
      formDataUniqueKeys,
      formDataUniqueKeys.size
    );
    if (checksWerePassed == true) {
      console.log("AXIOS FOR REGISTRATION");
      axios
        .patch("http://localhost:3001/api/registration", formData, {
          headers: {
            "Content-Type": "multipart/form-date",
          },
        })
        .then(function (resp) {
          console.log("respresp", resp.data);
          closeModal("registrationModal");

          let id = resp.data.id;
          let name = resp.data.name;

          // Подтверждение пробного занятия --------------------------------------
          openModal("firstLessonModal");
          let divClient = document.getElementById("clientNameFirstLesson");
          divClient.innerHTML = name;

          let spanTpLesson = document.getElementById("tpLessonFirstLesson");
          spanTpLesson.innerHTML = tp_lesson;

          let spanDt = document.getElementById("dtFirstLesson");
          spanDt.innerHTML = `${strDt} в ${strTime}`;

          let spanTeacher = document.getElementById("teacherFirstLesson");
          spanTeacher.innerHTML = strTeacher;

          document.querySelector(".btnFirstBookModal").onclick = function (
            event
          ) {
            console.log(
              "smb has just pressed btnFirstBookModal, next is api/book"
            );
            // add subscribtion, add book for TRIAL LESSON
            axios
              .patch("http://localhost:3001/api/book", {
                data: {
                  trialLesson: true,
                  id_client: id,
                  id_lesson: +id_lesson,
                  timeLesson: dtTd,
                  // ########
                },
              })
              .then(function (response) {
                closeModal("firstLessonModal");
                openModal("waitingYouModal");

                let spanClient = document.getElementById("clientNameWaiting");
                spanClient.innerHTML = name;
                console.log("everything there", spanClient, name);

                document.querySelector(".btnWaitingYouModal").onclick =
                  function (event) {
                    closeModal("waitingYouModal");
                    location.replace(location.href);
                  };
              });
          };
        });
    } else {
      console.log("NOT AXIOS");
    }
  };
}

function openModal(id) {
  // axiosCounter = 1;
  console.log("2.0 - OM", id);
  const modal = document.getElementById(id);
  modal.classList.toggle("show");
  modal.style.display = "block";
  document.body.classList.add("modal-open");

  // let newDiv = document.createElement("div");
  // newDiv.classList.add("modal-backdrop", "fade", "show");
  document
    .querySelector(".container")
    .insertAdjacentHTML(
      "afterend",
      '<div class="modal-backdrop fade show" id="delMeToClose"></div>'
    );
  document.getElementById("hidden").style.overflow = "hidden";
}

function closeModal(id) {
  flag = 0;
  console.log("CLOSE MODAL");
  const modal = document.getElementById(id);
  while (
    document.querySelector(".container").nextSibling.id == "delMeToClose"
  ) {
    console.log(
      "         NXT NXT",
      document.querySelector(".container").nextSibling.id
    );
    document.querySelector(".container").nextSibling.remove();
  }
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
  document.getElementById("hidden").style.overflow = "auto";
}

function bookLogic(
  flag,
  response,
  dt_begin,
  dt_end,
  tp_lesson,
  strDt,
  strTime,
  strTeacher,
  id_client,
  id_lesson,
  dtTd,
  amount,
  clientName
) {
  // console.log("     2.4 - ", strDt, "  in else");
  // console.log("data response 1", response.data);
  if (flag == 0) {
    flag = 1;
    // console.log("Open Model");
    openModal("lessonModal");
    document.getElementById(
      "staticPhoneInLesson"
    ).value = `${response.data[0].phone}`;

    document.getElementById("client_name").innerHTML = `${
      response.data[0].full_name.split(" ")[1]
    }`;

    let options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    let dt_beginLS = dt_begin.toLocaleDateString("ru-RU", options);
    let dt_endLS = dt_end.toLocaleDateString("ru-RU", options);

    document.getElementById("amount").innerHTML = `${response.data[0].amount}`;

    document.getElementById("startDt").value = `${dt_beginLS}`;
    document.getElementById("endDt").value = `${dt_endLS}`;

    let spanTpLesson = document.getElementById("tp_lesson");
    spanTpLesson.innerHTML = `${tp_lesson}`;

    let spanDtLesson = document.getElementById("dt");
    spanDtLesson.innerHTML = `${strDt} в ${strTime}`;

    let spanTeacher = document.getElementById("teacher");
    spanTeacher.innerHTML = `${strTeacher}`;

    // console.log(tp_lesson, strDt, strTime, strTeacher);
    document.querySelector(".btnBookModal").addEventListener("click", () => {
      console.log("not first book in your life ");
      let trialLesson = false;
      axios
        .patch("http://localhost:3001/api/book", {
          data: {
            trialLesson: trialLesson,
            id_client: id_client,
            id_lesson: +id_lesson,
            timeLesson: dtTd,
            amount: amount,
            hello: "world",
          },
        })
        .then(function (resp) {
          console.log("resp after booking lesson", resp);
          closeModal("lessonModal");
          openModal("waitingYouModal");
          let spanClient = document.getElementById("clientNameWaiting");
          spanClient.innerHTML = clientName;

          document.querySelector(".btnWaitingYouModal").onclick = function () {
            closeModal("waitingYouModal");
            console.log("replace--------");
            location.replace(location.href);
          };
        });
    });
    // document.getElementById('amount').value = `${response.data[0].amount}`
  }
}

// для отключения отправки форм при наличии недопустимых полей
(function () {
  "use strict";

  // Получите все формы, к которым мы хотим применить пользовательские стили проверки Bootstrap
  var forms = document.querySelectorAll(".needs-validation");
  // console.log('forms', forms)

  // Зацикливайтесь на них и предотвращайте отправку
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// Делаем запрос пользователя с данным ID
// axios.get('/user?ID=hello')
//   .then(function (response) {
//     // обработка успешного запроса
//     console.log(response);
//   })
//   .catch(function (error) {
//     // обработка ошибки
//     console.log(error);
//   })
//   .finally(function () {
//     // выполняется всегда
//   });

// Хотите использовать async/await? Добавьте ключевое слово `async` к своей внешней функции/методу.
// async function getUser() {
//   try {
//     const response = await axios.get('http://localhost:3001/users?ID=1');
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// }
