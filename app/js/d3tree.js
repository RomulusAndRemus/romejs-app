let masterData =
  {
    "name": "App", "render": true, "children": [{
      'name': 'Container',
      'children': [
        { 'name': 'Aebutius', 'size': 3000 },
        {
          'name': 'Aelius',
          "render": true,
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

if (data) masterData = data[0];


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

let svg = d3.select(".canvas").append("svg")
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
          let thisId = "#" + el;
          d3.select(thisId + " circle").transition().duration(1200).style("fill", "black");
        }
      })
    }
  });
}

function renderRed(d) {
  // console.log(d)
  if (!d.render) {
    // console.log(d);
    return d._children ? "#42f4aa" : "#000000"
  } else {
    // console.log(d, 'this should be red')
    return "red"
  }
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

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", /* ****RENDER COLOR FUNCTIOOOOOOOOOOOOOOOOOOOOOOOON HERE*** */ '#42f4aa')
    .on("mouseout", function (d) { d._children ? d3.select(this).style("fill", renderRed) : d3.select(this).style("fill", renderRed) })
    .on("mouseover", function () { d3.select(this).style("fill", "white"); })

  nodeEnter.append("text")
    .attr("x", d => d.children || d._children ? -10 : 10)
    .attr("dy", ".35em")
    .attr("text-anchor", d => d.children || d._children ? "end" : "start")
    .text(d => d.name)
    .style("fill-opacity", 1e-6)
    .on("mouseover", linkLines)
    .on("mouseout", function () { expandLinks(); d3.select(this).style("fill", "white"); d3.select("line").remove() });

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
    .style("fill", renderRed/*d => d._children ? "#42f4aa" : "black"*/)

  nodeUpdate.select("text")
    .style("fill-opacity", 1)
    .attr("class", "text")
    .style("fill", "white");






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
    .attr("d", d => {
      let o = { x: source.x0, y: source.y0 }; return diagonal({ source: o, target: o });
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
    .attr("d", d => { let o = { x: source.x, y: source.y }; return diagonal({ source: o, target: o }) })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(d => {
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

let contextMenuShowing = false;

d3.select("body").on('contextmenu', function (d, i) {
  if (contextMenuShowing) {
    d3.event.preventDefault();
    d3.select("#popup").remove();
    contextMenuShowing = false;
  } else {
    d3_target = d3.select(d3.event.target);
    if (d3_target.classed("text")) {
      let originX = coordinates[d3_target.text()].place[1];
      let originY = coordinates[d3_target.text()].place[0];

      if (originX <= 85) {
        originX = "0px";
      } else {
        originX = originX - 85 +'px';
      }

      if (originY <= 65) {
        originY = "0px";
      } else {
        originY = originY - 65 +'px';
      }
      
      d3.event.preventDefault();
      contextMenuShowing = true;
      d = d3_target.datum();
      // Build the popup
      canvas = d3.select(".canvas");
      mousePosition = d3.mouse(canvas.node());
      
      popup = canvas.append("div")
      .attr("id", "popup")
      .style("left", originX)
      .style("top", originY);
      $("#popup").append(
        `<div class="card-header">
          <h6>` + d3_target.text() + `</h6>
        </div>
        <form>
          <div class="form-group">
            <label>Route path=</label>
            <input type="route-path" class="form-control" id="route-path" placeholder="e.g /Home">
          </div>
          <div class="form-group">
            <label>Select a component</label>
            <select class="form-control" id="component-list"></select>
          </div>
          <div class="form-check">
            <label class="form-check-label">
            <input type="checkbox" class="form-check-input" id="exact">  exact path?</label>
            <button type="submit" class="btn btn-primary btn-xs">Submit</button>
          </div>`);

      let components = Object.keys(data[1]);
      let options = '';
      components.forEach(comp => {
        options += '<option>' + comp + '</option>';
      })

      $('#component-list').append(options);

      $("button").click(e => {
        e.preventDefault();
        if ($("#route-path").val()) {
          $.post("/addroute", {
            node: d3_target.text(),
            route: $('#route-path').val(),
            exact: $('#id').val(),
            componentToRender: $('#component-list').val(),
            filePathObj: data[1],
            entry: data[2]
          }).then(()=> {
            d3.select("#popup").remove();
            contextMenuShowing = false;
          });
          $("#route-path").val("");
        }  
      })
    }
  }
});
