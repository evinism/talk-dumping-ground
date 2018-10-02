
let isArmed;
const setArmStatus = next => {
  isArmed = next;
  const text = isArmed ? 'Disarm Missle' : 'Arm Missle';
  $('#arm').text(text);
  $('#launch').attr('disabled', !isArmed);
  if (isArmed) {
    $('#launch').click(() => {
      setArmStatus(false);
      fetch('https://export.arxiv.org/api/query?search_query=bees');
    });
  }
}

setArmStatus(false);

$('#arm').on('click', event => {
  isArmed = !isArmed;
  setArmStatus(isArmed)
});
