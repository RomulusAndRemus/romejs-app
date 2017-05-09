let rightClickRouteID = null;
let rightClickXnY = null;
//when rightclick add route, this = ID

let contextMenuShowing = false;

let masterData =
  {
    "name": "App", "children": [{
      'name': 'Container',
      'children': [
        { 'name': 'Aebutius', 'size': 3000 },
        {
          'name': 'Aelius',
          'children': [
            { 'name': 'Atius', 'size': 3000, "links": ["Ship", "Compo3"] },
            { 'name': 'Aurelius' }
          ]
        },
        { 'name': 'Curius', links: 4000, size: 3000 },
        {
          'name': 'Genucius', 'children': [
            { 'name': 'Herennius', 'size': 3000, "links": ["Ship", "Compo3"] },
            { 'name': 'Geminius' }
          ], 'size': 3000
        },
        {
          'name': 'Livius', 'children': [
            { 'name': 'Mike', 'size': 3000, "links": ["Ship", "Compo3"] },
            {
              'name': 'Pontius', 'children': [
                { 'name': 'Papirius', 'size': 3000, "links": ["Ship", "Compo3"] },
                {
                  'name': 'Salonius', 'children': [
                    { 'name': 'Seius', 'size': 3000, "links": ["Ship", "Compo3"] },
                    { 'name': 'Sergius', }, { "name": "Servilius" }, { "name": "Sextius" }, { "name": "Sicinius" }
                  ]
                }
              ]
            }
          ], 'size': 3000
        },
        { 'name': 'Tullius', 'size': 3000 },
        { 'name': 'Ulpius', 'size': 3000 },
        {
          'name': 'Valerius', 'children': [
            { 'name': 'Vitruvius', 'size': 3000, "links": ["Ship", "Compo3"] },
            { 'name': 'Vipsanius' }
          ], 'size': 3000
        },
        { 'name': 'Numicius', 'size': 3000 },
        { 'name': 'Naevius', 'size': 3000 },
        {
          'name': 'Nautius', 'children': [{ 'name': 'Jupiter' },
          { 'name': 'Lucilius', 'size': 3000, "links": ["Ship", "Compo3"] },
          { 'name': 'Joel' }
          ], 'size': 3000
        },
        { 'name': 'Manlius', 'size': 3000 },
        { 'name': 'Minius', 'size': 3000 },
        {
          'name': 'Lartius', 'children': [
            { 'name': 'Dulius', 'size': 3000, "links": ["Ship", "Compo3"] },
            { 'name': 'Didius' }
          ], 'size': 3000
        },
        { 'name': 'Cloelius', 'size': 3000 },
        { 'name': 'Artorius', 'size': 3000 },
      ],
    }]
  }

// if (data) masterData = data;

//replace with the data you get from Steve
const routeLinks = {
  "Joel": ["Seius", "Sergius", "Servilius", "Sextius", "Sicinius", "Curius", "Oidius", "Minius", "Container", "Aebutius"],
  "App": ["Ulpius", "Curius", "Numicius"],
  "Mike": ["Vipsanius", "Ulpius", "Oidius", "App", "Sergius"]
}

const links = Object.keys(routeLinks);

//coordinates holds where the lasers should go

const coordinates = {};
let masterIdx = 0;
let interCount = 0;


const margin = { top: 0, right: 20, bottom: 20, left: 80 },
  width = 1600 - margin.right - margin.left,
  height = 420 - margin.top - margin.bottom;

let i = 0,
  duration = 750,
  root;

let tree = d3.layout.tree()
  .size([height, width]);

let diagonal = d3.svg.diagonal()
  .projection(d => [d.y, d.x]);

let svg = d3.select("body").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


root = masterData;
root.x0 = height / 2;
root.y0 = 0;

function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

root.children.forEach(collapse);
update(root);


d3.select(self.frameElement).style("height", "800px");

let originate;

function linkLines(linkData) {
  d3.select(this).style("fill", "#42f4aa")

  let originX = coordinates[d3.select(this).text()].place[1]
  let originY = coordinates[d3.select(this).text()].place[0]

  originate = d3.select(this).text();

  links.forEach(link => {
    if (d3.select(this).text() === link) {
      routeLinks[link].forEach(el => {
        if (coordinates[el]) {
          let destX = coordinates[el].place[1];
          let destY = coordinates[el].place[0];
          let thisId = "#" + el;

          d3.select(thisId + " circle").transition().duration(1200).style("fill", "red");

          svg.append("line").style("stroke", "red").style("stroke-width", "0.8px").attr("x1", originX)
            .attr("y1", originY).attr("x2", destX).attr("y2", destY).transition().duration(2000).style("stroke", "black").remove();
        }
      });
    }
  });
}

function expandLinks(linkData) {
  links.forEach(link => {
    if (originate === link) {
      routeLinks[link].forEach(el => {
        if (coordinates[el]) {
          let thisId = "#" + routeLinks[originate][l];
          d3.select(thisId + " circle").transition().duration(1200).style("fill", "black");
        }
      })
    }
  });
}


