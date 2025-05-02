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
