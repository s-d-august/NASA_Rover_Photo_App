let roverChoice = 'curiosity'


    let imgList = [];
    let apiUrl = 'https://mars-photos.herokuapp.com/api/v1/rovers/' + roverChoice + '/latest_photos'

    function getAll() {
        return imgList;
    }

    function loadList() { //loads image thumbnails and details and pushes them to the imgList array
        return $.ajax(apiUrl, { dataType: 'json' }).then(function (responseJSON) {
            $.each(responseJSON.latest_photos, function (item) {

                let roverName = $(item.rover).map(function (rover) {
                    return rover.rover.name;
                })

                let cameraName = $(item.camera).map(function (rover) {
                    return rover.camera.name;
                })

                let photo = {
                    img: item.img_src,
                    roverName: roverName,
                    cameraName: cameraName,
                    solDate: item.sol,
                    earthDate: item.earth_date,
                    id: item.id,
                };
                imgList.push(photo);
            }
            )
        }).catch(function (e) {
            console.error(e);
        })
    } // loadList

    function addThumbnail(photo) { //constructs array of thumbnails 
        let url = photo.img;
        let number = imgList.indexOf(photo);
        let thumbnailList = $('#thumbnails');
        let thumbnailListItem = $(`<img class="col" data-toggle="modal" data-target="#exampleModal" data-whatever="` + number + `" src="` + url + `" style="width:150px;height:150px">`)
        thumbnailList.append(thumbnailListItem);
    }

$('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var number = button.data('whatever')
        var contents = imgList[number] // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('.modal-title').text(contents.roverName + ', #' + contents.id)
        modal.find('.modal-body img').attr('src', contents.img)
        modal.find('.modal-body p').text(
            `Camera: ` + contents.cameraName
            `Martian Sol Date: ` + contents.solDate
            `Earth Date: ` + contents.earthDate
        )
      })

loadList().then(function (){
    $.each(imgList, function (img) {
        addThumbnail(img)
    })
})