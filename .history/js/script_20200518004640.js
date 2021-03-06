let myLocalStorage;
$(function() {
    myLocalStorage = new MyLocalStorage('usersInfo');
    checkLocalStorage();
    updateDashboard();
    writeMessage('Press Space To Start');
    render();
    setUpSequences();
    $(document).keydown(
        function(e) {
            if (GameManager.phase == GameSetting.gamePhase.ready || GameManager.phase == GameSetting.gameOver) {
                if (e.which == GameSetting.keyPress.space) {
                    $('#myModal').modal('show');
                }
            } else if (GameManager.phase == GameSetting.gamePhase.playing) {
                switch (e.which) {
                    case GameSetting.keyPress.up:
                        GameManager.player.move(0, -1);
                        break;
                    case GameSetting.keyPress.down:
                        GameManager.player.move(0, 1);
                        break;
                    case GameSetting.keyPress.left:
                        GameManager.player.move(-1, 0);
                        break;
                    case GameSetting.keyPress.right:
                        GameManager.player.move(1, 0);
                        break;
                }
            }
        }
    );

    $('#myModal').on('shown.bs.modal', function() {
        $("#myModal").keydown(function(e) {
            if ($('#username').val().match(/^[^-\s][a-zA-Z0-9_\s-]+$/) && e.which == 13) {
                $("#submitUsername").click();
            }
        });
        $('#username').focus()
    })

    $("#submitUsername").click(function() {
        if ($('#username').val().match(/^[^-\s][a-zA-Z0-9_\s-]+$/)) {
            $('#myModal').modal('hide');
            $('#usernameTxt').css('color', 'coral');
            $('#usernameTxt').text("Welcome " + $('#username').val().trim() + "!");
            clearMessages();
            gameInit();
        } else {
            $('#username').focus()
        }

    });
});

function render() {
    for (let key in ImageFiles) {
        GameManager.assets[key] = {
            width: ImageFiles[key].width,
            height: ImageFiles[key].height,
            fileName: 'img/' + key + '.png'
        }
    }
    console.log(GameManager.assets)
}

function initEnemies() {
    if (GameManager.enemies) {
        GameManager.enemies.reset();
    } else {
        GameManager.enemies = new EnemyCollection(GameManager.player, GameManager.bullets, GameManager.explosions);
    }
}

function initBullet() {
    if (GameManager.bullets) {
        GameManager.bullets.reset();
    } else {
        GameManager.bullets = new BulletCollection(GameManager.player);
    }
}

function initPlayer() {
    if (GameManager.player) {
        let highScore = checkUsername();
        GameManager.player.reset(highScore);
    } else {
        let highScore = checkUsername();
        let asset = GameManager.assets['Ship3'];
        GameManager.player = new Player(GameSetting.playerDivName,
            new Point(GameSetting.playerStart.x, GameSetting.playerStart.y),
            asset,
            new Rect(0, 0, GameSetting.playAreaWidth - 100, GameSetting.playAreaHeight - 100), highScore);
        GameManager.player.addToBoard(1);
    }
}

function gameInit() {
    initPlayer();
    initBullet();
    initEnemies();
    GameManager.phase = GameSetting.gamePhase.playing;
    setTimeout(update, GameSetting.FPS);
}



function update() {
    let now = Date.now();
    let dt = now - GameManager.lastUpdated;
    GameManager.lastUpdated = now;

    GameManager.enemies.update(dt);

    checkLocalStorage();


    if (GameManager.enemies.gameOver || GameManager.player.lives <= 0) {
        if (GameManager.player.lives <= 0) {
            let endSound = new Audio('img/player-died.wav')
            endSound.play();
            showGameOver();
        } else {
            let winSound = new Audio('img/smb2-exit.wav');
            winSound.play();
            showGameComplete();
        }

        $('#username').val('');
    } else {
        GameManager.bullets.update(dt);
        GameManager.player.update(dt);
        setTimeout(update, GameSetting.FPS);
    }
}

