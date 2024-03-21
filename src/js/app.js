import './choices.js';

/* проверка на поддержку webp формата */
import BaseHelpers from './helpers/BaseHelpers.js';

BaseHelpers.checkWebpSupport();

BaseHelpers.addTouchClass();

BaseHelpers.addLoadedClass();

BaseHelpers.headerFixed();
/* end проверка на поддержку webp формата */

const choicesSelects = document.querySelectorAll('.choices-select-js');

choicesSelects.forEach(function (element) {
    new Choices(element, {
        searchEnabled: false, // Отключить поиск, если не нужен
        itemSelectText: '', // Текст для выбора элемента
    });
})

const dateInputs = document.querySelectorAll('.date-input-js');

dateInputs.forEach(function (element) {
    flatpickr(element, {
        disableMobile: "true"
        // mode: "range",
        // dateFormat: "Y-m-d"
    });
});

if (document.getElementById('editor')) {
    var editor = ace.edit("editor");
    editor.session.setMode("ace/mode/sql");
    editor.setTheme("ace/theme/tomorrow_night_blue");
    if (window.innerWidth < 359) {
        console.log('q')
        editor.setFontSize(12);
    } else if (window.innerWidth < 768) {
        editor.setFontSize(14);
    } else {
        editor.setFontSize(16);
    }
}

document.querySelector('.sidebar__btn-open').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.add('active');
});
document.querySelector('.sidebar__close').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.remove('active');
});