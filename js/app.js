$(document).ready(function () {

  var TOPIC_SPREADSHEET_KEY = '159Xdlkq_k9gr5kUt_ICNHOlVmqWXxTwxR3LBemNMKAU';

  Tabletop.init({
    key: TOPIC_SPREADSHEET_KEY,
    callback: loadAllDecks,
    simpleSheet: true
  });

  $("#btn-hide-all").on('click', hideAll);
  $("#btn-show-all").on('click', showAll);
  $("#btn-hide-left").on('click', hideLeft);
  $("#btn-hide-right").on('click', hideRight);
  $("#card-table").on('click', '.card', toggleCard);
  $("#card-table").on('click', ".btn-ignore", ignoreCard);
  $("#card-table").on('click', ".btn-unignore", unignoreCard);

  $('#btn-load-deck').on('click', deckSelected);
});

function loadAllDecks(data) {
  data.forEach(function(deck) {
    name = deck.name;
    key = deck.key;
    var option = `<option value='${key}'>${name}</option>`;
    $('#sel-deck').append(option);
  });
}

function deckSelected() {
  key = $('#sel-deck').find(':selected').val();
  Tabletop.init({
    key: key,
    callback: loadDeck,
    simpleSheet: true
  });
}

function loadDeck(data) {
  $('#card-table > .body.active').empty();
  $('#card-table > .body.ignored').empty();

  var left = Object.keys(data[0])[0];
  var right = Object.keys(data[0])[1];
  $('#header-title').text($('#sel-deck').find(':selected').text());
  $('#card-header-left').text(left);
  $('#card-header-right').text(right);
  $('#btn-hide-left').text(`Hide ${left}`);
  $('#btn-hide-right').text(`Hide ${right}`);

  data.forEach(card => {
    leftEntry = card[left];
    rightEntry = card[right];
    notesEntry = card['notes'];

    var row = `
      <div class='table-row'>
        <div class='card-column card left'><p>${leftEntry}</p></div>
        <div class='card-column card right'><p>${rightEntry}</p></div>
        <div class='card-column card notes'><p>${notesEntry || ''}</p></div>
        <button class='btn-ignore'>x</button>
      </div>
    `;

    $('#card-table > .body.active').append(row);
  });

  $('.card.right p').hide();
}

function hideAll() {
  $('.card p').fadeOut();
}

function showAll() {
  $('.card p').fadeIn();
}

function hideLeft() {
  $('.card.right p').fadeIn();
  $('.card.left p').fadeOut();
}

function hideRight() {
  $('.card.left p').fadeIn();
  $('.card.right p').fadeOut();
}

function toggleCard() {
  $(this).find('p').fadeToggle();
}

function ignoreCard() {
  $(this).text('^');
  $(this).removeClass('btn-ignore');
  $(this).addClass('btn-unignore');
  $(this).parent().detach().appendTo('#card-table > .body.ignored');
}

function unignoreCard() {
  $(this).text('x');
  $(this).removeClass('btn-unignore');
  $(this).addClass('btn-ignore');
  $(this).parent().detach().appendTo('#card-table > .body.active');
}