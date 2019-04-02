let data = [{
	cat: 'library', name: 'Strawberries', value: 21.7,
	icon: 'assets/strawberry.svg',
    desc: 
        'Acres Harvested: 217',
    season: 
        'Peak Season: April through June'
}, {
	cat: 'library sub', name: 'Blueberries', value: 37.8,
	icon: 'assets/blueberries.svg',
    desc: 
        'Acres Harvested: 378',
    season: 
        'Peak Season: June through August'
}, {
	cat: 'framework', name: 'Apples', value: 201.7,
	icon: 'assets/apple.svg',
	desc: 
        'Acres Harvested: 2,017',
    season: 
        'Peak Season: September through October'
}, {
    cat: 'tooling', name: 'Bell Peppers', value: 42.5,
	icon: 'assets/capsicum.svg',
	desc: 
        'Acres Harvested: 425',
    season: 
        'Peak Season: July through September'
}, {
	cat: 'backend', name: 'Corn', value: 392.2,
	icon: 'assets/corn.svg',
	desc:
        'Acres Harvested: 3,922',
    season: 
        'Peak Season: March through May'
}, {
	cat: 'platform', name: 'Eggplant', value: 18.3,
	icon: 'assets/eggplant.svg',
	desc: 
        'Acres Harvested: 183',
    season: 
        'Peak Season: July through October'
}, {
	cat: 'language', name: 'Pears', value: 16.8,
	icon: 'assets/pear.svg',
	desc: 
        'Acres Harvested: 168',
    season: 
        'Peak Season: August through December'
}, {
	cat: 'workflow', name: 'Pumpkins', value: 136,
	icon: 'assets/pumpkin.svg',
	desc: 
        'Acres Harvested: 1,360',
    season: 
        'Peak Season: September through November'
}, {
	cat: 'legacy', name: 'Zucchini', value: 21.7,
	icon: 'assets/zucchini.svg',
	desc: 
        'Acres Harvested: 217',
    season: 
        'Peak Season: June through August'
}, {
	cat: 'legacy tooling', name: 'Lettuce', value: 6.8,
	icon: 'assets/lettuce.svg',
	desc: 
        'Acres Harvested: 68',
    season: 
        'Peak Season: May through October'
}, 	{
    cat: 'library', name: 'Peaches', value: 40.7,
    icon: 'assets/peach.svg',
    desc: 
        'Acres Harvested: 407',
    season: 
        'Peak Season: July through September'
},  {
	cat: 'legacy tooling', name: 'Tomatoes', value: 65,
	icon: 'assets/tomato.svg',
	desc: 
        'Acres Harvested: 650',
    season: 
        'Peak Season: July through September'
},  {
	cat: 'legacy tooling', name: 'Cucumbers', value: 16.1,
	icon: 'assets/cucumber.svg',
	desc: 
        'Acres Harvested: 161',
    season: 
        'Peak Season: July through October'
}, {
    cat: 'legacy tooling', name: 'Raspberries', value: 8.6,
    icon: 'assets/raspberry.svg',
    desc: 
        'Acres Harvested: 86',
    season: 
        'Peak Season: July through September'
}, {	
    cat: 'legacy tooling', name: 'Grapes', value: 53.6,
    icon: 'assets/grapes.svg',
    desc: 
        'Acres Harvested: 536',
    season: 
        'Peak Season: September through October'
}, {
    cat: 'legacy tooling', name: 'Cherries', value: 1.6,
    icon: 'assets/cherries.svg',
    desc: 
        'Acres Harvested: 16',
    season: 
        'Peak Season: July'
}, {
    cat: 'legacy tooling', name: 'Melons', value: 4.2,
    icon: 'assets/melon.svg',
    desc: 
        'Acres Harvested: 42',
    season: 
        'Peak Season: July through October'
}, {
    cat: 'legacy tooling', name: 'Broccoli', value: 4.5,
    icon: 'assets/broccoli.svg',
    desc: 
        'Acres Harvested: 45',
    season: 
        'Peak Season: June through November'
}, 	
    ];

