const ImageFiles = [
    'Ship3'
];
const GameSetting = {
    keyPresses: {
        left: 37,
        right: 39,
        up: 38,
        down: 40,
        space: 32
    },
    playAreaWidth: 720,
    playAreaHeight: 576,
    playAreaDiv: '#playArea',

    playerDivName: 'playerSprite',
    playerStart: {
        x: 360,
        y: 400,
    }
};

let GameManager = {
    assets: {},
    player: undefined
}