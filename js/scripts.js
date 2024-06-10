var photoArray = []

//loads image thumbnails and details and pushes them to the imgList array

let roverIndex = $(".active").attr("data-whatever");

function addThumbnail(index, item) { //constructs grid of thumbnails
  let thumbnailList = $('#thumbnails');
  let thumbnailListItem = $(`<img class="col img-thumbnail" data-toggle="modal" data-target="#modal" 
                data-whatever="${index}" src="${item.img_src}">`) //data-whatever passes the index number so the details can be called in the modal
  thumbnailList.append(thumbnailListItem);
}

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

    $(".loading").addClass('d-none')
  })

  .catch((error) => console.error("An error occurred:", error));


//MODAL DISPLAY

$('#modal').on('show.bs.modal', function (event) { // Triggers when modal is opened
  let roverIndex = $(".active").attr("data-whatever");
  var thumbnail = $(event.relatedTarget) // Thumbnail that triggered the modal
  var number = thumbnail.data('whatever') // Extract info from data-* attributes
  var contents = photoArray[0][roverIndex].latest_photos[number] // Gets object from array using the index number variable from addThumbnail

  let modalText = // template literal of modal text
    `Camera: ${contents.camera.full_name} (${contents.camera.name})
Martian Sol Date: ${contents.sol}
Earth Date: ${contents.earth_date}`

  var modal = $(this) // updates the modal contents
  modal.find('.modal-title').text(contents.rover.name + ', #' + contents.id)
  modal.find('.modal-body img').attr('src', contents.img_src)
  modal.find('.modal-body p').text(modalText)
  let imgSize = (modal.find('img'))[0].naturalWidth // gets the size of the photo to adjust modal width
  modalSize(imgSize, modal)
})

function modalSize(imgSize, modal) { //resizes the modal width based on photo size
  let modalWidth = modal.find('.modal-dialog')

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



$('.nav-link').on('click', function (event) {
  $("#thumbnails").empty()
  $('.nav-link').removeClass('active')
  let selected = $(event.target);
  let roverIndex = selected.data('whatever')
  selected.addClass('active')
  $.each((photoArray[0][roverIndex].latest_photos), function (index, item) {
    addThumbnail(index, item)
  })


}) // loadList function