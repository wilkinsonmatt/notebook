import $ from 'jquery';
import './css/styles.css';

let noteBook = new NoteBook();
let localData;

// Business Logic for NoteBook ---------

function NoteBook() {
  this.entries = {};
  this.currentId = 0;
}

NoteBook.prototype.addNote = function (note) {
  note.id = this.assignId();
  this.entries[note.id] = note;
};

NoteBook.prototype.assignId = function () {
  this.currentId += 1;
  return this.currentId;
};

NoteBook.prototype.findNote = function (id) {
  if (this.entries[id] != undefined) {
    return this.entries[id];
  }
  return false;
};

NoteBook.prototype.deleteNote = function (id) {
  if (this.entries[id] === undefined) {
    return false;
  }
  delete this.entries[id];
  return true;
};

// Business Logic for Notes ---------
function Note(title, date, topic, content) {
  this.title = title;
  this.date = date;
  this.topic = topic;
  this.content = content;
}

Note.prototype.title = function () {
  return this.title;
};

// User Interface Logic ---------

function displayNoteDetails(NoteBookToDisplay) {
  let entriesList = $('ul#entries');
  let htmlForNoteInfo = '';
  Object.keys(NoteBookToDisplay.entries).forEach(function (key) {
    const note = NoteBookToDisplay.findNote(key);
    htmlForNoteInfo += '<li id=' + note.id + '>' + note.title + ' ' + '</li>';
  });
  entriesList.html(htmlForNoteInfo);
}

function showNote(noteId) {
  const note = noteBook.findNote(noteId);
  $('#show-note').toggle();
  $('.title').html(note.title);
  $('.date').html(note.date);
  $('.topic').html(note.topic);
  $('.content').html(note.content);

  let buttons = $('#buttons');
  buttons.empty();
  buttons.append(
    "<button class='deleteButton' id=" + +note.id + '>Delete</button>'
  );
}

// function saveEdits() {
//   const editElem = document.getElementById('edit');
//   const userVersion = editElem.innerHTML;
//   localStorage.userEdits = userVersion;
//   document.getElementById('update').innerHTML = 'Edits saved!';
// }

function attachContactListeners() {
  $('ul#entries').on('click', 'li', function () {
    showNote(this.id);
  });
  $('#buttons').on('click', '.deleteButton', function () {
    noteBook.deleteNote(this.id);
    $('#show-note').hide();
    displayNoteDetails(noteBook);
  });
  $('button#default-btn').click(function () {
    $('body').removeClass();
    $('body').addClass('default');
  });

  $('button#leopard-btn').click(function () {
    $('body').removeClass();
    $('body').addClass('leopard');
  });

  $('button#lisa-btn').click(function () {
    $('body').removeClass();
    $('body').addClass('lisa');
  });

  // $('button#delete-btn').click(function () {
  //   localStorage.removeItem('noteBookKey');
  // });

  $('button#delete-btn').click(function () {
    localStorage.removeItem('noteBookKey');
    $('ul#entries').html('');
    noteBook.entries = {};
    noteBook.currentId = 0;
  });
}

$(document).ready(function () {
  attachContactListeners();

  if(localStorage.getItem('noteBookKey')) {
    localData = JSON.parse(localStorage.getItem('noteBookKey'));
    noteBook.entries = localData.entries;
    noteBook.currentId = localData.currentId;
    displayNoteDetails(noteBook);
  }

  $('form#new-note').submit(function (event) {
    event.preventDefault();
    const inputtedTitle = $('input#new-title').val();
    const inputtedDate = Date(Date.now()); 
    const inputtedTopic = $('select#new-topic').val();
    const inputtedContent = $('#new-content').val();
    $('input#new-title').val('');
    $('select#new-topic').val('');
    $('textarea#new-content').val('');

    const newNote = new Note(
      inputtedTitle,
      inputtedDate,
      inputtedTopic,
      inputtedContent
    );

    noteBook.addNote(newNote);
    displayNoteDetails(noteBook);
    localStorage.setItem('noteBookKey', JSON.stringify(noteBook));
    localData = JSON.parse(localStorage.getItem('noteBookKey'));
  });

  function initSparkling() {
    let sparkling = function () {
      $('.sparkling').each(function () {
        let sparklingElement = $(this);
        let stars = sparklingElement.find('.star');

        if (stars.length > 5) {
          stars.each(function (index) {
            if (index === 0) {
              $(this).remove();
            }
          });
        }
        sparklingElement.append(addStar());
      });

      let rand = Math.round(Math.random() * 700) + 100;
      setTimeout(sparkling, rand);
    };

    let addStar = function () {
      const color = "#FFC700";
      const svgPath = 'M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z';
      let size = Math.floor(Math.random() * 20) + 10;
      let top = Math.floor(Math.random() * 100) - 50;
      let left = Math.floor(Math.random() * 100);

      return '<span class="star" style="top:' + top + '%; left:' + left + '%;">'
        + '<svg width="' + size + '" height="' + size + '" viewBox="0 0 68 68" fill="none">'
        + '<path d="' + svgPath + '" fill="' + color + '" /></svg></span>';
    };

    sparkling();
  }
  $(function () {
    initSparkling();
  });

});
