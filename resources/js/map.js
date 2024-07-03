import axios from 'axios';

// import {LOCATION, markerProps} from './common';
const LOCATION = {
    center: [37.623082, 55.75254], // starting position [lng, lat]
    zoom: 9 // starting zoom
}

window.map = null;

async function storeMarker(x, y, title = 'Метка') {
    let id = 0;
    await axios.post('/marker/store', {title, x, y}, {})
        .then((response) => {
            if (response.data.message === 'Success') {
                console.log(response.data.id);
                id = response.data.id;
            }
        })
        .catch((error) => {
            console.error(error);
        })
    console.log(id)
    return id;
}

function updateMarker(id, x, y) {
    return axios.post('/marker/update/' + id, {x, y}, {})
        .then((response) => {
            return response.data.message === 'Success';
        })
        .catch((error) => {
            console.error(error);
            return false;
        })
}

function delMarker(id) {
    return axios.post('/marker/destroy/' + id)
        .then((response) => {
            return response.data.message === 'Success';
        })
        .catch((error) => {
            console.error(error);
            return false;
        })
}

async function addMarker(x, y) {
    const title = prompt('Введите название метки', 'Метка');
    if (title) {
        const id = await storeMarker(x, y, title);
        if (id) {
            await showMarker(x, y, title, id);
        }
    }
}

async function showMarker(x, y, title, id) {

    const markerElement = document.createElement('img');
    markerElement.title = title;
    markerElement.src = '/marker.png';
    markerElement.className = 'icon-marker';
    markerElement.dataset.id = id;
    const mrk = new YMapMarker({
        coordinates: [x, y],
        draggable: true,
    }, markerElement)
    // markerElement.onclick = (object, event) => {
    //     console.log(mrk)
    //     // map.removeChild(mrk);
    //     object.stopPropagation();
    // };
    markerElement.onmouseup = (object, event) => {
        // console.log(map.children[map.children.length - 1]);
        // console.log(map.children[map.children.length - 1].element);
        // console.log(map.children[map.children.length - 1].coordinates);
       const mvMarker = getMovedMarker(id);
       if (mvMarker && mvMarker.coordinates[0] !== x && mvMarker.coordinates[1] !== y) {
           updateMarker(id, mvMarker.coordinates[0], mvMarker.coordinates[1]);
       }
    }
    map.addChild(mrk);
}

function getMovedMarker(id) {
    let movedChild = null;
    map.children.forEach((child) => {
        if (
            typeof child.element !== 'undefined'
            && typeof child.element.dataset !== 'undefined'
            && child.element.dataset.id !== 'undefined'
        ) {
            if (+child.element.dataset.id === +id) {
                movedChild = child;
            }
        }
    });
    return movedChild;
}

function clearAll() {
    document.querySelectorAll('.context-container').forEach((container) => {
        container.remove();
    })
}


async function main(isGuest = false) {
    // if (isGuest) return;

    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, YMapListener} = ymaps3;
    window.YMapMarker = YMapMarker;

    // Initialize the map
    window.map = new YMap(
        // Pass the link to the HTMLElement of the container
        document.getElementById('map'),
        // Pass the map initialization parameters
        {location: LOCATION, showScaleInCopyrights: true},
        [
            // Add a map scheme layer
            new YMapDefaultSchemeLayer({}),
            // Add a layer of geo objects to display the markers
            new YMapDefaultFeaturesLayer({})
        ]
    );


    axios.get('http://localhost:80/marker/all')
        .then((response) => {
            console.log(response.data)
            // for (let marker of response.data) {
            //     showMarker(marker.x, marker.y, marker.title, marker.id)
            // }
        })

    // await fetch()

    const clickCallback = () => {
        clearAll();
    };

    function onContextMenuHandler(object, event) {

        clearAll();

        const x = event.screenCoordinates[0];
        const y = event.screenCoordinates[1];
        const coordX = event.coordinates[0];
        const coordY = event.coordinates[1];

        if (typeof object !== 'undefined' && object.type === 'marker') {
            const htmlString = `
                <div><button class="btn-del-marker" data-x=${coordX} data-y=${coordY}>Удалить маркер</button></div>
            `;
            const div = document.createElement("div");
            div.className = 'context-container';
            div.innerHTML = htmlString.trim();
            div.style.top = y + 'px';
            div.style.left = x + 'px';
            document.body.appendChild(div);
            document.querySelector('.btn-del-marker').addEventListener('click', (e) => {
                delMarker(object.entity.element.dataset.id);
                e.target.parentElement.parentElement.remove();
                map.removeChild(object.entity);
            });

        } else {
            const htmlString = `
                <div><button class="btn-add-marker" data-x=${coordX} data-y=${coordY}>Добавить маркер</button></div>
            `;
            const div = document.createElement("div");
            div.className = 'context-container';
            div.innerHTML = htmlString.trim();
            div.style.top = y + 'px';
            div.style.left = x + 'px';
            document.body.appendChild(div);
            document.querySelector('.btn-add-marker').addEventListener('click', (e) => {
                addMarker(e.target.dataset.x, e.target.dataset.y);
                e.target.parentElement.parentElement.remove();
            });
        }
    }

    const mapListener = new YMapListener({
        layerId: "any",
        onClick: clickCallback,
        onContextMenu: onContextMenuHandler,
    });
    map.addChild(mapListener);
}

window.mmm = main;







