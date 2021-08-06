'use strict'
window.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items')

    //скрываем табы
    const hideTabContent = (i = 0) => {
        tabsContent.forEach((page) => {
            page.classList.add('hide')
            page.classList.remove('show', 'fade')
        })
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }


    const showTabContent = (i = 0) => {
        tabsContent[i].classList.add('show', 'fade')
        tabsContent[i].classList.remove('hide')
        tabs[i].classList.add('tabheader__item_active')
    }
    tabsParent.addEventListener('click', (event) => {
        event.preventDefault()
        let target = event.target
        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if(target == item) {
                    hideTabContent()
                    showTabContent(i)
                }
            })
        }
    })
    hideTabContent(0)
    showTabContent(0)

    //Timer
    const deadline = '2021-08-12'
    //правильно устанавливаем рамки таймера
    const getTimeRemaining = (endtime) => {
        let t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor((t / (1000 * 60 * 60 * 24))),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        //результат возвращаем в объекте
        return {
            'total': t,
            days,
            hours,
            minutes,
            seconds
        };
    }
// даем циферблату 0, если число однозначное
    function getZero(num) {
        if(num >= 0 && num < 10){
            return '0' + num
        } else{
            return num
        }
    }

    //функция, которая исправляет таймер в верстке, запускает и обновляет его
    function setClock(selector, endtime) {
        let timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000)//обновляем таймер раз/сек
        updateClock()

        function updateClock() {
            let t = getTimeRemaining(endtime)
            days.innerHTML = getZero(t.days)
            hours.innerHTML = getZero(t.hours)
            minutes.innerHTML = getZero(t.minutes)
            seconds.innerHTML = getZero(t.seconds)

            if(t.total <= 0 ) {
                clearInterval(timeInterval)
            }
        }
    }
    setClock('.timer', deadline)

    //вызов модального окна
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal')

    modalTrigger.forEach(item => {
        item.addEventListener('click', openModal)
    })
    //функционал открытия/закрытия модального окна
    function openModal () {
        modal.classList.add('show')
        modal.classList.remove('hide')
        /*document.body.style.overflow = 'hidden'*/
        document.body.dbScrollY = window.scrollY
        document.body.style.cssText = `
        overflow: hidden;
        left: ${-window.scrollY}
        `

       /* clearInterval(modalTimeId)*/
    }
    function closeModal () {
        modal.classList.remove('show')
        modal.classList.add('hide')
        document.body.style.overflow = 'auto'

    }

    //закрываем модальное окно кликом на страницу
    modal.addEventListener('click', (item) => {
        if(item.target === modal || item.target.getAttribute('data-close') == '') {
            closeModal()
        }
    })
    document.addEventListener('keydown', (event) => {
        if (event.code === "Escape" && modal.classList.contains(('show'))) {
            closeModal()
        }
    })

   /* const modalTimeId = setTimeout(openModal, 10000) */

    function showModalByScroll () {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal()
            window.removeEventListener('scroll', showModalByScroll)
        }
    }
    window.addEventListener('scroll', showModalByScroll)


    //Карточки товара
     class MenuCard{
        constructor(src, alt, title, description, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.description = description;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.price = price;
            this.transfer = 3;
            this.changeToUAH();
        }
        changeToUAH() {
            this.price = this.price * this.transfer
        }
        render() {
            const item = document.createElement('div')
            if(this.classes.length === 0) {
                this.classes = 'menu__item'
                item.classList.add(this.classes)
            }else {
                this.classes.forEach(className => item.classList.add(className))
            }
                item.innerHTML = `
           
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.description}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> $/день</div>
                    </div>
                
            `;
            this.parent.append(item)
        }
    }
    const getResource = async (url) => {
        const res = await fetch(url, {
            method: 'GET'
        })
        return await res.json()
    }

    getResource('http://localhost:3000/menu')
        .then((data) => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render()
            })
        })

    //Форма

    const forms = document.querySelectorAll('form')

    const message = {
        loading: 'js/spinner.svg',
        success: 'Спасибо, скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так'
    }

    forms.forEach(item => {
        bindPostData(item);
    })

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: data
        })
        return await res.json()
    }

    function bindPostData (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const statusMessage = document.createElement('img')
            statusMessage.src = message.loading
            statusMessage.style.cssText =
            `
            display: block;
            margin: 0 auto;
            `
            form.insertAdjacentElement('afterend', statusMessage)

            //Реализация обработки обратной связи

            const formData = new FormData(form);

            const object = {}
            formData.forEach((function (value, key) {
                object[key] = value
            }))

                postData('http://localhost:3000/requests', JSON.stringify(object))
                .then(data => {
                    console.log(data)
                    showThanksModal(message.success)
                    statusMessage.remove()
                }).catch(() => {
                showThanksModal(message.failure)
                form.append(statusMessage)
            }).finally(() => {
                form.reset()
            });




            /*request.addEventListener('load', () => {
                if(request.status === 200) {
                    showThanksModal(message.success)
                    form.append(statusMessage)
                    form.reset()
                        statusMessage.remove()

                } else {
                    showThanksModal(message.failure)
                    form.append(statusMessage)
                }
            })*/
        })
    }
    //Ответ пользователю на обработанную форму
    function showThanksModal (message) {
        const prevModalDialog = document.querySelector('.modal__dialog')
        prevModalDialog.classList.add('hide')
        openModal();

        const thanksModal = document.createElement('div')
        thanksModal.classList.add('modal__dialog')
        thanksModal.innerHTML = `
        <div class="modal__content">
        <div data-close class="modal__close">&times;</div>
        <div class="modal__title">${message}</div>
</div>
        `
        document.querySelector('.modal').append(thanksModal)
        setTimeout(() => {
            thanksModal.remove()
            prevModalDialog.classList.remove('hide')
            prevModalDialog.classList.add('show')
            closeModal()
        }, 4000)
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res))

})