const throttle = (func, limit) => {
  let lastFunc
  let lastRan
  return function() {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

let isThrottled = false

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

const jsonToHtml = json => {
  return json.map(
    entry => `
      <div class='entry'>
        <a href=${entry.link}>${entry.title}</a>
        <span>${entry.summary}</span>
      </div>
    `
  ).join('');
}

const render = arxivJson => $('#render-target').html(jsonToHtml(arxivJson));

const search = term => fetch(`https://export.arxiv.org/api/query?search_query=${escape(term)}`)
  .then(res => res.text())
  .then(arxivXmlToJson)
  .then(render)

const throttledSearch = throttle(search, 300);

$('#searchbar').on('change input', event => {
  if (event.target.value.length > 1){
    if(isThrottled){
      throttledSearch(event.target.value)
    } else {
      search(event.target.value)
    }
  } else {
    $('#render-target').html('');
  }
});


$('#searchbar').on('change', event => {
  isThrottled = event.target.value;
});