function checkLocalStorage() {
    if (!myLocalStorage.getItem()) {
        let usersInfo = GameManager.usersInfo;
        myLocalStorage.setItem(usersInfo);
    } else {
        let usersInfo = myLocalStorage.getItem();
        usersInfo.forEach(item => {
            if (item.user === $('#username').val().trim()) {
                let regEx = /(^[A-Za-z ]+):(.*)/;
                let match = regEx.exec($('#highScore').text().trim());
                item.highScore = match[2];
            }
        });
        myLocalStorage.setItem(usersInfo);
    }
    updateDashboard();
}

function checkUsername() {
    let isInLocalStorage = 0;
    let users = myLocalStorage.getItem();
    let highScore = 0;
    users.forEach(item => {
        if (item.user === $('#username').val()) {
            highScore = item.highScore;
            $('#usernameTxt').text("Welcome Back " + $('#username').val() + "!");
            isInLocalStorage = 1;
        }
    });
    if (!isInLocalStorage) {
        alert("Add new user successfully!");
        $('#usernameTxt').text("Welcome " + $('#username').val() + "!");
        users.push({ user: $('#username').val(), highScore: 0 })
        myLocalStorage.setItem(users);
    }
    return highScore;
}

function updateDashboard() {
    let gameHistory = myLocalStorage.getItem();
    gameHistory.sort(function(first, second) { return second.highScore - first.highScore; });
    $("#ranking").empty();
    let text = '<div class="row score" id="highScoreTitle"><h1>Best Scores</h1></div>'
    $("#ranking").append(text);
    gameHistory.forEach((element, i) => {
        if (i < 3) {
            let text = '<div class="row score"><div class="col col-sm-4" id="medal"><img src="img/' + ++i + '.png" width=64 height=64></div><div class="col col-sm-8" id="name">' + element.user + ": " + element.highScore + '</div></div>'
            $("#ranking").append(text);
        }
    });
}

function clearMessages() {
    $('#messageContainer').empty();
}

function appendMessage(text) {
    $('#messageContainer').append('<div class="message">' + text + '</div>');
}

function writeMessage(text) {
    clearMessages();
    appendMessage(text);
}

function showGameOver() {
    GameManager.phase = GameSetting.gamePhase.gameOver;
    clearMessages();
    appendMessage('Game Over');
    appendMessage('Press Space To Reset');
}

function showGameComplete() {
    GameManager.phase = GameSetting.gamePhase.gameOver;
    clearMessages();
    appendMessage('You won!!!');
    appendMessage('Press Space To Reset');
}

function addEnemySequence(delayBefore, image, score, lives, speed, number, delayBetween, waypoints) {
    for (let i = 0; i < number; ++i) {
        let delay = delayBetween;
        if (i == 0) {
            delay = delayBefore;
        }
        EnemySequences.push({
            delayBefore: delay,
            image: image,
            waypoints: waypoints,
            score: score,
            lives: lives,
            speed: speed
        });
    }
}

function setUpSequences() {
    addEnemySequence(1000, 'enemy', 100, 1, 200 / 1000,
        5, 800, WayPoints['LEFTTORIGHTSHALLOW']);


    addEnemySequence(1000, 'enemy', 100, 1, 300 / 1000,
        2, 400, WayPoints['STREAM300']);
    addEnemySequence(1000, 'enemy', 100, 1, 200 / 1000,
        2, 400, WayPoints['STREAM420']);

    addEnemySequence(1000, 'enemy', 100, 1, 200 / 1000,
        1, 400, WayPoints['STREAM660']);


    addEnemySequence(1000, 'enemy', 100, 1, 300 / 1000,
        5, 800, WayPoints['INLEFTDIAGUP']);

    addEnemySequence(2000, 'enemy', 100, 1, 200 / 1000,
        1, 400, WayPoints['STREAM540']);
    addEnemySequence(2000, 'enemy', 200, 1, 300 / 1000,
        2, 400, WayPoints['STREAM300']);
    addEnemySequence(2000, 'enemy', 200, 1, 200 / 1000,
        5, 800, WayPoints['INRIGHTDIAGUP']);


    addEnemySequence(2000, 'enemy', 100, 1, 300 / 1000,
        5, 800, WayPoints['RIGHTTOLEFTSHALLOW']);
}