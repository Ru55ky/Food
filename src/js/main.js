'use strict'
window.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items')

    //скрываем табы
    const hideTabContent = () => {
        tabsContent.forEach((page) => {
            page.classList.add('hide')
        })
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
    hideTabContent()
    showTabContent(0)

    //Timer
    const deadline = '2021-08-05'
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
        modal = document.querySelector('.modal'),
        modalCloseBtn = modal.querySelector('[data-close]')

    modalTrigger.forEach(item => {
        item.addEventListener('click', openModal)
    })
    //функционал открытия/закрытия модального окна
    function openModal () {
        modal.classList.add('show')
        modal.classList.remove('hide')
        document.body.style.overflow = 'hidden'
        clearInterval(modalTimeId)
    }
    function closeModal () {
        modal.classList.remove('show')
        modal.classList.add('hide')
        document.body.style.overflow = 'auto'
    }

    //закрываем модальное окно кликом на страницу
    modal.addEventListener('click', (item) => {
        let target = item.target
        if(target.classList.contains('modal')) {
            closeModal()
        }
    })
    document.addEventListener('keydown', (event) => {
        if (event.code === "Escape" && modal.classList.contains(('show'))) {
            closeModal()
        }
    })
    modalCloseBtn.addEventListener('click', () => {
        closeModal()
    })
    const modalTimeId = setTimeout(openModal, 10000)

    function showModalByScroll () {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal()
            window.removeEventListener('scroll', showModalByScroll)
        }
    }
    window.addEventListener('scroll', showModalByScroll)
})