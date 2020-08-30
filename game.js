/* Step 1: Optimize layout on all surfaces */
let mosaic = document.querySelector('.mosaic');
let controlbar = document.querySelector('.controlbar');

function optimizeLayout() {
    if ((window.innerWidth - 80) / (window.innerHeight - 21) >= 1) {
        controlbar.setAttribute('style',
            `width: ${document.querySelector(".controlbutton").offsetWidth}px;
            height: ${window.innerHeight}px`);
        mosaic.setAttribute('style',
            `left: ${88}px;
            width: ${window.innerHeight - 80}px;
            height: ${window.innerHeight - 80}px`)
    } else {
        controlbar.setAttribute('style',
            `width: ${window.innerWidth}px;
        height: ${document.querySelector(".controlbutton").offsetHeight}px`);
        mosaic.setAttribute('style',
            `top: ${document.querySelector(".controlbutton").offsetHeight + 8}px;
            width: ${window.innerWidth - 8 - document.querySelector(".controlbutton").offsetHeight}px;
            height: ${window.innerWidth - 8 - document.querySelector(".controlbutton").offsetHeight}px`)
    }
};

optimizeLayout()

/* Define and collect parameters */
let values = [];
let parameters = {};

function defineParameters() {
    values = []
    let rowNumber = document.querySelector('input[name="rownum"]').value;
    let columnNumber = document.querySelector('input[name="colnum"]').value;
    for (i = 0; i < rowNumber * columnNumber; i++) {
        if (i == 0) {
            values.push('')
        } else {
            values.push(i)
        }
    };
    shuffle();
    parameters = { rowNumber, columnNumber, values };
};

function shuffle() {
    for (let i = values.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]]
    }
};

/* Step 3: Make a mosaic from tiles with number of rows and columns specified in input fields */
function createMosaic() {
    document.getElementById('settings').style.display = 'none';
    reset();
    defineParameters();
    for (i = 0; i < parameters['rowNumber'] * parameters['columnNumber']; i++) {
        let tile = document.createElement('div');
        let attributes = {
            class: 'tile',
            id: i,
            onclick: 'transferValue()',
            style:
                `position: absolute;
            left: ${1 + (i % parameters['columnNumber']) * (1 + (99 - parameters['columnNumber']) / parameters['columnNumber'])}%;
            top: ${1 + Math.floor(i / parameters['columnNumber']) * (1 + (99 - parameters['rowNumber']) / parameters['rowNumber'])}%;
            width: ${(99 - parameters['columnNumber']) / parameters['columnNumber']}%;
            height: ${(99 - parameters['rowNumber']) / parameters['rowNumber']}%`
        };
        for (let k in attributes) {
            tile.setAttribute(k, attributes[k])
        };
        mosaic.appendChild(tile)
    }
    hideEmptyTile();
};

/* Step 4: Reset function for removing tiles */
function reset() {
    for (i = mosaic.children.length - 1; i >= 0; i--) {
        mosaic.children[i].remove()
    }

};

/* Step 5: Find and format empty tile in mosaic */
function findEmptyTile() {
    let emptyTile = document.querySelectorAll('.tile')[parameters['values'].indexOf('')];
//    console.log(emptyTile);
    return emptyTile
};

function hideEmptyTile() {
    let tiles = document.querySelectorAll('.tile');
    for (i = 0; i < tiles.length; i++) {
        tiles[i].innerHTML = parameters['values'][i];
        mosaic.style.display = 'inline-block';
        tiles[i].style.display = 'inline-block'
    };
    findEmptyTile().style.display = 'none';
};

/* Step 6: Find neighbors of a tile */

function findNeighbors() {
    let targetID = event.target.id;
    let neighborIDs = [];
    if (targetID >= parameters['columnNumber']) {
        neighborIDs.push(parseInt(targetID - parameters['columnNumber']))
    };
    if ((targetID + 1) % parameters['columnNumber'] > 0) {
        neighborIDs.push(parseInt(targetID) + 1)
    };
    if (targetID <= parameters['values'].length - parameters['columnNumber']) {
        neighborIDs.push(parseInt(targetID) + parseInt(parameters['columnNumber']))
    };
    if ((targetID) % parameters['columnNumber'] > 0) {
        neighborIDs.push(parseInt(targetID - 1))
    };
//    console.log(neighborIDs);
    return neighborIDs
}

/* Step 8: See if a clicked tile is next to the empty one */
function checkNeighbors() {
    let neighborcheck = findNeighbors().includes(parseInt(findEmptyTile().id));
//    console.log(neighborcheck);
    return neighborcheck
};

/* Step 9: Transfer value from the clicked tile to the empty one */
function transferValue() {
    if (checkNeighbors() === true) {
        parameters.values[findEmptyTile().id] = event.target.innerHTML;
        parameters.values[event.target.id] = '';
        hideEmptyTile()
    } else {
        return
    }
};