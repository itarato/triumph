(function (config, $) {

  var init = function () {
    var $board = $('#board');
    for (var y = 0; y < config.size_y; y++) {
      var $row = $('<div class="row"/>');
      $board.append($row);

      for (var x = 0; x < config.size_x; x++) {
        var $tile = $('<div class="tile"/>');
        $tile
          .data('x', x)
          .data('y', y);
        setTile(x, y, $tile);
        setTileStatus($tile, Math.floor(Math.random() * 5));
        $row.append($tile);
      }
    }

    $board.on('click', 'div.tile', function () {
      $this = $(this);
      var status = $this.data('status');

      if (status != 0) {
        return;
      }

      setTileStatus($this, 1);

      checkTriples($this.data('x'), $this.data('y'));
    });
  };

  var tiles = [];
  var setTile = function (x, y, tile) {
    tiles[x + y * (config.size_x + config.size_y)] = tile;
  };
  var getTile = function (x, y) {
    if (x < 0 || y < 0 || x >= config.size_x || y >= config.size_y) {
      return undefined;
    }
    return tiles[x + y * (config.size_x + config.size_y)];
  };

  var setTileStatus = function ($tile, status) {
    $tile
      .data('status', status)
      .text(status)
      .removeClass()
      .addClass('tile status-' + status);
  };

  var checkTriples = function(x, y) {
    var neighbourMap = [[0, -1], [-1, 0], [1, 0], [0, 1]];

    var $checkedTile = getTile(x, y);
    var status = $checkedTile.data('status');

    var checkStack = [ [x, y] ];
    var checkedSet = [ x + ':' + y ];
    var matches = [];

    while (checkStack.length) {
      var currentCoord = checkStack.pop();
      matches.push(currentCoord);

      for (var i = 0; i < neighbourMap.length; i++) {
        var neighbourX = currentCoord[0] + neighbourMap[i][0],
            neighbourY = currentCoord[1] + neighbourMap[i][1];

        var neighbourTile = getTile(neighbourX, neighbourY);

        // Already checked - or does not exist.
        if (!neighbourTile || checkedSet.indexOf(neighbourX + ':' + neighbourY) >= 0) {
          continue;
        }

        checkedSet.push(neighbourX + ':' + neighbourY);

        if (neighbourTile.data('status') == status) {
          checkStack.push([neighbourX, neighbourY]);
        }
      }
    }

    if (matches.length >= 3) {
      var matchCoord;
      while (matchCoord = matches.pop()) {
        var $tile = getTile(matchCoord[0], matchCoord[1]);
        setTileStatus($tile, 0);
      }
      setTileStatus($checkedTile, status + 1);

      checkTriples(x, y);
    }
  };

  init();

})({
  size_x: 8,
  size_y: 11
}, jQuery);
