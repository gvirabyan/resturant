
function updateCheckoutButtonVisibility() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    const hasItems = Object.keys(cart).length > 0;
    const button = document.getElementById('checkoutButton');
    button.style.display = hasItems ? 'block' : 'none';
  }
  
/*==================== SHOW MENU ====================*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId)

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show-menu')
        })
    }
}
showMenu('nav-toggle', 'nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))



/*---------------- */
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.menu__button');
  
    buttons.forEach(button => {
      button.addEventListener('click', function (event) {
        event.preventDefault();
  
        const menuItem = button.closest('.menu__content');
        const name = menuItem.querySelector('.menu__name').textContent.trim();
        const controls = menuItem.querySelector('.quantity-controls');
  
        // Показать блок с количеством
        controls.style.display = 'flex';
  
        // Установить начальное значение 1 и сохранить в localStorage
        const countSpan = controls.querySelector('.qty-count');
        let count = 1;
  
        countSpan.textContent = count;
        saveToStorage(name, count);
        updateCheckoutButtonVisibility(); // ✅ добавить!

      });
    });
  
    // Обработчики для + и −
    document.querySelectorAll('.qty-increase').forEach(button => {
      button.addEventListener('click', function () {
        const controls = this.closest('.quantity-controls');
        const countSpan = controls.querySelector('.qty-count');
        const name = controls.closest('.menu__content').querySelector('.menu__name').textContent.trim();
  
        let count = parseInt(countSpan.textContent);
        count++;
        countSpan.textContent = count;
        saveToStorage(name, count);
        updateCheckoutButtonVisibility(); // ✅ добавить!

      });
    });
  
    document.querySelectorAll('.qty-decrease').forEach(button => {
      button.addEventListener('click', function () {
        const controls = this.closest('.quantity-controls');
        const countSpan = controls.querySelector('.qty-count');
        const name = controls.closest('.menu__content').querySelector('.menu__name').textContent.trim();
  
        let count = parseInt(countSpan.textContent);
        if (count > 1) {
            count--;
            countSpan.textContent = count;
            saveToStorage(name, count);
            updateCheckoutButtonVisibility(); // ✅ добавить!

          } else {
            // Скрываем блок, если дошли до 1 и нажали
            controls.style.display = 'none';
           // localStorage.removeItem('cart'); // или удаляем только этот товар:
            let cart = JSON.parse(localStorage.getItem('cart')) || {};
            delete cart[name];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCheckoutButtonVisibility();

          }
      });
    });
  
    // При загрузке — восстановим из localStorage
    restoreFromStorage();
  
    function saveToStorage(name, count) {
      let cart = JSON.parse(localStorage.getItem('cart')) || {};
      cart[name] = count;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  
    function restoreFromStorage() {
      let cart = JSON.parse(localStorage.getItem('cart')) || {};
      document.querySelectorAll('.menu__content').forEach(menuItem => {
        const name = menuItem.querySelector('.menu__name').textContent.trim();
        const controls = menuItem.querySelector('.quantity-controls');
        const countSpan = controls.querySelector('.qty-count');
  
        if (cart[name]) {
          controls.style.display = 'flex';
          countSpan.textContent = cart[name];
        }
      });

      updateCheckoutButtonVisibility();

      const confirmedOrder = JSON.parse(localStorage.getItem('confirmedOrder'));
      if (confirmedOrder && confirmedOrder.items && confirmedOrder.items.length > 0) {
        const deliveryInfo = document.getElementById('delivery-info');
        deliveryInfo.innerHTML = '';
      
        confirmedOrder.items.forEach(item => {
          deliveryInfo.innerHTML += `
            <div class="cart-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <img src="${item.image}" style="width: 50px; height: 50px; object-fit: cover;">
              <div>
                <p><strong>${item.name}</strong></p>
                <p>Քանակ՝ ${item.quantity} × ${item.unitPrice} դրամ = ${item.subtotal} դրամ</p>
              </div>
            </div>
          `;
        });
      
        deliveryInfo.innerHTML += `
          <p style="margin-top: 10px;"><strong>Ընդհանուր գին՝ ${confirmedOrder.total} դրամ</strong></p>
          <p style="margin-top: 30px; font-weight: bold; color: green; font-size: 18px;">
            ✅ Պատվերը հաստատված է։<br>
            Առաքիչը կմոտենա հետևյալ հասցե՝ <strong>${confirmedOrder.address}</strong><br>
            և կզանգահարի <strong>${confirmedOrder.phone}</strong>։
          </p>
        `;
      }
      


    }
  });



  /*---------------------------- */
  document.getElementById('checkoutButton').addEventListener('click', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const deliveryInfo = document.getElementById('delivery-info');

  // Մաքրում ենք բաժինը
  deliveryInfo.innerHTML = '';

  if (Object.keys(cart).length === 0) {
    deliveryInfo.innerHTML = '<p>Պատվերը դատարկ է։</p>';
    return;
  }

  let total = 0;

  // Ստանում ենք բոլոր ապրանքները
  document.querySelectorAll('.menu__content').forEach(item => {
    const name = item.querySelector('.menu__name').textContent.trim();
    if (cart[name]) {
      const qty = cart[name];
      const priceText = item.querySelector('.menu__preci').textContent.trim().replace('դրամ', '').trim();
      const price = parseInt(priceText);
      const img = item.querySelector('.menu__img').getAttribute('src');
      const subtotal = qty * price;
      total += subtotal;

      deliveryInfo.innerHTML += `
        <div class="cart-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <img src="${img}" style="width: 50px; height: 50px; object-fit: cover;">
          <div>
            <p><strong>${name}</strong></p>
            <p>Քանակ՝ ${qty} × ${price} դրամ = ${subtotal} դրամ</p>
          </div>
        </div>
      `;
    }
  });

  // Ընդհանուր գին
  deliveryInfo.innerHTML += `<p style="margin-top: 10px;"><strong>Ընդհանուր գին՝ ${total} դրամ</strong></p>`;

  // Դաշտեր
  deliveryInfo.innerHTML += `
    <form id="orderForm" style="margin-top: 15px;">
      <input type="text" placeholder="Անուն Ազգանուն" required><br><br>
      <input type="text" placeholder="Հասցե" required><br><br>
      <input type="tel" placeholder="Հեռախոսահամար" required><br><br>
      <button type="submit" class="button">Հաստատել պատվերը</button>
    </form>
  `;

  // Թերթվում ենք այդ բաժնին
  document.querySelector('.delivery-section').scrollIntoView({ behavior: 'smooth' });
});
document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'orderForm') {
      e.preventDefault();
  
      const name = e.target.querySelector('input[placeholder="Անուն Ազգանուն"]').value.trim();
      const address = e.target.querySelector('input[placeholder="Հասցե"]').value.trim();
      const phone = e.target.querySelector('input[placeholder="Հեռախոսահամար"]').value.trim();
      const cart = JSON.parse(localStorage.getItem('cart')) || {};
  
      if (!name || !address || !phone) {
        alert('Խնդրում ենք լրացնել բոլոր դաշտերը։');
        return;
      }
  
      // Հեռացնում ենք ֆորմը
      e.target.remove();
  
      // Ցուցադրում ենք հաղորդագրությունը՝ հասցեով և հեռախոսով
      const deliveryInfo = document.getElementById('delivery-info');
      deliveryInfo.innerHTML += `
        <p style="margin-top: 30px; font-weight: bold; color: green; font-size: 18px;">
          ✅ Պատվերը հաստատված է։<br>
          Առաքիչը կմոտենա հետևյալ հասցե՝ <strong>${address}</strong><br>
          և կզանգահարի <strong>${phone} հեռախոսահամարին</strong>։
        </p>
      `;
  
      // Մաքրում ենք զամբյուղը
      const confirmedOrder = {
        address,
        phone,
        items: [],
        total: 0
      };
      
      // Լցնում ենք ապրանքները
      document.querySelectorAll('.menu__content').forEach(item => {
        const itemName = item.querySelector('.menu__name').textContent.trim();
        if (cart[itemName]) {
          const qty = cart[itemName];
          const priceText = item.querySelector('.menu__preci').textContent.trim().replace('դրամ', '').trim();
          const price = parseInt(priceText);
          const subtotal = qty * price;
          const image = item.querySelector('.menu__img').getAttribute('src');
      
          confirmedOrder.items.push({
            name: itemName,
            quantity: qty,
            unitPrice: price,
            subtotal,
            image
          });
      
          confirmedOrder.total += subtotal;
        }
      });
      
      localStorage.setItem('confirmedOrder', JSON.stringify(confirmedOrder));
      localStorage.removeItem('cart');
      
        
      // Թաքցնում ենք «Պատվիրել» կոճակը
      updateCheckoutButtonVisibility();
    }
  });
  
