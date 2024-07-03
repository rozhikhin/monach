

// import {LOCATION, markerProps} from './common';
const LOCATION = {
    center: [37.623082, 55.75254], // starting position [lng, lat]
    zoom: 9 // starting zoom
}

const markerProps = [
    // {
    //     coordinates: [37.623, 55.752],
    //     iconSrc:
    //         'https://yastatic.net/s3/front-maps-static/maps-front-jsapi-3/examples/images/marker-custom-icon/yellow-capybara.png',
    //     message: "I'm yellow capybara!"
    // },
    // {
    //     coordinates: [38.125, 55.622],
    //     iconSrc:
    //         'https://yastatic.net/s3/front-maps-static/maps-front-jsapi-3/examples/images/marker-custom-icon/purple-capybara.png',
    //     message: "I'm purple capybara!"
    // },
    // {
    //     coordinates: [37.295, 55.415],
    //     iconSrc:
    //         'https://yastatic.net/s3/front-maps-static/maps-front-jsapi-3/examples/images/marker-custom-icon/green-capybara.png',
    //     message: "I'm green capybara!"
    // }
];

window.map = null;

function createMarkerImg(YMapMarker, markerProp){
    const markerElement = document.createElement('img');
    markerElement.className = 'icon-marker';
    // markerElement.src = markerProp.iconSrc;
    markerElement.src = '/marker.png';
    // markerElement.onclick = () => alert(markerProp.message);
    const mrk = new YMapMarker({coordinates: markerProp.coordinates}, markerElement)
    markerElement.onclick = (object, event) => {
        map.removeChild(mrk);
        object.stopPropagation();
    };
    return mrk
}

function createMarkerDefault(YMapDefaultMarker,markerProp){
    const mrk = new YMapDefaultMarker({
        coordinates: markerProp.coordinates,
        title: `<div class="ymap-title">title_h1</div>`,
        subtitle: `<div class="ymap-subtitle">adress_text</div>`,
        color: 'blue',
    });
    mrk.onClick =  (object, event) => {
        map.removeChild(mrk);
        object.stopPropagation();
    };
    return mrk;
}

window.addMarker = function(x, y){
    const title = prompt('Введите название метки', 'Метка');
    if (title) {
        const markerElement = document.createElement('img');
        markerElement.src = '/marker.png';
        markerElement.className = 'icon-marker';
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
            console.log(map.children[map.children.length - 1]);
            console.log(map.children[map.children.length - 1].element);
            console.log(map.children[map.children.length - 1].coordinates);
        }
        map.addChild(mrk);
        console.log(map.children);
    }
}


export async function main(isGuest = false) {
    if (isGuest) return;
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, YMapListener} = ymaps3;
    window.YMapMarker = YMapMarker;
    // const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');
    // Waiting for all api elements to be loaded

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


    // Create markers with a custom icon and add them to the map
    markerProps.forEach((markerProp) => {
        let mrk = createMarkerImg(YMapMarker, markerProp)
        // let mrk = createMarkerDefault(YMapDefaultMarker, markerProp)
        map.addChild(mrk);
    });

    const clickCallback = () => {
        // const markerElement = document.createElement('img');
        // markerElement.src = '/marker.png';
        // markerElement.className = 'icon-marker';
        // const mrk = new YMapMarker({coordinates: [38.125, 55.622]}, markerElement)
        // markerElement.onclick = (object, event) => {
        //     map.removeChild(mrk);
        //     object.stopPropagation();
        // };
        // map.addChild(mrk);
    };

    function onContextMenuHandler(object, event) {

        document.querySelectorAll('.context-container').forEach((container) => {
            container.remove();
        })

        const x = event.screenCoordinates[0];
        const y = event.screenCoordinates[1];
        const coordX = event.coordinates[0];
        const coordY = event.coordinates[1];

        if (typeof object !== 'undefined' && object.type === 'marker') {
            // console.log('MARKER')
        } else {
            const htmlString = `
                <div><button class="btn-add-marker" data-x=${coordX} data-y=${coordY}>Add marker</button></div>
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

    // const behaviorHandler = ({type}) => {
    //     if (type === 'drag') {
    //         console.log('Пользователь перемещает объект');
    //     }
    //     console.log('Other');
    // };

    const mapListener = new YMapListener({
        layerId: "any",
        onClick: clickCallback,
        onContextMenu: onContextMenuHandler,
        // onActionStart: behaviorHandler
    });

    map.addChild(mapListener);

    console.log(map)

}







