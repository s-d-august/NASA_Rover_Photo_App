let imgRepository = (function () {
    let imgList = [];
    let apiUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/' + roverChoice + '/latest_photos?api_key=DEMO_KEY'

    function getAll() {
        return imgList;
    }

    function addListener(button, img) { //listener to open modal with details
        $(button).on('click', function () {
            showDetails(img);
        })}

    function loadList() { //loads image thumbnails and details and pushes them to the imgList array
        $.ajax(apiUrl, { dataType: 'json' }).then(function (responseJSON) {
            responseJSON.each(function (item) {
                let photo = {
                    img: item.img_src,
                    roverName: item.rover.name,
                    cameraName: item.camera.full_name,
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

    function addThumbnail(img) { //constructs array of thumbnails 
        let thumbnailList = $('#thumbnails');
        let thumbnailListItem = $('<img class="col" src=' + img.img_src + ' style="width:150px;height:150px">')
        thumbnailList.append(thumbnailListItem);
        addListener(thumbnailListItem, img)
    }

})