/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50
        const sectionId = current.getAttribute('id')
        const navItem = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if (navItem) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItem.classList.add('active-link')
            } else {
                navItem.classList.remove('active-link')
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
    const nav = document.getElementById('header')
    if (this.scrollY >= 200) nav.classList.add('scroll-header')
    else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL TOP ====================*/
function scrollTop() {
    const scrollTop = document.getElementById('scroll-top')
    if (this.scrollY >= 560) scrollTop.classList.add('show-scroll')
    else scrollTop.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollTop)

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun'

if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme)
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*==================== SCROLL REVEAL ANIMATION ====================*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '30px',
    duration: 2000,
    reset: true
})

sr.reveal(`.home__data, .home__img,
            .about__data, .about__img,
            .services__content, .menu__content,
            .app__data, .app__img,
            .contact__data, .contact__button,
            .footer__content`, {
    interval: 200
})

/*==================== DYNAMIC DELIVERIES ====================*/
const deliveries = []

const deliveryContainer = document.getElementById('delivery-info')
const form = document.getElementById('deliveryForm')

function renderDeliveries() {
    deliveryContainer.innerHTML = ''
    if (deliveries.length === 0) {
        deliveryContainer.innerHTML = "<p>Առաքում չկա։</p>"
        return
    }

    let total = 0
    deliveries.forEach(delivery => {
        const item = document.createElement("div")
        item.className = "delivery-item"
        item.innerHTML = `
            <p><strong>${delivery.name}</strong></p>
            <p>Հասցե՝ ${delivery.address}</p>
            <p>Հեռ․՝ ${delivery.phone}</p>
            <p>Առաքման գին՝ ${delivery.deliveryPrice} դրամ</p>
            <p>Պատվերի գին՝ ${delivery.orderPrice} դրամ</p>
        `
        deliveryContainer.appendChild(item)
        total += delivery.deliveryPrice + delivery.orderPrice
    })

    const totalElement = document.createElement("div")
    totalElement.className = "delivery-total"
    totalElement.innerHTML = `Ընդհանուր՝ ${total} դրամ`
    deliveryContainer.appendChild(totalElement)
}

