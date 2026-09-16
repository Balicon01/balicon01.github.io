document.addEventListener('DOMContentLoaded', () => {
  // Initialize DataTable
  const table = $('#display_json_data').DataTable({
    paging: false,
    info: false,
    searching: true,
    dom: 't', // Only show the table itself, no default controls
    fixedHeader: {
      header: true,
      headerOffset: document.querySelector('header').offsetHeight
    },
    order: [], // Отключаем изначальную сортировку (нейтральное положение)
    columnDefs: [
      { orderable: false, targets: 0 }, // Disable sorting on the "Photo" column
      {
        type: 'num',
        targets: 1,
        render: function (data, type, row) {
          return type === 'display' ? `<span class="item-id">${data}</span>` : data;
        }
      },
      {
        targets: 2,
        render: function (data, type, row) {
          return type === 'display' ? `<span class="item-type">${data}</span>` : data;
        }
      },
      {
        targets: 3,
        render: function (data, type, row) {
          return type === 'display' ? `<span class="item-name">${data}</span>` : data;
        }
      }
    ],
    order: [[2, 'asc']] // Default sort by Type
  });

  // Theme toggle functionality
  const themeIcon = document.getElementById('theme-icon');
  const body = document.body;
  const themeSelectionModal = document.getElementById('themeSelectionModal');
  const selectLightModeBtn = document.getElementById('selectLightMode');
  const selectDarkModeBtn = document.getElementById('selectDarkMode');

  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    setTheme(savedTheme, false);
  } else {
    // Show modal if no theme is saved
    themeSelectionModal.classList.add('show');
  }

  function setTheme(theme, hideModal = true) {
    body.classList.remove('light-mode', 'dark-mode');
    body.classList.add(theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark-mode') {
      themeIcon.src = 'ImagesVehicle/ImageSite/moon.png';
    } else {
      themeIcon.src = 'ImagesVehicle/ImageSite/sun.png';
    }
    if (hideModal) {
      themeSelectionModal.classList.remove('show');
    }
  }

  selectLightModeBtn.addEventListener('click', () => setTheme('light-mode'));
  selectDarkModeBtn.addEventListener('click', () => setTheme('dark-mode'));

  themeIcon.addEventListener('click', () => {
    if (body.classList.contains('light-mode')) {
      setTheme('dark-mode');
    } else {
      setTheme('light-mode');
    }
  });

  // UI Elements
  const loaderContainer = document.getElementById('loader-container');
  const dataTableContainer = document.querySelector('.base_dataTable');
  const searchInput = document.getElementById('search');
  const toast = document.getElementById('toast');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  let toastTimeout;

  // Generic data fetching function
  async function loadData(url, dataProcessor) {
    // Show loader, hide table
    loaderContainer.style.display = 'flex';
    dataTableContainer.style.display = 'none';

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const rows = dataProcessor(data);

      table.clear().rows.add(rows).draw();

      // Hide loader, show table
      loaderContainer.style.display = 'none';
      dataTableContainer.style.display = 'block';

      // Пересчитываем FixedHeader после того, как таблица стала видимой и заполнилась данными
      table.fixedHeader.adjust();
    } catch (error) {
      console.error("Failed to load data:", error);
      loaderContainer.style.display = 'none';
      alert("Ошибка при загрузке данных. Пожалуйста, попробуйте позже.");
    }
  }

  function getImgHTML(basePath, id) {
    return `<div class="image-container">
              <img loading="lazy" class="image" src="${basePath}${id}.png" 
                   onerror="this.onerror=null; this.outerHTML='<i class=\\'fa-solid fa-image image-fallback\\'></i>'" 
                   alt=" "/>
            </div>`;
  }

  function processData(data, imgPath, excludeTypes = []) {
    const rows = [];
    for (let i = 0; i < data.length; i++) {
      const type = data[i].Type;
      // Пропускаем ненужные типы (если переданы)
      if (excludeTypes.includes(type)) continue;

      const displayType = type || (excludeTypes.length === 0 ? 'Vehicle' : 'N/A');

      rows.push([
        getImgHTML(imgPath, data[i].ID),
        data[i].ID,
        displayType,
        data[i].Name
      ]);
    }
    return rows;
  }

  // Button logic
  function handleButtonClick(buttonId, url, imgPath, excludeTypes) {
    document.getElementById(buttonId).addEventListener('click', function () {
      // Manage active state
      document.querySelectorAll('.custom-button').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      searchInput.value = ''; // Clear search
      table.search('').draw();

      // Передаем функцию, которая вызовет processData с нужными аргументами
      loadData(url, (data) => processData(data, imgPath, excludeTypes));
    });
  }

  // Настройка: кнопка -> JSON -> Папка с картинками -> исключаемые типы
  const defaultExcludes = ["Object", "Vehicle", "Effect", "Large", "Medium", "Decal"];

  // Для Eternal (3266436726.json) -> папка /images_3266436726/ (назовите её как вам нужно)
  handleButtonClick('relsi', 'https://Balicon01.github.io/3266436726.json', 'https://Balicon01.github.io/images_3266436726/', defaultExcludes);

  // Для Original (3412516593.json) -> папка /images_3412516593/
  handleButtonClick('relorig', 'https://Balicon01.github.io/3412516593.json', 'https://Balicon01.github.io/images_3412516593/', defaultExcludes);

  // Для Cars (3354942093.json) -> папка /ImagesVehicle/
  handleButtonClick('toggleCars', 'https://Balicon01.github.io/Vehicle.json', 'https://Balicon01.github.io/ImagesVehicle/', []);

  // Search
  searchInput.addEventListener('input', function () {
    table.search(this.value).draw();
  });

  // --- Новые Фичи ---

  // Копирование ID
  $('#dataTable').on('click', '.item-id', function () {
    const text = $(this).text();
    navigator.clipboard.writeText(text).then(() => {
      toast.classList.add('show');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 2000);
    });
  });

  // Lightbox для картинок
  $('#dataTable').on('click', '.image', function () {
    lightboxImg.src = this.src;
    lightbox.classList.add('show');
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('show');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('show');
    }
  });

  // Update FixedHeader on resize
  window.addEventListener('resize', () => {
    table.fixedHeader.headerOffset(document.querySelector('header').offsetHeight);
    table.fixedHeader.adjust();
  });
});