/*eslint-enable indent*/
/*global d3*/
let svg = d3.select('#teck-stack-svg');
let width = svg.property('clientWidth'); // get width in pixels
let height = +svg.attr('height');
let centerX = width * 0.5;
let centerY = height * 0.5;
let strength = 0.05;
let focusedNode;
console.log('width', width);

let format = d3.format(',d');

// let scaleColor = d3.scaleOrdinal(d3.schemeCategory20);

// use pack to calculate radius of the circle
let pack = d3.pack()
	.size([width, height ])
	.padding(1.5);

let forceCollide = d3.forceCollide(d => d.r + 1);

// use the force
let simulation = d3.forceSimulation()
	// .force('link', d3.forceLink().id(d => d.id))
	.force('charge', d3.forceManyBody())
	.force('collide', forceCollide)
	// .force('center', d3.forceCenter(centerX, centerY))
	.force('x', d3.forceX(centerX ).strength(strength))
	.force('y', d3.forceY(centerY ).strength(strength));

// reduce number of circles on mobile screen due to slow computation
if ('matchMedia' in window && window.matchMedia('(max-device-width: 767px)').matches) {
	data = data.filter(el => {
		return el.value >= 50;
	});
}

let root = d3.hierarchy({ children: data })
	.sum(d => d.value);

// we use pack() to automatically calculate radius conveniently only
// and get only the leaves
let nodes = pack(root).leaves().map(node => {
	// console.log('node:', node.x, (node.x - centerX) * 2);
	const data = node.data;
	return {
		x: centerX + (node.x - centerX) * 3, // magnify start position to have transition to center movement
		y: centerY + (node.y - centerY) * 3,
		r: 0, // for tweening
		radius: node.r, //original radius
		id: data.cat + '.' + (data.name.replace(/\s/g, '-')),
		cat: data.cat,
		name: data.name,
		value: data.value,
		icon: data.icon,
        desc: data.desc,
        season: data.season
	};
});
simulation.nodes(nodes).on('tick', ticked);

svg.style('background-color', '#90EE90');
let node = svg.selectAll('.node')
	.data(nodes)
	.enter().append('g')
	.attr('class', 'node')
	.call(d3.drag()
		.on('start', (d) => {
			if (!d3.event.active) { simulation.alphaTarget(0.2).restart(); }
			d.fx = d.x;
			d.fy = d.y;
		})
		.on('drag', (d) => {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		})
		.on('end', (d) => {
			if (!d3.event.active) { simulation.alphaTarget(0); }
			d.fx = null;
			d.fy = null;
		}));

node.append('circle')
	.attr('id', d => d.id)
	.attr('r', 0)
	.style('fill', '#FFD700') //d => scaleColor(d.cat)
	.transition().duration(2000).ease(d3.easeElasticOut)
		.tween('circleIn', (d) => {
			let i = d3.interpolateNumber(0, d.radius);
			return (t) => {
				d.r = i(t);
				simulation.force('collide', forceCollide);
			};
		});

node.append('clipPath')
	.attr('id', d => `clip-${d.id}`)
	.append('use')
	.attr('xlink:href', d => `#${d.id}`);

// display text as circle icon
node.filter(d => !String(d.icon).includes('assets/'))
	.append('text')
	.classed('node-icon', true)
	.attr('clip-path', d => `url(#clip-${d.id})`)
	.selectAll('tspan')
	.data(d => d.icon.split(';'))
	.enter()
		.append('tspan')
		.attr('x', 0)
		.attr('y', (d, i, nodes) => (13 + (i - nodes.length / 2 - 0.5) * 10))
		.text(name => name);

// display image as circle icon
node.filter(d => String(d.icon).includes('assets/'))
	.append('image')
	.classed('node-icon', true)
	.attr('clip-path', d => `url(#clip-${d.id})`)
	.attr('xlink:href', d => d.icon)
	.attr('x', d => -d.radius * 0.7)
	.attr('y', d => -d.radius * 0.7)
	.attr('height', d => d.radius * 2 * 0.7)
	.attr('width', d => d.radius * 2 * 0.7);

node.append('title')
	.text(d => (d.cat + '::' + d.name + '\n' + format(d.value)));

