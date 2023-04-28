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

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".btnFirst").addEventListener("click", () => {
    openModal("phoneModal");
  });

  document.querySelector(".btnPhoneModal").addEventListener("click", () => {
    let data = document.querySelector(".i-1").value;

    patternPhone = /^\+7\([0-9]{3}\)[0-9]{3}\-[0-9]{2}\-[0-9]{2}$/;
    if (patternPhone.test(data)) {
      closeModal("phoneModal");
      axios
        .get("http://localhost:3001/attempt", {
          params: {
            phone: data,
          },
        })
        .then(function (response) {
          // console.log(response.data); // user is not in the system
          console.log(response.data.length);

          // Registration -----------------------------------------------------
          if (response.data.length != 1) {
            // todo ДОБАВИТЬ РЕГИСТРАЦИЮ
            openModal("registrationModal");
            let newPhone = document.querySelector(".i-1").value;
            document.getElementById("staticPhoneInRegistration").value =
              newPhone;
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

            // open the new one
          } else {
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
            let dt_end = new Date(response.data[0].dt_end).toLocaleDateString(
              "ru-RU",
              options
            );
            // document.getElementById('startDt').innerHTML =`${dt_begin}`
            // document.getElementById('endDt').innerHTML = `${dt_end}`
            document.getElementById(
              "amount"
            ).innerHTML = `${response.data[0].amount}`;
            document.getElementById("startDt").value = `${dt_begin}`;
            document.getElementById("endDt").value = `${dt_end}`;
            // document.getElementById('amount').value = `${response.data[0].amount}`

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

  // function openCloseModal(statement, id) {
  //   const modal = document.getElementById(id);
  //   if (statement === "open") {
  //     modal.classList.toggle("show");
  //     modal.style.display = "block";
  //     document.body.classList.add("modal-open");
  //     document
  //       .querySelector(".container")
  //       .insertAdjacentHTML(
  //         "afterend",
  //         '<div class="modal-backdrop fade show">hello</div>'
  //       );
  //   } else if (statement === "close") {
  //     modal.classList.remove("show");
  //     modal.style.display = "none";
  //     document.body.classList.remove("modal-open");
  //     document
  //       .querySelector(".modal-backdrop")
  //       .classList.remove("modal-backdrop", "fade", "show");
  //   } else {
  //     console.log("error!");
  //   }
  // }

  function openModal(id) {
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

  function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
    document
      .querySelector(".modal-backdrop")
      .classList.remove("modal-backdrop", "fade", "show");
  }

  document.querySelectorAll("#btnСlose").forEach(function (el) {
    el.addEventListener("click", (event) => {
      let target = event.target;
      // console.log(target);
      let closestModel = target.closest(".modal");
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
  document.getElementById("table").onclick = function (event) {
    let target = event.target; // где был клик?
    console.log(target);
    if (target.tagName != "TD") return; // не на TD? тогда не интересует
    // highlight(target); // подсветить TD
  };
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
