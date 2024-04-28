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

let dummyArray = [
   {
        id: 1,
        solDate: 12312,
        earthDate: 12387023,
        cameraName: "FHAZ",
        roverName: "Curiosity",
        img: "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/04102/opgs/edr/fcam/FLB_761645828EDR_F1060660FHAZ00302M_.JPG"
    },
    {
        id: 2,
        solDate: 67867,
        earthDate: 45289134709,
        cameraName: "RHAZ",
        roverName: "Perseverance",
        img: "https://mars.nasa.gov/msl-raw-images/msss/04102/mhli/4102MH0001530001404334U01_DXXX.jpg"
    },
    {
        id: 3,
        solDate: 235245,
        earthDate: 112346514,
        cameraName: "MAST",
        roverName: "Spirit",
        img: "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/04102/opgs/edr/rcam/RRB_761645951EDR_S1060660RHAZ00300M_.JPG"
    }
]

    function addThumbnail(photo, index) { //constructs array of thumbnails 
        let url = index.img;
        let number = dummyArray.indexOf(index); // gets index number from array to call details in modal
        let thumbnailList = $('#thumbnails');
        let thumbnailListItem = $(`<img class="col img-thumbnail" data-toggle="modal" data-target="#exampleModal" 
            data-whatever="` + number + `" src="` + url + `">`)
        thumbnailList.append(thumbnailListItem);
    }

$('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var number = button.data('whatever') // Extract info from data-* attributes
        var contents = dummyArray[number] // Gets object from array using the index number variable from addThumbnail

        let modalText = // template literal of modal text
            `Camera: ${contents.cameraName}
Martian Sol Date: ${contents.solDate}
Earth Date: ${contents.earthDate}`

        var modal = $(this) // updates the modal contents
        modal.find('.modal-title').text(contents.roverName + ', #' + contents.id)
        modal.find('.modal-body img').attr('src', contents.img)
        modal.find('.modal-body p').text(modalText)
        let imgSize = (modal.find('img'))[0].naturalWidth // gets the size of the photo to adjust modal width
        modalSize (imgSize, modal)
      })

function modalSize (imgSize, modal) {
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

loadList().then(function (){
    $.each(dummyArray, function (photo, index) {
        addThumbnail(photo, index)
    })
})