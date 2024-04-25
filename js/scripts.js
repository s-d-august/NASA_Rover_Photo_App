let imgRepository = (function () {
    let imgList = [];
    let apiUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/' + roverChoice + '/latest_photos?api_key=DEMO_KEY'

    function addListener(button, img) {
        $(button).on('click', function () {
            showDetails(img);
        })}

    function loadList() { //loads image thumbnails and details and pushes them to the imgList array
        $.ajax(apiUrl, { dataType: 'json' }).then(function (responseJSON) {
            responseJSON.each(function (item) {
                let thumbnail = {
                    img: item.img_src,
                    detailsUrl: item.url
                };
                imgList.push(thumbnail);
            }
            )
        }).catch(function (e) {
            console.error(e);
        })
    } // loadList
})