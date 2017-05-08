import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

class D3 extends Component {

  displayName: 'Component Tree';

  propTypes: {
    id: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number
  }

  componentDidMount() {
    let root = this.props.masterData;
    root.x0 = this.props.height / 2;
    root.y0 = 0;
    this.update(root, this.setContext(), this.props);
  }

  componentDidUpdate() {
    console.log('COMPONENT WANTS TO UPDATE')
  }

  setContext() {
    const { height, width, id, margin } = this.props;
    return d3.select(this.refs.tree).append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.right + margin.left)
      .attr('id', 'd3-tree')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
  }

  click(d, update, currNode) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d, this.setContext(), this.props, currNode);
  }

  update(source, svg, context, myNode) {
    let currNode = ReactDOM.findDOMNode(this);
    if (myNode) currNode = myNode;
    let i = 0;
    let tree = d3.layout.tree()
      .size([context.height, context.width]);

    let diagonal = d3.svg.diagonal()
      .projection((d) => { return [d.y, d.x]; });
    // Compute the new tree layout.
    let nodes = tree.nodes(source).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach((d) => { d.y = d.depth * 180; });

    // Update the nodes…
    let node = svg.selectAll("g.node")
      .data(nodes, (d) => { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    let nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", (d) => { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", (d) => this.click(d, this.update, ReactDOM.findDOMNode(this)));

    nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", (d) => { return d._children ? "#42f4aa" : "#000000"; })
      .on("mouseout", (d) => { return d._children ? d3.select(currNode).style("fill", "#42f4aa") : d3.select(currNode).style("fill", "black"); })
      .on("mouseover", () => { d3.select(currNode).style("fill", "white"); });

    nodeEnter.append("text")
      .attr("x", (d) => { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", (d) => { return d.children || d._children ? "end" : "start"; })
      .text((d) => { return d.name; })
      .style("fill-opacity", 1e-6)
      .on("mouseout", (d) => { return d3.select(currNode).style("fill", "white")})
      .on("mouseover", () => { d3.select(currNode).style("fill", "#42f4aa");});

    // Transition nodes to their new position.
    
    let nodeUpdate = node.transition()
      .duration(context.duration)
      .attr("transform", (d) => {
         
        console.log('INSIDE UPDATE', currNode)
        context.coordinates[d3.select(currNode).text().toString()] = {'place':[d.x, d.y]}; return "translate(" + d.y + "," + d.x + ")"; })
        .attr("id", (d) => { return d3.select(currNode).text().toString()} );

    //UPDATE WHERE THE COORDINATES ARE.
    nodeUpdate.select("circle")
      .attr("r", 8)
      .style("fill", (d) => { return d._children ? "#42f4aa" : "black"; });

    nodeUpdate.select("text")
      .style("fill-opacity", 1)
      .style("fill", "white");

    // Transition exiting nodes to the parent's new position.
    let nodeExit = node.exit().transition()
      .duration(context.duration)
      .attr("transform", (d) => { for (let key in context.coordinates){delete context.coordinates[d3.select(currNode).text().toString()]}; return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

    //UPDATE ALL CHILDREN COORDINATES TO BE THE PARENTS
    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);
    // Update the links…
    let link = svg.selectAll("path.link")
      .data(links, (d) => { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", (d) => {
        let o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

    svg.append("line").style("stroke", "white").attr("x1", 180).attr("y1",380).attr("x2", 180).attr("y2", 228);

    // Transition links to their new position.
    link.transition()
      .duration(context.duration)
      .attr("d", diagonal)
      .transition().duration(2400).style("stroke", "#42f4aa")
      .transition().duration(2400).style("stroke", "#1b6346")
      .transition().duration(2400).style("stroke", "#42f4aa")
      .transition().duration(2400).style("stroke", "#1b6346")
      .transition().duration(2400).style("stroke", "#42f4aa")
      .transition().duration(2400).style("stroke", "#1b6346")

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(context.duration)
      .attr("d", (d) => {
        let o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }




  render() {
    return (
      <div ref="tree"></div>
    )
  }
}

export default D3;
