
/*
 * example data
 */

function generateData(count, radius, margin) {
  return Array.from({length: count}, () => x = {
    cornerRadius: radius,
    id: Math.random().toString(36).substring(2, 15),
    margin: margin,
    status: Math.floor(Math.random() * 3),
  });
}

/*
 * config
 */

var debugEnabled = true;
var tileColors = {
  0: '#5bc182',
  1: '#e8e674',
  2: '#e55b5b'
}

/*
 * helper functions
 */

function log(msg, level='info') {
  if (debugEnabled) {
    if (typeof(msg) == 'string') {
      console.log(level+': '+msg);
    } else {
      console.log(msg);
    }
  }
}

/*
 * tilesylum
 *
 * Dynamic dashboard for monitoring conditions.
 *
 * Author: moenka <moenka@10forge.org>
 * Create: 2018-02-24
 *
 */

var base;
var baseHeight;
var baseWidth;
var data;
var grid;

function init() {
  base = d3.select('.herdmap');
  grid = base.append('svg');
  update();
  window.addEventListener("resize", update);
}

function update() {
  baseWidth = base.node().getBoundingClientRect().width;
  baseHeight = base.node().getBoundingClientRect().height;
  var dataCount = d3.select('#countInput').property('value');
  if (dataCount == '') { dataCount = 20 }
  var dataRadius = d3.select('#countRadius').property('value');
  if (dataRadius == '') { dataRadius = 0 }
  var dataMargin = d3.select('#countMargin').property('value');
  if (dataMargin == '') { dataMargin = 1 }
  var dataSort = d3.select('#sortStatus').property('checked');
  data = generateData(dataCount, dataRadius, dataMargin);
  herdmap = getHerdmap(data, baseWidth, baseHeight, dataSort);
  draw();
}

function draw() {
  grid.attr('width', baseWidth)
      .attr('height', baseHeight);

  var rect = grid.selectAll('rect')
      .data(herdmap);

  rect.transition()
      .delay(function(d, i) { return i*(1000/herdmap.length) })
      .duration(1000)
      .attr('x', function (d) { return d.x })
      .attr('y', function (d) { return d.y })
      .attr('rx', function (d) { return d.cornerRadius })
      .attr('ry', function (d) { return d.cornerRadius })
      .attr('width', function (d) { return d.length })
      .attr('height', function (d) { return d.length })
      .attr('fill', function(d) { return tileColors[d.status]; });

  rect.enter()
      .append('rect')
      .attr('x', function (d) { return d.x+(d.length/2) })
      .attr('y', function (d) { return d.y+(d.length/2) })
      .attr('rx', function (d) { return d.cornerRadius })
      .attr('ry', function (d) { return d.cornerRadius })
      .transition()
      .delay(function(d, i) { return i*(1000/herdmap.length) })
      .duration(1000)
      .attr('x', function (d) { return d.x })
      .attr('y', function (d) { return d.y })
      .attr('width', function (d) { return d.length })
      .attr('height', function (d) { return d.length })
      .attr('fill', function(d) { return tileColors[d.status]; });

  rect.exit()
      .transition()
      .duration(1000)
      .attr('x', function (d) { return d.x+(d.length/2) })
      .attr('y', function (d) { return d.y+(d.length/2) })
      .attr('width', 0)
      .attr('height', 0)
      .remove();
}

function getHerdmap(data, width, height, sort) {
  var entityCount = data.length;
  var mapCols = Math.floor(Math.sqrt((width/height)*entityCount));
  var mapRows = Math.ceil(Math.sqrt((height/width)*entityCount));
  if (mapCols*mapRows < entityCount) {
    mapRows++;
  }
  var tileLength = Math.floor(height/mapRows);

  if (sort) {
    data.sort(function(a, b) {
      return a.status-b.status;
    });
  }

  log('entityCount: '+entityCount);
  log('width: '+width);
  log('height: '+height);
  log('mapCols: '+mapCols);
  log('mapRows: '+mapRows);
  log('tileLength: '+tileLength);

  var entity = 0;
  for (var col = 0; col < mapCols; col++) {
    for (var row = 0; row < mapRows; row++) {
      if (entity >= entityCount) { break; }
      data[entity]['x'] = col*tileLength;
      data[entity]['y'] = row*tileLength;
      data[entity]['length'] = tileLength-data[entity]['margin'];
      entity++;
    }
  }

  log(data);
  return data;
}


init();
