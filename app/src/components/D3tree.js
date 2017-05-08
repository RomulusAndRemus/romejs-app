import React, { Component, PropTypes } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import { connect } from 'react-redux';
import * as d3 from 'd3';

class D3 extends Component {

  render() {
    let createHook = (comp, elem, statename) => {
      let elems = new Map(),
        interval
      setTimeout(updateState)
      comp.isAnimating = () => !!interval
      return (transition) => {
        transition.each((e) =>{
          elems.set(e,(elems.get(e) || new Set()).add(transition.id))
          interval = interval || setInterval(updateState,16)
        })
        transition.each("end",(e) =>{
          let anims = elems.get(e)
          anims.delete(transition.id)
          if (anims.size){
            elems.set(e,anims)
          } else {
            elems.delete(e)
          }
          if (!elems.size) interval = clearInterval(interval)
        })
      }
    }

    let hook = createHook(this, ReactFauxDOM);

    let masterData =
      {
        'name': 'App',
        'children': [
          { 'name': 'Container', 'size': 3000 },
          {
            'name': 'Puck',
            'children': [
              { 'name': 'Puckpuck', 'size': 3000, "links": ["Ship", "Compo3"] },
              { 'name': 'Container' }
            ]
          },
          { 'name': 'Ship', links: 4000, size: 3000 },
          { 'name': 'Compo2', 'size': 3000 },
          { 'name': 'Compo3', 'size': 3000 },
        ],
      }

    let routeLinks = {
      "Puck": ["Ship", "Puckpuck"],
      "App": ["Container", "Ship"],
      "Ship": ["Compo2", "Compo3", "Container", "App", "Puckpuck"]
    }

    let coordinates = {};
    let masterIdx = 0;
    let interCount = 0;


    let margin = { top: 20, right: 120, bottom: 20, left: 160 },
      width = 960 - margin.right - margin.left,
      height = 800 - margin.top - margin.bottom;

    let i = 0,
      duration = 750,
      root;

    let tree = d3.layout.tree()
      .size([height, width]);

    let diagonal = d3.svg.diagonal()
      .projection(function (d) { return [d.y, d.x]; });

    const div = new ReactFauxDOM.Element('div');

    let svg = d3.select(div).append("svg")
    // let svg = d3.select('div').append("svg")
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

    function linkLines(linkData) {
      d3.select(this).style("fill", "#42f4aa")

      let originX = coordinates[d3.select(this).text()].place[1]
      let originY = coordinates[d3.select(this).text()].place[0]

      for (let k = 0; k < Object.keys(routeLinks).length; k++) {
        if (d3.select(this).text() === Object.keys(routeLinks)[k]) {
          for (let joel = 0; joel < routeLinks[d3.select(this).text()].length; joel++) {
            if (coordinates[routeLinks[d3.select(this).text()][joel]]) {
              let destX = coordinates[routeLinks[d3.select(this).text()][joel]].place[1]
              let destY = coordinates[routeLinks[d3.select(this).text()][joel]].place[0]

              svg.append("line").style("stroke", "red").style("stroke-width", "2px").attr("x1", originX)
                .attr("y1", originY).attr("x2", destX).attr("y2", destY).transition().duration(2000).style("stroke", "black").remove()
            }
          }
        }
      }
    }

    function update(source) {
      // Compute the new tree layout.
      let nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);
      // Normalize for fixed-depth.
      nodes.forEach(function (d) { 
        d.y = d.depth * 180; 
      });

      // Update the nodes…
      let node = svg.selectAll("g.node")
        .data(nodes, function (d) { return d.id = d.name; });
      // Enter any new nodes at the parent's previous position.
      let nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr('id', (d) => d.name)
        .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click);

      nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function (d) { return d._children ? "#42f4aa" : "#000000"; })
        .on("mouseout", function (d) { return d._children ? d3.select(this).style("fill", "#42f4aa") : d3.select(this).style("fill", "black"); })
        .on("mouseover", function () { d3.select(this).style("fill", "white"); });

      nodeEnter.append("text")
        .attr("x", function (d) { return d.children || d._children ? -10 : 10; })
        .attr("dy", ".35em")
        .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
        .text(function (d) { return d.name; })
        .style("fill-opacity", 1e-6)
        .on("mouseover", linkLines)
        .on("mouseout", function (d) { d3.select('#' + d.name).style("fill", "white"); d3.select("line").remove() })
      console.log('THIS IS NODE ', node.transition)
      let nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) { 
          coordinates[d.name] = { 'place': [d.x, d.y], 'order': masterIdx }; masterIdx++; 
          
          console.log('COORDS!!! ', d);
          return "translate(" + d.y + "," + d.x + ")";
        })
        .attr("id", function (d) { 
          console.log('TRYING TO SET ID IN NODEUPDATE ', d)
          return d.name})
        .call(hook);
        
      nodeUpdate.select("circle")
        .attr("r", 8)
        .attr('class', 'FAAAAUCKKKKKKKK')
        .style("fill", function (d) { 
          console.log('INSIDE NODE UPDATE CIRCLE ', d)
          return d._children ? "#42f4aa" : "black"; })

      nodeUpdate.select("text")
        .style("fill-opacity", 1)
        .style("fill", "white")

      let nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) { for (let key in coordinates) { delete coordinates[d.name]}; masterIdx = 0; return "translate(" + source.y + "," + source.x + ")"; })
        .remove();
      //UPDATE ALL CHILDREN COORDINATES TO BE THE PARENTS


      nodeExit.select("circle")
        .attr("r", 1e-6);

      nodeExit.select("text")
        .style("fill-opacity", 1e-6);

      let link = svg.selectAll("path.link")
        .data(links, function (d) { 
          console.log('THIS IS LINK, ', d)
          return d.target.id; })
        
      link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function (d) {
          console.log('INSIDE ENTER LINK ', d)
          let o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        })
      console.log('link.transition ', JSON.stringify(link.transition, null, 2))
      link.transition()
        .duration(() => {
          console.log('IN TRANSITION')
          return duration;
        })
        .attr("d", diagonal)
        .transition().duration(2400).style("stroke", () => {
          console.log('APPLYING STROKE');
          return "#42f4aa";
        })
        .transition().duration(2400).style("stroke", "#1b6346")
        .transition().duration(2400).style("stroke", "#42f4aa")
        .transition().duration(2400).style("stroke", "#1b6346")

      link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
          console.log('EXIT ', d)
          var o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        })
        .remove();

      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

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

    return div.toReact()

  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    // You can now say this.props.books
    componentData: state.componentData
  }
};

export default connect(mapStateToProps)(D3);
