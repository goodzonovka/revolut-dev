import './choices.js';

/* проверка на поддержку webp формата */
import BaseHelpers from './helpers/BaseHelpers.js';

BaseHelpers.checkWebpSupport();

BaseHelpers.addTouchClass();

BaseHelpers.addLoadedClass();

BaseHelpers.headerFixed();
/* end проверка на поддержку webp формата */

document.addEventListener('DOMContentLoaded', function() {

    const choicesSelects = document.querySelectorAll('.choices-select-js');

    choicesSelects.forEach(function (element) {
        new Choices(element, {
            searchEnabled: false,
            itemSelectText: '',
        });
    })

    // Предварительная обработка и сохранение данных из опций
    const optionsData = {};

    document.querySelectorAll('#multi-select-js option').forEach(option => {
        const imgSrc = option.getAttribute('data-img-src');
        const value = option.value;
        optionsData[value] = imgSrc;
    });

    if (document.getElementById('multi-select-js')) {
        const multiSelect = new Choices('#multi-select-js', {
            removeItemButton: true,
            searchEnabled: false,
            shouldSort: false,
            callbackOnCreateTemplates: function (template) {
                return {
                    choice: (classNames, data) => {
                        // Получаем imgSrc из сохраненных данных
                        const imgSrc = optionsData[data.value];
                        return template(`
                        <div class="choice-with-image" data-select-text="${this.config.itemSelectText}" data-choice data-id="${data.id}" data-value="${data.value}" ${data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable'} role="option">
                            <img src="${imgSrc}" class="choice-img" style="width:24px; height:24px; margin-right:8px;"> ${data.label}
                        </div>
                    `);
                    }
                };
            }
        });

        const clearButton = document.createElement('div');
        clearButton.classList.add('choices__clear');
        clearButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M7.36612 7.36612C7.85427 6.87796 8.64573 6.87796 9.13388 7.36612L12 10.2322L14.8661 7.36612C15.3543 6.87796 16.1457 6.87796 16.6339 7.36612C17.122 7.85427 17.122 8.64573 16.6339 9.13388L13.7678 12L16.6339 14.8661C17.122 15.3543 17.122 16.1457 16.6339 16.6339C16.1457 17.122 15.3543 17.122 14.8661 16.6339L12 13.7678L9.13388 16.6339C8.64573 17.122 7.85427 17.122 7.36612 16.6339C6.87796 16.1457 6.87796 15.3543 7.36612 14.8661L10.2322 12L7.36612 9.13388C6.87796 8.64573 6.87796 7.85427 7.36612 7.36612Z"
                  fill="currentColor"/>
        </svg>
    `;
        document.querySelector('.choices__inner').appendChild(clearButton);

        function updateClearButtonVisibility() {
            const hasValues = multiSelect.getValue().length > 0;
            clearButton.style.display = hasValues ? 'block' : 'none';
        }

        updateClearButtonVisibility();

        clearButton.addEventListener('click', (e) => {
            e.stopPropagation();
            multiSelect.removeActiveItems(); // Очищаем все выбранные элементы
            updateClearButtonVisibility();
        });

        multiSelect.passedElement.element.addEventListener('change', updateClearButtonVisibility);
    }


    const dateInputs = document.querySelectorAll('.date-input-js');

    dateInputs.forEach(function (element) {
        flatpickr(element, {
            disableMobile: "true"
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

    document.querySelector('.sidebar__btn-open').addEventListener('click', function () {
        document.querySelector('.sidebar').classList.add('active');
    });
    document.querySelector('.sidebar__close').addEventListener('click', function () {
        document.querySelector('.sidebar').classList.remove('active');
    });

    document.querySelectorAll('.show-pass').forEach(button => {
        button.addEventListener('click', () => {
            const parent = button.parentElement;
            const passwordInput = parent.querySelector('input[type="password"], input[type="text"]');
            const svgUseElement = button.querySelector('svg use');

            if (passwordInput && svgUseElement) {
                const isPassword = passwordInput.getAttribute('type') === 'password';
                passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
                svgUseElement.setAttribute('href', isPassword ? '/images/icons/icons.svg#no-view' : '/images/icons/icons.svg#view');
            }
        });
    });
});