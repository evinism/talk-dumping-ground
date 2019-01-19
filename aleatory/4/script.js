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

function takeALotOfTimeToDoDumbStuff(){
  let findPrimeFactors = (num) => {
    let arr = [];
    for ( var i = 2; i < num; i++) {
      let isPrime
      if (num % i === 0) {
        isPrime = true;
        for (var j = 2; j <= i; j++) {
          if ( i % j === 0) {
            isPrime == false;
          }
        } 
      }
      if (isPrime == true) {
        arr.push(i)
      }
    }
    console.log(arr)
  }
  findPrimeFactors(95309912);
}

const jsonToHtml = json => {
  takeALotOfTimeToDoDumbStuff();
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
const renderLoading = () => $('#render-target').html('<div class="spinner">Loading results...</div>');

const search = term => {
  renderLoading();
  fetch(`https://export.arxiv.org/api/query?search_query=${escape(term)}`)
    .then(res => res.text())
    .then(arxivXmlToJson)
    .then(render);
}

$('#search-form').on('submit', event => {
  event.preventDefault();
  search($('#searchbar')[0].value)
});

