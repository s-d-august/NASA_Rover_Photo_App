var photoArray = []

var roverIndex = $(".active").attr("data-whatever"); // gets the selected rover

function addThumbnail(index, item) { //constructs grid of thumbnails
  var thumbnailList = $('#thumbnails');
  var thumbnailListItem = $(`<img class="col img-thumbnail" data-toggle="modal" data-target="#modal" 
                data-whatever="${index}" src="${item.img_src}">`) //data-whatever passes the index number so the details can be called in the modal
  thumbnailList.append(thumbnailListItem);
}

//loads image thumbnails and details and pushes them to photoArray
Promise.all([
  fetch('https://mars-photos.herokuapp.com/api/v1/rovers/curiosity/latest_photos'),
  fetch('https://mars-photos.herokuapp.com/api/v1/rovers/opportunity/latest_photos'),
  fetch('https://mars-photos.herokuapp.com/api/v1/rovers/perseverance/latest_photos'),
  fetch('https://mars-photos.herokuapp.com/api/v1/rovers/spirit/latest_photos')
])
  .then((responses) => Promise.all(responses.map((r) => r.json())))
  .then(function (jsons) {
    photoArray.push(jsons)
    $.each((photoArray[0][roverIndex].latest_photos), function (index, item) {
      addThumbnail(index, item)
    })

    $(".load-text").addClass('d-none') // hides "Loading photos..." text
  })

  .catch((error) => console.error("An error occurred:", error));


//MODAL DISPLAY

$('#modal').on('show.bs.modal', function (event) { // Triggers when modal is opened
  var roverIndex = $(".active").attr("data-whatever");
  var thumbnail = $(event.relatedTarget) // Thumbnail that triggered the modal
  var number = thumbnail.data('whatever') // Extract info from data-* attributes
  var contents = photoArray[0][roverIndex].latest_photos[number] // Gets object from array using the index number variable from addThumbnail

  var modalText = // template literal of modal text
    `Camera: ${contents.camera.full_name} (${contents.camera.name})
Martian Sol Date: ${contents.sol}
Earth Date: ${contents.earth_date}`

  var modal = $(this) // updates the modal contents
  modal.find('.modal-title').text(contents.rover.name + ', #' + contents.id)
  modal.find('.modal-body img').attr('src', contents.img_src)
  modal.find('.modal-body p').text(modalText)
  var imgSize = (modal.find('img'))[0].naturalWidth // gets the size of the photo to adjust modal width
  modalSize(imgSize, modal)
})

function modalSize(imgSize, modal) { //resizes the modal width based on photo size
  var modalWidth = modal.find('.modal-dialog')

  if (imgSize > 766) {
    modalWidth.attr('class', 'modal-dialog modal-xl')
  }
  else if (imgSize > 466) {
    modalWidth.attr('class', 'modal-dialog modal-lg')
  }
  else {
    modalWidth.attr('class', 'modal-dialog')
  }
}

// Clears thumbnails and generates new ones when rover selection changes
$('.nav-link').on('click', function (event) {
  $("#thumbnails").empty() // Clears thumbnails
  $('.nav-link').removeClass('active') // Removes .active from all rovers
  var selected = $(event.target);
  var roverIndex = selected.data('whatever') // Index of selected rover in photoArray
  selected.addClass('active') // Adds .active to selected rover
  $.each((photoArray[0][roverIndex].latest_photos), function (index, item) {
    addThumbnail(index, item)
  })
})