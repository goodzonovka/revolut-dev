import './choices.js';
import './chart.js';

/* проверка на поддержку webp формата */
import BaseHelpers from './helpers/BaseHelpers.js';

BaseHelpers.checkWebpSupport();

BaseHelpers.addTouchClass();

BaseHelpers.addLoadedClass();

BaseHelpers.headerFixed();
/* end проверка на поддержку webp формата */

document.addEventListener('DOMContentLoaded', function() {

    function setPercentage(svg, percentage) {
        const circle = svg.querySelector('.active-path');
        const text = svg.querySelector('.percent-text');
        const circumference = 2 * Math.PI * circle.getAttribute('r');
        const activeLength = (percentage / 100) * circumference;
        const inactiveLength = circumference - activeLength;

        circle.setAttribute('stroke-dasharray', `${activeLength} ${inactiveLength}`);

        if (svg.classList.contains('no-goals')) {
            text.textContent = '-'
        } else {
            text.textContent = `${percentage}%`;
        }
        svg.style.display = 'block'
    }

    const svgs = document.querySelectorAll('.circle-percent-js');

    svgs.forEach(svg => {
        const percentage = svg.dataset.percent;
        setPercentage(svg, percentage);
    });

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

    // Инициализация Select2 для элемента select
    $('#select2').select2({
        tags: true,
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

    flatpickr("#dateRange", {
        mode: "range",
        dateFormat: "Y-m-d",
        onClose: function(selectedDates, dateStr, instance) {
            const dates = dateStr.split(" to ");
            const startDate = dates[0]; // Начальная дата
            const endDate = dates[1]; // Конечная дата

            document.getElementById("dateRageStartDate").value = startDate;
            document.getElementById("dateRageEndDate").value = endDate;
        }
    });
    if (window.innerWidth < 1200 && document.querySelector('#dateRange')) {
        let dateRange = document.querySelector('#dateRange');
        let flatPickrRange = document.querySelector('.flatpickr-calendar.rangeMode');
        flatPickrRange.style.width = dateRange.offsetWidth + 'px';

        window.addEventListener('resize', function (event) {
            let dateRange = document.querySelector('#dateRange');
            let flatPickrRange = document.querySelector('.flatpickr-calendar.rangeMode');
            flatPickrRange.style.width = dateRange.offsetWidth + 'px';
        });
    }


    const dateInputs = document.querySelectorAll('.date-input-js');

    dateInputs.forEach(function (element) {
        flatpickr(element, {
            disableMobile: "true"
        });
    });

    let editors = document.querySelectorAll('.editor-js');
    if (editors) {
        editors.forEach(function (el, index) {
            let editor = ace.edit(el);
            editor.session.setMode("ace/mode/sql");
            editor.setTheme("ace/theme/tomorrow_night_blue");
            if (window.innerWidth < 359) {
                editor.setFontSize(12);
            } else if (window.innerWidth < 768) {
                editor.setFontSize(14);
            } else {
                editor.setFontSize(16);
            }
        });
    }

    let editorsReadonly = document.querySelectorAll('.editor-readonly-js');
    if (editorsReadonly) {
        editorsReadonly.forEach(function (el, index) {
            let editor = ace.edit(el);
            editor.session.setMode("ace/mode/sql");
            editor.setTheme("ace/theme/tomorrow_night_blue");
            editor.setReadOnly(true);
            if (window.innerWidth < 359) {
                editor.setFontSize(12);
            } else if (window.innerWidth < 768) {
                editor.setFontSize(14);
            } else {
                editor.setFontSize(16);
            }
        });
    }

    document.querySelector('.sidebar__btn-open').addEventListener('click', function () {
        document.querySelector('.sidebar').classList.add('active');
        document.body.classList.add('overflow-hidden');
    });
    document.querySelector('.sidebar__close').addEventListener('click', function () {
        document.querySelector('.sidebar').classList.remove('active');
        document.body.classList.remove('overflow-hidden');
    });

    let trackedInitiativesSidebarOpen = document.querySelector('.tracked-initiatives-sidebar__open');
    if (trackedInitiativesSidebarOpen) {
        trackedInitiativesSidebarOpen.addEventListener('click', function () {
            document.querySelector('.tracked-initiatives-sidebar').classList.add('active');
            document.body.classList.add('overflow-hidden');
        });
        document.querySelector('.tracked-initiatives-sidebar__close').addEventListener('click', function () {
            document.querySelector('.tracked-initiatives-sidebar').classList.remove('active');
            document.body.classList.remove('overflow-hidden');
        });
    }

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

    const groupButtons = document.querySelectorAll('.table__show-group');

    // Добавляем обработчик событий для каждой кнопки
    groupButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Поиск ближайшего родительского элемента с классом .table__row-group
            const groupRow = button.closest('.table__row-group');

            // Переключение класса .active
            groupRow.classList.toggle('active');
        });
    });

    const filterButton = document.getElementById('table-filter-btn');

    const filterList = document.getElementById('table-filter-list');

    if (filterButton) {
        filterButton.addEventListener('click', function() {
            filterList.classList.toggle('active');
        });
    }

    const radioButtons = document.querySelectorAll('.table-filter-selected input[type="radio"]');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const filterContainer = this.closest('.table-filter-selected');

                const currentValueDisplay = filterContainer.querySelector('.table-filter-selected__current-value');

                currentValueDisplay.textContent = this.value;
            }
        });
    });

    const selectedItems = document.querySelectorAll('.table-filter-selected__item');

    selectedItems.forEach(item => {
        item.addEventListener('click', function() {
            const filterContainer = this.closest('.table-filter-selected');

            const list = filterContainer.querySelector('.table-filter__list');

            list.classList.toggle('active');

            const allLists = document.querySelectorAll('.table-filter__list')

            allLists.forEach(otherList => {
                if (otherList !== list) {
                    otherList.classList.remove('active');
                }
            });
        });
    });

    const filterItems = document.querySelectorAll('#table-filter-list .table-filter__item');

    // Добавляем обработчик событий на клик для каждого элемента
    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('active');

            const targetId = this.getAttribute('data-target');

            const targetElement = document.querySelector(targetId);

            targetElement.classList.toggle('active');
        });
    });

    const removeButtons = document.querySelectorAll('.table-filter-selected__remove');

    removeButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();

            const filterSelected = this.closest('.table-filter-selected');

            filterSelected.classList.remove('active');

            const targetId = filterSelected.id;

            const relatedItem = document.querySelector(`.table-filter__item[data-target="#${targetId}"]`);

            if (relatedItem) {
                relatedItem.classList.remove('active');
            }
        });
    });

    document.addEventListener('click', function(event) {
        if (filterButton) {
            if (!filterButton.contains(event.target) && !filterList.contains(event.target)) {
                filterList.classList.remove('active');
            }
        }

        if (!event.target.closest('.table-filter-selected .table-filter-selected__item') && !event.target.closest('.table-filter-selected .table-filter__list')) {
            const lists = document.querySelectorAll('.table-filter-selected .table-filter__list');
            lists.forEach(list => {
                list.classList.remove('active');
            });
        }
    });

    // Функция для подсчета и отображения количества выбранных чекбоксов
    function updateSelectedCount() {
        const checkboxes = document.querySelectorAll('.table__checkbox');
        const selectedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
        const countDisplay = document.getElementById('selected-count');

        if (checkboxes.length && countDisplay) {
            countDisplay.textContent = selectedCount;
        }
    }

    const checkboxes = document.querySelectorAll('.table__checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCount);
    });

    updateSelectedCount();

    let toggleButtons = document.querySelectorAll('.toggle-button-js');

    // Добавляем обработчик события клика каждой кнопке
    toggleButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Получаем селектор из data-trigger
            let selector = button.getAttribute('data-trigger');
            let target = document.querySelector(selector);

            // Переключаем класс 'active' и стиль display для целевого элемента
            if (target) {
                target.classList.toggle('active');
                button.classList.toggle('active');
                if (target.style.display === 'block' || target.style.display === '') {
                    target.style.display = 'none';
                } else {
                    target.style.display = 'block';
                }
            }
        });
    });

    let computationsTabs = document.querySelectorAll(".computation__tab");

    computationsTabs.forEach(function(tab) {
        tab.addEventListener("click", function() {
            computationsTabs.forEach(function(tab) {
                tab.classList.remove("active");
            });

            this.classList.add("active");
        });
    });

    const tableCheckboxes = document.querySelectorAll('.table__checkbox');
    const tableBottom = document.querySelector('.table__bottom');
    const tableScroll = document.querySelector('.table__scroll');

    // Функция для изменения позиции .table__bottom
    function updatePosition(checkbox) {
        const checkboxParent = checkbox.closest('.table__td');
        const checkboxRect = checkboxParent.getBoundingClientRect();
        const scrollRect = tableScroll.getBoundingClientRect();
        const relativeTop = checkboxRect.top - scrollRect.top;

        // Обновляем стиль для .table__bottom
        tableBottom.style.top = `${relativeTop}px`;
    }

    // Добавляем обработчик события клика для каждого чекбокса
    tableCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            updatePosition(this);
        });
    });

    const roiItemButtons = document.querySelectorAll('.roi-item__button');

    // Добавляем обработчик события клика на каждую кнопку
    roiItemButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Получаем всех соседей (другие кнопки в том же roi-item__bottom)
            var siblings = Array.from(this.parentNode.children);

            // Удаляем класс active у всех соседних кнопок и скрываем соответствующие графики
            siblings.forEach(function(sibling) {
                sibling.classList.remove('active');
                const graphId = sibling.dataset.trigger;
                if (graphId) {
                    const graph = document.querySelector(graphId);
                    if (graph) {
                        graph.style.display = 'none';
                    }
                }
            });

            // Добавляем класс active к кликнутой кнопке и показываем соответствующий график
            this.classList.add('active');
            const activeGraphId = this.dataset.trigger;
            if (activeGraphId) {
                const activeGraph = document.querySelector(activeGraphId);
                if (activeGraph) {
                    activeGraph.style.display = '';
                }
            }
        });
    });
});

