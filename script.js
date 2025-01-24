$(document).ready(function ($) {
  $('#X').DataTable({
    drawCallback: function () {
      $('[tooltip]').tooltip({ trigger: 'hover', html: true });
    },
    ajax: {
      type: 'GET',
      url: 'https://mrgulka.github.io/id-gulka.json',
    },
    columns: [
      {
        width: '20%',
        data: 'ID',
        render: function (data) {
          return ('<img loading="lazy" height="50px" class="image" src="https://mrgulka.github.io/images/' 
            + data
            + ".png\" tooltip title=\"<img height='140px' src='https://mrgulka.github.io/images/" 
            + data 
            + ".png' alt='Item'>\">");
        },
      },
      {
        width: '15%',
        data: 'ID',
        render: function (data) {
          return data;
        },
      },
      {
        data: 'Name',
        render: function (data) {
          return ('<span>' + data + '</span>');
        },
      },
    ],
    language: {
      lengthMenu: '_MENU_',
      search: '_INPUT_',
      searchPlaceholder: 'Search',
    },
    responsive: true,
    bInfo: true,
    columnDefs: [
      {
        orderable: false,
        targets: 0,
      },
    ],
    aaSorting: [[1, 'asc']],
    searching: true,
    pageLength: 100,
    bSort: true,
    autoWidth: false,
    stateSave: true,
    dom: '<"top"<"row"<"col p-0"l><"col p-0"f>>>rt<"bottom"<"row"<"col p-0"i><"col p-0"p>>>',
  });
});