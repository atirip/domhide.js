# domhide.js

Small utility to hide / reveal DOM nodes

## Intro

Long, picture heavy, pages are browser killers, especially on mobile. Load enough images and your browser crashes. Inspiration for this utility came from [LinkedIn for iPad: 5 techniques for smooth infinite scrolling in HTML5](http://engineering.linkedin.com/linkedin-ipad-5-techniques-smooth-infinite-scrolling-html5) "Technique #3: removing pages". I do not know what they _actually_ did, but I developed my own version of the idea.

`domhide.js` is written in vanilla Javascript and has no dependancies.

## How it works
The idea behind `domhide.js` is to preserve tag's dimensions and remove all tag's children from DOM, effectively freeing memory (especially useful with image tags). Tag's innerHTML property is inserted back into DOM as a comment node. To reverse that, to reveal tag's innards, that comment nodes value is inserted back as HTML and the comment node itself is deleted. 

To preserve dimensions during hide (if tag's dimensions are volatile and depends of inner tags's dimensions) we check if tag has width/height set in style attribute (inline CSS). If not, width/height are measured and inline style for width/height is temporarily added. 

As a semaphore, attribute data-domhide="W,H" is also added to the hidden tag. The value of this attribute signals whither domhide.js set inline style (W or H are not 0) or not (W or H are 0).

## Usage:

**Include domhide.js:**

    <script src="path/to/domhide.js" type="text/javascript"></script>

**Available methods**

	hiddenNode(node);
	hideNode(node, deep, escape);
	revealNode(node, deep, escape);

Where:  
__node__ is single, pure vanilla Javascript DOM Node ( or in jQuery something like $('foo')[0] )  
__deep__ whether to use deep hide, default is true  
__escape__ whether to escape html to be hidden, default is true  

Notes:  
Parameter __deep__ exist to fake `domhide.js` behaviour. In no deep mode nothing get's removed from DOM, only tags visibility CSS attribute is set to 'hidden'.   
Parameter __escape__ exist to speed up hiding/revealing in very extreme occasions and when you are 100% sure that there's no HTML comments in HTML you are going to hide. Speed bump is not great, but there's some ms to win.

####Limitations
__NB!__ `domhide.js` destroys all event handlers for tag's childrens (but not for that tag itself) and they are not reinstalled. Do use domhide only on tags with "plain" children.

To overcome this limitation you may consider of setting event handler on tag istelf like below
Lets' say we have HTML like this

	<div id=parent>
		<div class=child>
			<a href="#">foo</a>
		</div>
		<div class=child>
			<a href="#">foo</a>
		</div>	
	</div>

And there are click handlers on A tags set with jQuery:

	$('#parent a').bind('click', function() { …do stuff with $(this) … });

Those handlers are destroyed when you use domhide on #parent. To cure that we set one click handler to #parent:

	$('#parent').bind('click', function(event) {
		var target;
		if ( (target = $(event.target).closest('a', $(this))).length ) {
			… do stuff with target …  
		} 
	});

#### At the back-end
You can prehide tag's at the back-end, it is advisable to do so when content is to be hidden in browser at first anyway. To prehide piece of dom used as a sample above do this

	<div id=parent data-domhide="0,0"><!--
		<div class=child>
			<a href="#">foo</a>
		</div>
		<div class=child>
			<a href="#">foo</a>
		</div>	
	--></div>

1. add attribute data-domhide="0,0" 
2. wrap content into comment tags, __DO NOT__ leave any spaces, tabs, line-break's inside tag

## Demo

Simple [demo](http://atirip.github.io/domhide.js/hide.html)  
Click once to hide, click again to reavel. Inspect DOM to see what happens.

## Compatible

Tested on Firefox 16, Chrome 23, Opera 12 on Mountain Lion and Windows, IE 8, IE 7 on Windows
(Windows XP under Parallels 7).

## TODO

* nothing I know of.

## Contact me

For support, remarks and requests, please mail me at [atirip@yahoo.com](mailto:atirip@yahoo.com).

## License

Copyright (c) 2012 Priit Pirita, released under the MIT license.

