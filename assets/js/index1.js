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
  document.querySelector(".b-1").addEventListener("click", () => {
    let data = document.querySelector(".i-1").value;
    // console.log("from input", data);

    patternPhone = /^\+7\([0-9]{3}\)[0-9]{3}\-[0-9]{2}\-[0-9]{2}$/;
    if (patternPhone.test(data)) {
      console.log("успех");
      axios
        .get("http://localhost:3001/attempt", {
          params: {
            phone: data,
          },
        })
        .then(function (response) {
          // console.log(response.data); // user is not in the system
          console.log(response.data.length);
          if (response.data.length != 1) {
            // todo ДОБАВИТЬ РЕГИСТРАЦИЮ
            // const phone_modal = document.getElementById("phone_modal");
            // phone_modal.classList.remove("show"); // add?
            // phone_modal.style.display = "none";
            // document.body.classList.remove("modal-open");
            console.log("тут могла бы быть ваша регистрация");

            // open the new one
          } else {
            // есть
            // close old modal
            const phone_modal = document.getElementById("phone_modal");
            phone_modal.classList.remove("show"); // add?
            phone_modal.style.display = "none";
            document.body.classList.remove("modal-open");

            // open the new one

            const second_modal = document.getElementById("second_modal");
            second_modal.classList.toggle("show"); // add?
            second_modal.style.display = "block";
            document.body.classList.add("modal-open");
            document.getElementById(
              "static_phone"
            ).value = `${response.data[0].phone}`;

            document.getElementById(
              "client_name"
            ).innerHTML = `${response.data[0].full_name}`;

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
            // document.getElementById('start_date').innerHTML =`${dt_begin}`
            // document.getElementById('end_date').innerHTML = `${dt_end}`
            document.getElementById(
              "amount"
            ).innerHTML = `${response.data[0].amount}`;
            document.getElementById("start_date").value = `${dt_begin}`;
            document.getElementById("end_date").value = `${dt_end}`;
            // document.getElementById('amount').value = `${response.data[0].amount}`

            // console.log('sec', second_modal)
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

  function closeOpenModal(statement, id) {
    if (statement === "open") {
    } else {
    }
  }

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

// table
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("table").onclick = function (event) {
    let target = event.target; // где был клик?
    // console.log(target)
    if (target.tagName != "TD") return; // не на TD? тогда не интересует
    // highlight(target); // подсветить TD
  };
});

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
//         const phone_modal = document.getElementById("phone_modal");
//         phone_modal.classList.remove('show'); // add?
//         phone_modal.style.display = "none";
//         document.body.classList.remove('modal-open')

//         // open the new one
//         const second_modal = document.getElementById("second_modal");
//         second_modal.classList.toggle('show'); // add?
//         second_modal.style.display = "block";
//         document.body.classList.add('modal-open');
//         document.getElementById("static_phone").value = `${response.data[0].phone}`

//         console.log('sec', second_modal)
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
