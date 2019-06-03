import * as d3 from 'd3';
  
(async function() {
  const [viewBoxWidth, viewBoxHeight] = [1000, 400];
  const svg = d3.select('svg'),
      margin = {top: 40, right: 40, bottom: 40, left: 40},
      width = viewBoxWidth - margin.left - margin.right,
      height = viewBoxHeight - margin.top - margin.bottom;
  
  const formatValue = d3.format(',d');
  
  const x = d3.scaleLog()
      .rangeRound([0, width]);
  
  const g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
  const data = await d3.csv('flare.csv', type as RequestInit);

  x.domain(d3.extent(data, d => (d as any).value) as any);
  
  const simulation = d3.forceSimulation(data)
      .force('x', d3.forceX(d => x((d as any).value)).strength(1))
      .force('y', d3.forceY(height / 2))
      .force('collide', d3.forceCollide(4))
      .stop();
  
  for (let i = 0; i < 120; ++i) {
    simulation.tick();
  }
  
  g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).ticks(20, '.0s'));
  
  const cell = g.append('g')
      .attr('class', 'cells')
    .selectAll('g').data(d3.voronoi()
        .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
        .x(d => (d as any).x)
        .y(d => (d as any).y)
      .polygons(data as any)).enter().append('g');
  
  cell.append('circle')
      .attr('r', 3)
      .attr('cx', (d: any) => d.data.x)
      .attr('cy', (d: any) => d.data.y);
  
  cell.append('path')
      .attr('d', (d: any) => 'M' + d.join('L') + 'Z');
  
  cell.append('title')
      .text((d: any) => d.data.id + '\n' + formatValue(d.data.value));
  
  function type(d) {
    if (!d.value) return;
    d.value = +d.value;
    return d;
  }
})();
