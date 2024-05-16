/* 

load images from all four rovers
click on rover name to display images for that rover

*/

let roverArray = ["curiosity", "opportunity", "perseverance", "spirit"]

let imgList = [
    [],
    [],
    [],
    []
];

function loadRovers() {
    $.each(roverArray, function (index, roverChoice) {
        loadList(index, roverChoice)
    })
}

function loadList(subArray, roverChoice) { //loads image thumbnails and details and pushes them to the imgList array
    let apiUrl = 'https://mars-photos.herokuapp.com/api/v1/rovers/' + roverChoice + '/latest_photos'
    return $.ajax(apiUrl, { dataType: 'json' }).then(function (responseJSON) {
        $.each(responseJSON.latest_photos, function (index, item) {

            let photo = {
                img: item.img_src,
                roverName: item.rover.name,
                cameraName: item.camera.full_name,
                solDate: item.sol,
                earthDate: item.earth_date,
                id: item.id,
            };

            imgList[subArray].push(photo)

        }
        )
    }).catch(function (e) {
        console.error(e);
    })
} // loadList function

function addThumbnail(item, index) { //constructs grid of thumbnails
    console.log(item, index)
    let thumbnailList = $('#thumbnails');
    let thumbnailListItem = $(`<img class="col img-thumbnail" data-toggle="modal" data-target="#modal" 
            data-whatever="${index}" src="${item.img}">`) //data-whatever passes the index number so the details can be called in the modal
    thumbnailList.append(thumbnailListItem);
}


function loadRoversAndBuildThumbnails() {
    return new Promise((resolve, reject) => {
        try {
            loadRovers();
            console.log('ok');
            resolve();
        } catch (error) {
            reject(error);
        }
    })
        .then(() => {
            let activeRover = document.querySelector('.active');
            let roverIndex = activeRover.getAttribute('id');
            console.log(imgList[roverIndex]);
            imgList[roverIndex].forEach((item, index) => {
                addThumbnail(item, index)
            });
        })
}
/*
    (() => {
        let roverIndex = $(".active").attr("id");
        $.each(imgList[roverIndex], function (index, photo) {
            console.log(index, photo),
            addThumbnail(index, photo)
        })})
    .catch((error) => console.error(error));
*/



loadRoversAndBuildThumbnails();


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

/* $.each(dummyArray, function (item, index){
    addThumbnail(item, index)
}) */


//MODAL DISPLAY

$('#modal').on('show.bs.modal', function (event) {
    var thumbnail = $(event.relatedTarget) // Thumbnail that triggered the modal
    var number = thumbnail.data('whatever') // Extract info from data-* attributes
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

