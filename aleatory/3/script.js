
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

function grabSomething(arr){
  return arr[
    Math.floor(Math.random() * arr.length)
  ]
}

const arxivXmlToJson = text => {
  const getAttr = (attr, elem) => elem.getElementsByTagName(attr)[0].textContent
  const entryList = [...$.parseXML(text).documentElement.getElementsByTagName('entry')];
  return entryList.map(entry => {
    return {
      link: getAttr('id', entry),
      title: getAttr('title', entry),
      summary: getAttr('summary', entry),
    };
  });
}

function triggerLoads(){
  const elems = $('.page').toArray().filter(isScrolledIntoView).filter(elem => !elem.evinLoaded);
  elems.forEach(elem => {
    fetch(`https://export.arxiv.org/api/query?search_query=${grabSomething(potentialItems)}`)
      .then(res => res.text())
      .then(arxivXmlToJson)
      .then((response) => {
        const pageData = (grabSomething(response || []));
        $(elem).html(`
          <h3>${pageData.title}</h3>
          <p>${pageData.summary}</p>
        `);
        elem.evinLoaded = true; // haha 
        elem.style.backgroundColor = 'white';
      })
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

const debouncedLoad = debounce(triggerLoads, 200);

$(window).on('scroll', debouncedLoad);

debouncedLoad();
