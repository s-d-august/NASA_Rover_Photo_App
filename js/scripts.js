let imgRepository = (function () {
    let imgList = [];
    let apiUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/' + roverChoice + '/latest_photos?api_key=DEMO_KEY'

    function loadList() {
        $.ajax(apiUrl, { dataType: 'json' }).then(function (responseJSON) {
            responseJSON.each(function (item) {
                let thumbnail = {
                    img: item.img_src,
                    detailsUrl: item.url
                };
                add(thumbnail);
            }
            )
        }).catch(function (e) {
            console.error(e);
        })
    }
})