<!DOCTYPE html>
<html lang="ru">

<head>
  <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1">
  <meta charset="utf-8">
  <title>ID Eternal RP</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.datatables.net/2.0.8/css/dataTables.dataTables.css" />
  <style>
    body {
      margin: 0;
      width: auto;
      flex: auto;
      font-family: Arial, Helvetica, sans-serif;
    }

    .topnav {
      overflow: hidden;
      background-color: #333;
    }

    .topnav a {
      float: left;
      color: #f2f2f2;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
      font-size: 17px;
    }

    .topnav a:hover {
      background-color: #ddd;
      color: black;
    }

    .topnav a.active {
      background-color: #4CAF50;
      color: white;
    }

    header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 88px;
      z-index: 10;
      background: #eeeeee;
      box-shadow: 0 7px 8px rgba(0, 0, 0, 0.12);
    }

    .base_dataTable {
      margin-top: 90px;
    }
  </style>
</head>

<body>
  <header>
    <div class="topnav text-white">
      <button type="button" class="btn btn-primary btn-lg" id="relsi" data-bs-toggle="button" autocomplete="off">Eternal</button>
      <button type="button" class="btn btn-secondary btn-lg" id="relorig" data-bs-toggle="button" autocomplete="off">Original</button>
      <div class="form-group">
        <input type="text" class="form-control" id="search" placeholder="Поиск по таблице">
      </div>
    </div>
  </header>
  <div class="base_dataTable">
    <table id="display_json_data" class="table table-bordered table-striped table-vcenter dataTable no-footer">
      <thead>
        <tr>
          <th>Photo</th>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody id="dataTable"></tbody>
    </table>
  </div>
  <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
  <script src="https://cdn.datatables.net/2.0.8/js/jquery.dataTables.min.js"></script>
  <script>
    $(document).ready(function () {
      $('#relsi').click(function () {
        Reload('https://Balicon01.github.io/3266436726.json');
      });

      $("#relorig").click(function () {
        Reload('https://Balicon01.github.io/3412516593.json');
      });

      function Reload(path) {
        $.getJSON(path)
          .done(function (data) {
            var allRecordsHTML = '';
            for (var i = 0; i < data.length; i++) {
              if (data[i].Type == "Object" || data[i].Type == "Vehicle" || 
                  data[i].Type == "Effect" || data[i].Type == "Large" || 
                  data[i].Type == "Medium" || data[i].Type == "Decal") continue;

              allRecordsHTML += '<tr>';
              allRecordsHTML += '<td>' + '<img loading="lazy" height="50" class="image" src="https://Balicon01.github.io/images/' + data[i].ID + '.png" onerror="this.style.display=\'none\'" tooltip title="<img height=\'140px\' src=\'https://Balicon01.github.io/images/' + data[i].ID + '.png\' alt=\'Item\'>' + '"> </td>';
              allRecordsHTML += '<td>' + data[i].ID + '</td>';
              allRecordsHTML += '<td>' + data[i].Name + '</td>';
              allRecordsHTML += '</tr>';
            }
            var table = document.getElementById("dataTable");
            table.innerHTML = allRecordsHTML;
            $('#display_json_data').DataTable(); // Initialize DataTable after content is loaded.
          })
          .fail(function () {
            alert('Ошибка загрузки данных. Пожалуйста, попробуйте снова.');
          });
      };

      $("#search").keyup(function () {
        var searchText = $(this).val().toLowerCase();
        $("#dataTable tr").each(function () {
          if ($(this).text().toLowerCase().indexOf(searchText) === -1) {
            $(this).hide();
          } else {
            $(this).show();
          }
        });
      });
    });
  </script>
</body>

</html>