if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault()

        const name = document.getElementById('deliveryName').value.trim()
        const address = document.getElementById('deliveryAddress').value.trim()
        const phone = document.getElementById('deliveryPhone').value.trim()
        const deliveryPrice = parseInt(document.getElementById('deliveryPrice').value)
        const orderPrice = parseInt(document.getElementById('orderPrice').value)

        if (!name || !address || !phone || isNaN(deliveryPrice) || isNaN(orderPrice)) return

        deliveries.push({
            name, address, phone, deliveryPrice, orderPrice
        })

        renderDeliveries()
        form.reset()
    })
}

/*==================== JUMP TO DELIVERY FORM ====================*/
function goToDeliveryForm(productName) {
    const nameInput = document.getElementById('deliveryName')
    nameInput.value = productName
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' })
}
// Открытие модального окна при клике на кнопку блюда
document.querySelectorAll('.menu__button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        selectedProduct = this.closest('.menu__content').querySelector('.menu__name').textContent.trim();
        updateCheckoutButtonVisibility();
        showModal();
    });
});

let selectedProduct = ''

function showModal() {
    document.getElementById('productDialog').style.display = 'block'
}

function closeModal() {
    document.getElementById('productDialog').style.display = 'none'
}

// Обработка закрытия
document.querySelector('.close-button').addEventListener('click', closeModal)

// Обработка отправки формы из модального окна
document.getElementById('productDialogForm').addEventListener('submit', function(e) {
    e.preventDefault()

    const name = document.getElementById('modalName').value.trim()
    const address = document.getElementById('modalAddress').value.trim()
    const phone = document.getElementById('modalPhone').value.trim()

    if (!name || !address || !phone) return

    // Добавим в deliveries
    deliveries.push({
        name: `${selectedProduct} (${name})`,
        address,
        phone,
        deliveryPrice: 1000,   // или можно добавить в модал
        orderPrice: 0
    })

    renderDeliveries()
    closeModal()
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' })
})