function rightClickMenu(){
  let originX = coordinates[d3.select(this).text()].place[1]
  let originY = coordinates[d3.select(this).text()].place[0]

  console.log(originX)  
}

function update(source) {
  // Compute the new tree layout.
  let nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(d => { d.y = d.depth * 180; });

  // Update the nodes…
  let node = svg.selectAll("g.node")
    .data(nodes, d => d.id || (d.id = ++i));

  // Enter any new nodes at the parent's previous position.
  let nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", d => "translate(" + source.y0 + "," + source.x0 + ")")
    .on("click", click);

  // console.log(nodeEnter.append("circle")
  //     .attr("r", 1e-6)
  //     .style("fill", function(d) { return d._children ? "#42f4aa" : "#000000"; })
  //     .on("mouseout", function(d){ return d._children ? d3.select(this).style("fill", "#42f4aa") : d3.select(this).style("fill", "black");})
  //     .on("mouseover", function(){d3.select(this).style("fill", "white")}))

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", d => d._children ? "#42f4aa" : "#000000")
    .on("mouseout", function (d) { d._children ? d3.select(this).style("fill", "#42f4aa") : d3.select(this).style("fill", "black")})
    .on("mouseover", function () { d3.select(this).style("fill", "white"); })
    .on("contextmenu", rightClickMenu);



  nodeEnter.append("text")
    .attr("x", d => d.children || d._children ? -10 : 10)
    .attr("dy", ".35em")
    .attr("text-anchor", d => d.children || d._children ? "end" : "start")
    .text(d => d.name)
    .style("fill-opacity", 1e-6)
    .on("mouseover", linkLines)
    .on("mouseout", function () { expandLinks(); d3.select(this).style("fill", "white"); d3.select("line").remove() })





  // Transition nodes to their new position.
  let nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function (d) {
      coordinates[d3.select(this).text().toString()] = { 'place': [d.x, d.y], 'order': masterIdx }; masterIdx++; return "translate(" + d.y + "," + d.x + ")";
    })
    .attr("id", function (d) { return d3.select(this).text().toString() });
  //UPDATE WHERE THE COORDINATES ARE.

  nodeUpdate.select("circle")
    .attr("r", 8)
    .style("fill", d => d._children ? "#42f4aa" : "black")

  nodeUpdate.select("text")
    .style("fill-opacity", 1)
    .style("fill", "white")

  // Transition exiting nodes to the parent's new position.
  let nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function (d) { for (let key in coordinates) { delete coordinates[d3.select(this).text().toString()] }; masterIdx = 0; return "translate(" + source.y + "," + source.x + ")"; })
    .remove();
  //UPDATE ALL CHILDREN COORDINATES TO BE THE PARENTS


  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  // Update the links…
  let link = svg.selectAll("path.link")
    .data(links, d => d.target.id)

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", d => { let o = { x: source.x0, y: source.y0 }; return diagonal({ source: o, target: o });
  })
  
  // Transition links to their new position.
  repeat();

  function repeat() {
    link.transition()
    .duration(duration)
    .attr("d", diagonal)
    .transition().duration(2400).style("stroke", "#42f4aa")
    .transition().duration(2400).style("stroke", "#1b6346")
    .each("end", repeat);
  }

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", d => { let o = { x: source.x, y: source.y }; return diagonal({ source: o, target: o })})
    .remove();

  // Stash the old positions for transition.
  nodes.forEach( d => {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}



contextMenuShowing = false;

d3.select("body").on('contextmenu',function (d,i) {
    if(contextMenuShowing) {
        d3.event.preventDefault();
        d3.select(".popup").remove();
        contextMenuShowing = false;
    } else {
        d3_target = d3.select(d3.event.target);
        if (d3_target.classed("node")) {
            d3.event.preventDefault();
            contextMenuShowing = true;
            d = d3_target.datum();
            // Build the popup
            
            canvas = d3.select('canvas');
            mousePosition = d3.mouse(canvas.node());
            
            popup = canvas.append("div")
                .attr("class", "popup")
                .style("left", mousePosition[0] + "px")
                .style("top", mousePosition[1] + "px");
            popup.append("h2").text(d.display_division);
            popup.append("p").text(
                "Fun.")
            popup.append("p"); 
            
            canvasSize = [
                canvas.node().offsetWidth,
                canvas.node().offsetHeight
            ];
            
            popupSize = [ 
                popup.node().offsetWidth,
                popup.node().offsetHeight
            ];
            
            if (popupSize[0] + mousePosition[0] > canvasSize[0]) {
                popup.style("left","auto");
                popup.style("right",0);
            }
            
            if (popupSize[1] + mousePosition[1] > canvasSize[1]) {
                popup.style("top","auto");
                popup.style("bottom",0);
            }
        }
    }
});