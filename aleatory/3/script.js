
const numOfPages = 100;
const text = Array(numOfPages).fill(0)
  .map((_, i) => 
    `
      <div class="page" id="page-${i}"></div>
    `
  );
$('#pagecontainer').html(text);

function isScrolledIntoView(elem){
  var win = $(window);

  var viewport = {
      top : win.scrollTop(),
      left : win.scrollLeft()
  };
  viewport.right = viewport.left + window.innerWidth;
  viewport.bottom = viewport.top + window.innerHeight;

  var elem = $(elem);
  var bounds = elem.offset();
  bounds.right = bounds.left + elem.outerWidth();
  bounds.bottom = bounds.top + elem.outerHeight();
  return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

}

potentialItems = [
  'bees',
  'cats',
  'salt',
  'cabin',
  'forest',
  'icon',
  'food',
  'carrot',
  'hair',
  'peanut',
  'hat',
  'duck',
];

function grabSomething(){
  return potentialItems[
    Math.floor(Math.random() * potentialItems.length)
  ]
}

function triggerLoads(){
  const elems = $('.page').toArray().filter(isScrolledIntoView);
  elems.forEach(elem => {
    $.get('https://export.arxiv.org/api/query?search_query=' + grabSomething(), () => {
      $(elem).html(`
        {}
      `)
    });
  });
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

const debouncedLoad = debounce(triggerLoads, 500);

$(window).on('scroll', debouncedLoad);

debouncedLoad();
