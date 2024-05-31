var roverArray = ["curiosity", "opportunity", "perseverance", "spirit"]

var imgList = [
    [],
    [],
    [],
    [],
];

var roverLoaderArray = []

/* function loadRovers() {
    $.each(roverArray, function (index, roverChoice) {
        loadList(index, roverChoice)
    })
}*/

var loadList = (function () { //loads image thumbnails and details and pushes them to the imgList array
    function addThumbnail(index, item) { //constructs grid of thumbnails
        console.log(item, index)
        let thumbnailList = $('#thumbnails');
        let thumbnailListItem = $(`<img class="col img-thumbnail" data-toggle="modal" data-target="#modal" 
                data-whatever="${index}" src="${item.img}">`) //data-whatever passes the index number so the details can be called in the modal
        thumbnailList.append(thumbnailListItem);
    }

    var roverLoaderArrayFunction =
        ($.each(roverArray, function (index, roverChoice) {
            let apiUrl = 'https://mars-photos.herokuapp.com/api/v1/rovers/' + roverChoice + '/latest_photos'
            return $.ajax(apiUrl, { dataType: 'json' })
                .then(function (responseJSON) {
                    roverLoaderArray.push(responseJSON)
                })
        }))

    const curiosity = (function () { $.ajax('https://mars-photos.herokuapp.com/api/v1/rovers/curiosity/latest_photos', { dataType: 'json' }).then(function (responseJSON) { return responseJSON }) })
    const opportunity = (function () { return $.ajax('https://mars-photos.herokuapp.com/api/v1/rovers/opportunity/latest_photos', { dataType: 'json' }) })
    const perseverance = (function () { return $.ajax('https://mars-photos.herokuapp.com/api/v1/rovers/perseverance/latest_photos', { dataType: 'json' }) })
    const spirit = (function () { return $.ajax('https://mars-photos.herokuapp.com/api/v1/rovers/spirit/latest_photos', { dataType: 'json' }) })







    Promise.all([curiosity, opportunity, perseverance, spirit]).then(function () {

        console.log(roverLoaderArray)
        console.log(roverLoaderArrayFunction)
        let roverIndex = $(".active").attr("data-whatever");
        $.each((roverLoaderArray[1].latest_photos), function (index, item) {
            addThumbnail(index, item)
        })
    }).catch(function (e) {
        console.error(e);
    })
})(); // loadList function

/*function addThumbnail(index, item) { //constructs grid of thumbnails
    console.log(item, index)
    let thumbnailList = $('#thumbnails');
    let thumbnailListItem = $(`<img class="col img-thumbnail" data-toggle="modal" data-target="#modal" 
            data-whatever="${index}" src="${item.img}">`) //data-whatever passes the index number so the details can be called in the modal
    thumbnailList.append(thumbnailListItem);
}

 loadRovers().then(function () {
    let roverIndex = $(".active").attr("data-whatever");
    $.each(imgList[roverIndex], function (index, item) {
        addThumbnail(index, item)
    })
})
*/


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

