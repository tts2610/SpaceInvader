const ImageFiles = [
    'Ship3',
    'shot3_asset',
    'enemy'
];


const WayPoints = {
    LEFTTORIGHTSHALLOW: [{
            x: 60,
            y: -90,
            dir_x: 0,
            dir_y: 0
        },
        {
            x: 60,
            y: 128,
            dir_x: 0,
            dir_y: 1
        },
        {
            x: 810,
            y: 128,
            dir_x: 1,
            dir_y: 0
        }
    ],
    STREAMFROMB180: [{
            x: 180,
            y: 620,
            dir_x: 0,
            dir_y: 0
        },
        {
            x: 180,
            y: -90,
            dir_x: 0,
            dir_y: -1
        }
    ]
};

let EnemySequences = [];


const GameSetting = {
    keyPresses: {
        left: 37,
        right: 39,
        up: 38,
        down: 40,
        space: 32
    },
    targetFPS: 1000 / 60,

    bulletSpeed: 700 / 1000,
    bulletLife: 4000,
    bulletFireRate: 200,

    playAreaWidth: 720,
    playAreaHeight: 576,
    playAreaDiv: '#playArea',

    playerDivName: 'playerSprite',
    playerStart: {
        x: 360,
        y: 440,
    },
    playerStartLives: 3,
    playerState: {
        ok: 0,
        dead: 1,
        hitFlashing: 2
    },
    playerMoveStep: 8,
    enemyState: {
        ready: 1,
        dead: 0,
        movingToWaypoint: 2
    },


    gamePhase: {
        readyToplay: 1,
        countdownToStart: 2,
        playing: 3,
        gameOver: 4
    },

    countdownGap: 700,
    countDownValues: ['2', '1', 'GO!']


};

let GameManager = {
    assets: {},
    player: undefined,
    bullets: undefined,
    enimies: undefined,
    phase: GameSetting.gamePhase.gameOver,
    lastUpdated: Date.now(),
    elapsedTime: 0,
    fps: 0,
}