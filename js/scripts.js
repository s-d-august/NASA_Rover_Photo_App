let roverChoice = 'curiosity'


    let imgList = [];
    let apiUrl = 'https://mars-photos.herokuapp.com/api/v1/rovers/' + roverChoice + '/latest_photos'

    function getAll() {
        return imgList;
    }

    function addListener(button, img) { //listener to open modal with details
        $(button).on('click', function () {
            showModal(img);
        })}

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
                    earthDate: item.earth_date
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
        let thumbnailList = $('#thumbnails');
        let thumbnailListItem = $(`<img class="col" src="` + url + `" style="width:150px;height:150px">`)
        thumbnailList.append(thumbnailListItem);
        addListener(thumbnailListItem, photo)
    }


loadList().then(function (){
    $.each(imgList, function (img) {
        addThumbnail(img)
    })
})