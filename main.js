const fs = require('fs');

const args = process.argv;


fs.readFile(args.length > 2 ? args[2] : 'tiny-map.txt', 'utf8', function (err, data) {
  if (err) {
    console.log('Error reading input file');
    return;
  }

  function longestPaths(paths) {
    if (paths.length < 1) {
      return [];
    } else if (paths.length == 1) {
      return paths[0];
    } else {
      var longest = [[]];
      for (var i = 0, len = paths.length; i < len; i++) {
        if (longest[0].length < paths[i].length) {
          longest = [paths[i]];
        } else if (longest[0].length == paths[i].length) {
          longest.push(paths[i]);
        }
      }
      return longest;
    }
  }

  function slope(path) {
    const l = path.length;
    return l < 2 ? 0 : path[0] - path[l - 1];
  }

  function steepestPath(paths) {
    if (paths.length < 1) {
      return [];
    } else if (paths.length == 1) {
      return paths[0];
    } else {
      var steepest = [];
      for (var i = 0, len = paths.length; i < len; i++) {
        if (slope(steepest) < slope(paths[i])) {
          steepest = paths[i];
        }
      }
      return steepest;
    }
  }

  function bestPath(paths) {
    if (paths.length < 1) {
      return [];
    } else if (paths.length == 1) {
      return paths[0];
    } else {
      var best = [];
      var longests = longestPaths(paths);
      if (longests.length == 1) {
        best = longests[0];
      } else if (longests.length > 1) {
        best = steepestPath(longests);
      }
      return best;
    }
  }

  function flow(x, y, path) {
    var n = path.slice();
    var s = path.slice();
    var e = path.slice();
    var w = path.slice();

    if (x > 0 && map[x][y] > map[x - 1][y]) {
      n.push(map[x - 1][y]);
      n = flow(x - 1, y, n);
    }
    if (x < rows - 1 && map[x][y] > map[x + 1][y]) {
      s.push(map[x + 1][y]);
      s = flow(x + 1, y, s);
    }
    if (y < cols - 1 && map[x][y] > map[x][y + 1]) {
      e.push(map[x][y + 1]);
      e = flow(x, y + 1, e);
    }
    if (y > 0 && map[x][y] > map[x][y - 1]) {
      w.push(map[x][y - 1]);
      w = flow(x, y - 1, w);
    }
    path = bestPath([n, s, e, w]);
    return path;
  }

  var lines = data.split('\n');
  var dimensions = lines.shift().split(' ');

  var rows = dimensions[0];
  var cols = dimensions[1];
  var map = [];


  for (var i = 0; i < rows; i++) {
    var values = lines[i].split(' ');
    map[i] = [];
    for (var j = 0; j < cols; j++) {
      map[i].push(+values[j]);
    }
  }

  var best = [];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var path = flow(i, j, [map[i][j]]);
      var next = bestPath([best, path]);
      if (next != best) {
        best = next;
      }
    }
  }

  console.log('path: ', best);
  console.log('Slope: ', slope(best));
});