window.onload = function () {
    // Добавление тултипа ко всем ячейкам первого столбца
    let tableCells = document.querySelectorAll('.table__row .table__td:has(.table__td-name)');

    tableCells.forEach(function(cell) {
        // Создаем обертку тултипа и текст тултипа
        let tooltipSpan = document.createElement('span');
        tooltipSpan.classList.add('tooltiptext');
        tooltipSpan.textContent = cell.textContent;

        // Обертываем содержимое ячейки в div с классом tooltip
        let tooltipDiv = document.createElement('div');
        tooltipDiv.classList.add('tooltip');

        while (cell.firstChild) {
            tooltipDiv.appendChild(cell.firstChild); // Перемещаем содержимое ячейки в тултип
        }

        cell.appendChild(tooltipDiv);
        tooltipDiv.appendChild(tooltipSpan); // Добавляем текст тултипа
    });


    let elements = document.querySelectorAll('.table__td-name');

    elements.forEach(function (element) {
        let parent = element.parentElement;

        const rectP = parent.getBoundingClientRect();
        const widthP = rectP.width; // Точная ширина элемента

        const rect = element.getBoundingClientRect();
        const width = rect.width; // Точная ширина элемента

        // Проверяем, обрезается ли текст
        if (width > widthP) {
            // Если текст обрезается, добавляем класс overflowing
            element.classList.add('overflowing');
            element.classList.remove('not-overflowing');
        } else {
            // Если текст не обрезается, добавляем класс not-overflowing
            element.classList.add('not-overflowing');
            element.classList.remove('overflowing');
        }
        element.classList.add('trim');
    });
}