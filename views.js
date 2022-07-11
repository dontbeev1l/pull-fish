const backgrounds = new BackgroundsModule(['menu', 'river', 'home']);
const S = Storage.create(
    {
        balance: 500,
        bet: 10,
        history: [],
        hungry: 100,
        music: true
    },
    {
        bet: (value, _s) => {
            let html = '';

            if (_s.balance < 10) {
                _s.balance = 100;
            }

            if (value > _s.balance) {
                value = Math.floor(S.balance / 10) * 10;
                _s.bet = Math.floor(S.balance / 10) * 10;
            }

            if (value < 10) {
                _s.bet = 10;
                value = 10;
            }

            for (let i = 1; i <= 8; i++) {
                html += `<div class="info"><img src="./img/f${i}.png">${(i + 1) * 0.5 * value}</div>`;
            }

            q('.fish-bet-grid').setHTML(html)
        }
    }
);




function play() { audioEl.play(); pauseEl.style.display = 'block'; playEl.style.display = 'none'; S.music = true; }
function pause() { audioEl.pause(); pauseEl.style.display = 'none'; playEl.style.display = 'block'; S.music = false; }
function pauseView() { audioEl.pause(); pauseEl.style.display = 'none'; playEl.style.display = 'block'; }

const licenseView = new View('license',
    () => {
        backgrounds.setActive('menu');
    }
);

const menuView = new View('menu',
    () => {
        backgrounds.setActive('menu');
    }
);

const riverView = new View('river',
    () => {
        if (S.music) {
            play()
        } else {
            pause();
        }
        backgrounds.setActive('river');
        q('.game-boy-wrapper').removeClass('disabled');
    },
    () => {
        q('.game-boy-wrapper').addClass('disabled');
        pauseView();
    }
);

const homeView = new View('home',
    () => {
        backgrounds.setActive('home');
        q('.home__cat').removeClass('disabled');
    },
    () => {
        q('.home__cat').addClass('disabled');

    }
);
