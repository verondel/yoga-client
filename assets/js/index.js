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

// getUser()

// document.getElementById("hello").addEventListener("click", function(){
//   alert("Hello World!");
// });

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

// document.querySelector(".btnFirst").addEventListener("click", () => {

// });

document.addEventListener("DOMContentLoaded", () => {
  let flag = 0;
  let axiosFlag = false;
  document.getElementById("table").onclick = function (event) {
    event.stopPropagation();

    let target = event.target; // где был клик?
    console.log("1.0 - ", event);
    console.log("1.1 - ATTRIBUTES", target.attributes.id.value);
    // console.log(Object.values(target.attributes).includes("id"));

    if (
      target.tagName == "DIV" &&
      Object.values(target.attributes).length > 2
    ) {
      openModal("phoneModal");
      let id_lesson = target.attributes.id.value;
      let id_tp_lesson = target.attributes.id_tp_lesson.value;
      let strDt = target.attributes.strdt.value;
      let strTime = target.attributes.strtime.value;
      let strTeacher = target.attributes.strteacher.value;
      let tp_lesson = target.attributes.tp_lesson.value;

      let newStrDt = strDt.split("").join("");
      console.log("     2.01 - ", strDt, "  before btnPhoneModal ");
      console.log("        newStrDt", newStrDt);

      // if (axiosCounter == 0) {
      // if (!axiosFlag) {
      document.querySelector(".btnPhoneModal").addEventListener("click", () => {
        // axiosCounter += 1;
        let data = document.querySelector(".i-1").value;

        console.log("     2.1 - ", strDt, newStrDt, "  before axios ");

        // console.log(
        //   id_lesson,
        //   id_tp_lesson,
        //   strDt,
        //   strTeacher,
        //   strTime,
        //   tp_lesson
        // );

        // console.log("     0.2 - ", strDt);
        patternPhone = /^\+7\([0-9]{3}\)[0-9]{3}\-[0-9]{2}\-[0-9]{2}$/;

        if (patternPhone.test(data) && newStrDt == strDt) {
          closeModal("phoneModal");
          console.log("     2.2 - ", strDt, "  before axios ");

          axios
            .get("http://localhost:3001/attempt", {
              params: {
                phone: data,
                strDt: strDt,
                strTime: strTime,
              },
            })
            .then(function (response) {
              console.log("     2.3 - ", strDt, "  after axios ");
              // console.log(response.data); // user is not in the system
              // console.log(response.data.length);

              // Registration -----------------------------------------------------
              if (response.data.length != 1) {
                // todo ДОБАВИТЬ РЕГИСТРАЦИЮ
                openModal("registrationModal");

                let newPhone = document.querySelector(".i-1").value;
                document.getElementById("staticPhoneInRegistration").value =
                  newPhone;
                console.log(
                  document.getElementById("staticPhoneInRegistration")
                );

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

                // open the new one
              } else {
                // BOOK ---------------------------------------------------

                console.log("     2.4 - ", strDt, "  in else");
                // console.log("data response 1", response.data);
                if (flag == 0) {
                  flag = 1;
                  console.log("Open Model");
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

                  let dt_begin = new Date(
                    response.data[0].dt_begin
                  ).toLocaleDateString("ru-RU", options);

                  let dt_end = new Date(
                    response.data[0].dt_end
                  ).toLocaleDateString("ru-RU", options);

                  // document.getElementById('startDt').innerHTML =`${dt_begin}`
                  // document.getElementById('endDt').innerHTML = `${dt_end}`
                  document.getElementById(
                    "amount"
                  ).innerHTML = `${response.data[0].amount}`;

                  document.getElementById("startDt").value = `${dt_begin}`;
                  document.getElementById("endDt").value = `${dt_end}`;

                  let bookLesson = document.getElementById("bookLesson");
                  bookLesson.innerHTML = `${tp_lesson}  ${strDt} в ${strTime}  ${strTeacher}`;

                  document
                    .querySelector(".btnBookModel")
                    .addEventListener("click", () => {
                      axios
                        .patch("http://localhost:3001/api/book", {
                          data: { vera: "vera" },
                        })
                        .then(function (resp) {
                          console.log("respresp", resp);
                          if (resp.data == "-1") {
                            console.log("TOTAL ERROR");
                          } else {
                            console.log("add new book");
                          }
                        });
                    });
                  // document.getElementById('amount').value = `${response.data[0].amount}`
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
      });
      // }
      // axiosFlag = true;
    }
  };

  function openModal(id) {
    // axiosCounter = 1;
    console.log("2.0 - OM", id);
    const modal = document.getElementById(id);
    modal.classList.toggle("show");
    modal.style.display = "block";
    document.body.classList.add("modal-open");

    // let newDiv = document.createElement("div");
    // newDiv.classList.add("modal-backdrop", "fade", "show");

    // console.log("newDiv = ", newDiv);

    document
      .querySelector(".container")
      .insertAdjacentHTML(
        "afterend",
        '<div class="modal-backdrop fade show" id="delMeToClose"></div>'
      );
  }

  function closeModal(id) {
    flag = 0;
    const modal = document.getElementById(id);
    while (
      document.querySelector(".container").nextSibling.id == "delMeToClose"
    ) {
      console.log(
        "         NXT NXT",
        document.querySelector(".container").nextSibling.id
      );
      // document.querySelector("#delMeToClose")
      document.querySelector(".container").nextSibling.remove();
    }
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");

    // let modalBackdrop = document.querySelector(".modal-backdrop");
    // console.log("modalBackdrop", modalBackdrop);
    // if (modalBackdrop !== null) {

    // .classList.remove("modal-backdrop", "fade", "show");
    // }
  }

  document.querySelectorAll("#btnСlose").forEach(function (el) {
    el.addEventListener("click", (event) => {
      console.log(
        "------------------------------------------------------------"
      );
      let target = event.target;
      let closestModel = target.closest(".modal");

      if (target.classList.value.includes("clearBook")) {
        document.getElementById("bookLesson").innerHTML = "";
      }
      // console.log("cmID", closestModel.id);
      closeModal(closestModel.id);
    });
  });

  // document.getElementsByTagName('table').addEventListener('click', (event) => {
  //   let td = event.target.closest('td'); // (1)
  //   console.log('event')
  //   if (!td) return; // (2)
  //   if (!table.contains(td)) return; // (3)
  //   highlight(td); // (4)
  // });

  // function highlight(td) {
  //   if (selectedTd) { // убрать существующую подсветку, если есть
  //     selectedTd.classList.remove('highlight');
  //   }
  //   selectedTd = td;
  //   selectedTd.classList.add('highlight'); // подсветить новый td
  // }
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#btnRegistration").onclick = function (event) {
    const form = document.querySelector("#registrationForm");
    const formDate = new FormData(form);
    let formDateKeys = [];
    let checksWerePassed = true;

    for (const key of formDate.keys()) {
      formDateKeys.push(key);
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

    let formDateUniqueKeys = new Set(formDateKeys);
    console.log(
      "Unique form date keys one",
      formDateUniqueKeys,
      formDateUniqueKeys.size
    );
    if (checksWerePassed == true) {
      console.log("AXIOS");
      axios
        .patch("http://localhost:3001/api/registration", formDate, {
          headers: {
            "Content-Type": "multipart/form-date",
          },
        })
        .then(function (resp) {
          console.log("respresp", resp);
          if (resp.data == "-1") {
            console.log("TOTAL ERROR");
          }
        });
    } else {
      console.log("NOT AXIOS");
    }
  };
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

// Close button
// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll("#btnСlose").forEach(function (el) {
//     el.addEventListener("click", (event) => {
//       let target = event.target;
//       console.log(target);
//       let closestModel = target.closest(".modal");
//       closeModal(closestModel.id);
//     });
//   });
// });

// document.addEventListener("DOMContentLoaded", () => {

//   document.querySelector('.b-2').addEventListener('click', () =>{
//     let data = document.querySelector('.i-2').value;
//     console.log('from input', data)

//     axios.get('http://localhost:3001/attempt', {
//       params: {
//         phone : data
//       }
//     })
//     .then(function (response) {
//       console.log(response.data); // user is not in the system
//       if (response.data.length == 0){
//         console.log('такого пользователя нет')
//       }else{ // есть
//         // close old modal
//         const phoneModal = document.getElementById("phoneModal");
//         phoneModal.classList.remove('show'); // add?
//         phoneModal.style.display = "none";
//         document.body.classList.remove('modal-open')

//         // open the new one
//         const lessonModal = document.getElementById("lessonModal");
//         lessonModal.classList.toggle('show'); // add?
//         lessonModal.style.display = "block";
//         document.body.classList.add('modal-open');
//         document.getElementById("staticPhone").value = `${response.data[0].phone}`

//         console.log('sec', lessonModal)
//       }
//     })
//     .catch(function (error) {
//       console.log(error); // выкидывай
//     })
//     .finally(function () {
//       // always runs

//     });
//   })
// });

// let mask = new IMask(
//   (document.getElementById('validationCustom01')),
//   {
//     mask: '+7(000)000-00-00',
//     lazy: false
//   }
// );
// console.log('h',mask)

// // По желанию вышеуказанный запрос можно выполнить так
// axios.get('/attempt', {
//   params: {
//     data
//   }
// })
// .then(function (response) {
//   console.log(response); // новая форма
// })
// .catch(function (error) {
//   console.log(error); // выкидывай
// })
// .finally(function () {
//   // выполняется всегда
// });

// Пример стартового JavaScript для отключения отправки форм при наличии недопустимых полей
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
