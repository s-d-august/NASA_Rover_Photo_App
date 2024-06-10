var roverArray = []

var loadList = (function () { //loads image thumbnails and details and pushes them to the imgList array
  function addThumbnail(index, item) { //constructs grid of thumbnails
    console.log(item, index)
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
      roverArray.push(jsons)
      let roverIndex = $(".active").attr("data-whatever");
      console.log(roverArray[0])
      $.each((roverArray[0][roverIndex].latest_photos), function (index, item) {
        addThumbnail(index, item)
      })
    })
    .catch((error) => console.error("An error occurred:", error));




  //MODAL DISPLAY

  $('#modal').on('show.bs.modal', function (event) {
    let roverIndex = $(".active").attr("data-whatever");
    var thumbnail = $(event.relatedTarget) // Thumbnail that triggered the modal
    var number = thumbnail.data('whatever') // Extract info from data-* attributes
    var contents = imgList[roverIndex][number] // Gets object from array using the index number variable from addThumbnail

    let modalText = // template literal of modal text
      `Camera: ${contents.cameraName}
Martian Sol Date: ${contents.solDate}
Earth Date: ${contents.earthDate}`

    var modal = $(this) // updates the modal contents
    modal.find('.modal-title').text(contents.roverName + ', #' + contents.id)
    modal.find('.modal-body img').attr('src', contents.img)
    modal.find('.modal-body p').text(modalText)
    let imgSize = (modal.find('img'))[0].naturalWidth // gets the size of the photo to adjust modal width
    modalSize(imgSize, modal)
  })

  function modalSize(imgSize, modal) {
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

})(); // loadList function