let infoBox = node.append('foreignObject')
	.classed('circle-overlay hidden', true)
	.attr('x', -350 * 0.5 * 0.8)
	.attr('y', -350 * 0.5 * 0.8)
	.attr('height', 350 * 0.8)
	.attr('width', 350 * 0.8)
		.append('xhtml:div')
		.classed('circle-overlay__inner', true);

infoBox.append('h2')
	.classed('circle-overlay__title', true)
	.text(d => d.name);

infoBox.append('h3')
	.classed('circle-overlay__body', true)
    .html(d => d.desc);

    infoBox.append('h3')
	.classed('circle-overlay__body', true)
    .html(d => d.season);


node.on('click', (currentNode) => {
	d3.event.stopPropagation();
	console.log('currentNode', currentNode);
	let currentTarget = d3.event.currentTarget; // the <g> el

	if (currentNode === focusedNode) {
		// no focusedNode or same focused node is clicked
		return;
	}
	let lastNode = focusedNode;
	focusedNode = currentNode;

	simulation.alphaTarget(0.2).restart();
	// hide all circle-overlay
	d3.selectAll('.circle-overlay').classed('hidden', true);
	d3.selectAll('.node-icon').classed('node-icon--faded', false);

	// don't fix last node to center anymore
	if (lastNode) {
		lastNode.fx = null;
		lastNode.fy = null;
		node.filter((d, i) => i === lastNode.index)
			.transition().duration(2000).ease(d3.easePolyOut)
			.tween('circleOut', () => {
				let irl = d3.interpolateNumber(lastNode.r, lastNode.radius);
				return (t) => {
					lastNode.r = irl(t);
				};
			})
			.on('interrupt', () => {
				lastNode.r = lastNode.radius;
			});
	}

	// if (!d3.event.active) simulation.alphaTarget(0.5).restart();

	d3.transition().duration(2000).ease(d3.easePolyOut)
		.tween('moveIn', () => {
			console.log('tweenMoveIn', currentNode);
			let ix = d3.interpolateNumber(currentNode.x, centerX);
			let iy = d3.interpolateNumber(currentNode.y, centerY);
			let ir = d3.interpolateNumber(currentNode.r, centerY * 0.5);
			return function (t) {
				// console.log('i', ix(t), iy(t));
				currentNode.fx = ix(t);
				currentNode.fy = iy(t);
				currentNode.r = ir(t);
				simulation.force('collide', forceCollide);
			};
		})
		.on('end', () => {
			simulation.alphaTarget(0);
			let $currentGroup = d3.select(currentTarget);
			$currentGroup.select('.circle-overlay')
				.classed('hidden', false);
			$currentGroup.select('.node-icon')
				.classed('node-icon--faded', true);

		})
		.on('interrupt', () => {
			console.log('move interrupt', currentNode);
			currentNode.fx = null;
			currentNode.fy = null;
			simulation.alphaTarget(0);
		});

});

// blur
d3.select(document).on('click', () => {
	let target = d3.event.target;
	// check if click on document but not on the circle overlay
	if (!target.closest('#circle-overlay') && focusedNode) {
		focusedNode.fx = null;
		focusedNode.fy = null;
		simulation.alphaTarget(0.2).restart();
		d3.transition().duration(2000).ease(d3.easePolyOut)
			.tween('moveOut', function () {
				console.log('tweenMoveOut', focusedNode);
				let ir = d3.interpolateNumber(focusedNode.r, focusedNode.radius);
				return function (t) {
					focusedNode.r = ir(t);
					simulation.force('collide', forceCollide);
				};
			})
			.on('end', () => {
				focusedNode = null;
				simulation.alphaTarget(0);
			})
			.on('interrupt', () => {
				simulation.alphaTarget(0);
			});

		// hide all circle-overlay
		d3.selectAll('.circle-overlay').classed('hidden', true);
		d3.selectAll('.node-icon').classed('node-icon--faded', false);
	}
});

function ticked() {
	node
		.attr('transform', d => `translate(${d.x},${d.y})`)
		.select('circle')
			.attr('r', d => d.r);
}