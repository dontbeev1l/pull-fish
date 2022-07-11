const S = Storage.create(
    {
        balance: 500,
        bet: 10,
        history: [],
        hungry: 100
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


function msg(text) {
    q('.messages').setHTML(`<div class="message">${text}</div>`)
}

// const vC = new ViewController(homeView);
const vC = new ViewController(licenseView);

class Game {
    constructor() {
        this.wrapper = q('.game-boy-wrapper')[0];
        this.float = q('.float')[0];
        this.catchEl = q('.catch')[0];
        this.catchedFishEl = q('.catched-fish-container')[0];
        this.riverContains = [];

        for (let i = 1; i <= 8; i++) {
            for (let j = 0; j < 10 - i; j++) {
                this.riverContains.push({ fish: i, texture: `./img/f${i}.png` });
            }
        }

        for (let i = 0; i < 15; i++) {
            this.riverContains.push({ fish: -1, texture: `./img/shoe.png` });
            this.riverContains.push({ fish: -1, texture: `./img/shell.png` });
            this.riverContains.push({ fish: -1, texture: `./img/botle.png` });
        }
    }

    cast() {
        if (this.casted) {
            clearTimeout(this.poklevkaTimeout);
            this.float.classList.remove('klev');
            this.wrapper.deactivate();
            this.casted = false;
            setTimeout(() => {
                this.cast()
            }, 300);
            return;
        }
        S.balance -= S.bet;
        msg(`You bet ${S.bet}`);

        this.casted = true;
        this.poklevkaTimeout = null;
        this.setKlev(false);

        this.wrapper.activate();
        this.createPoklevka();
    }

    setKlev(value) {
        this.klev = value;
        if (value) {
            this.catchEl.activate()
        } else {
            this.catchEl.deactivate();
        }
    }

    createPoklevka() {
        if (this.poklevkaTimeout) {
            clearTimeout(this.poklevkaTimeout);
        }
        this.poklevkaTimeout = setTimeout(() => {
            this.float.classList.add('klev');
            this.setKlev(true);
            setTimeout(() => {
                if (this.poklevkaTimeout && this.casted) {
                    clearTimeout(this.poklevkaTimeout);
                    this.setKlev(false);
                    this.float.classList.remove('klev');
                    this.createPoklevka();
                }
            }, random(3000, 2000));
        }, random(5000, 1000));
    }

    catchFish() {
        if (!this.klev) {
            if (this.cast) {
                this.createPoklevka();
            }
            return;
        }

        this.poklevkaTimeout = null;
        this.setKlev(false);
        this.float.classList.remove('klev');
        this.wrapper.deactivate();
        this.casted = false;

        const fish = this.riverContains.randomElement();

        this.catchedFishEl.innerHTML = `<img src="${fish.texture}">`;
        const win = (fish.fish + 1) * 0.5 * S.bet
        S.balance += win;

        if (win > 0) {
            msg(`You win! + ${win}`);
            S.history.push({ texture: fish.texture, sum: Math.round(win / 3), fish: fish.fish });
            S.history = S.history;
        } else {
            msg('You lose');
        }
    }
}

class Home {
    constructor() {
        this.container = q('.last-catch__content')[0];
        q('.btn-feed').on('click', () => {
            this.feed();
        })

        setInterval(() => {
            this.cahngeHungry(-1);
        }, 5000);
        this.drowHungry();
    }

    showLastCatch() {
        const lastCatch = S.history[S.history.length - 1];
        if (S.history.length > 0 && lastCatch.sum < S.balance) {
            this.lastCatchEnable = true;
            this.container.innerHTML = `
                <img src="${lastCatch.texture}">
                <div class="balance">
                    <img src="./img/coin.png" alt="coin"> <span>${lastCatch.sum}</span>
                </div>
            `;
        } else {
            this.lastCatchEnable = false;
            this.container.innerHTML = '0';
        }

    }

    feed() {
        if (!this.lastCatchEnable) { return; }
        const lastCatch = S.history[S.history.length - 1];
        S.balance -= lastCatch.sum;
        this.cahngeHungry(lastCatch.fish * 4);

        S.history.splice(-1, 1);
        S.history = S.history;
        this.showLastCatch();
    }

    cahngeHungry(value) {
        let hungry = S.hungry + value;

        if (hungry < 0) { 
            hungry = 0;
        }

        if (hungry > 100) {
            hungry = 100;
        }

        S.hungry = hungry;
        this.drowHungry();
    }

    drowHungry() {
        const green = q('.hungry__value_green')[0];
        const red = q('.hungry__value_red')[0];
        green.style.opacity = S.hungry / 100;
        green.style.width = `${S.hungry}%`;
        red.style.width = `${S.hungry}%`;
        q('.home__cat')[0].style.width = `${S.hungry * 0.25 + 10}%`;
    }
}

const home = new Home();
home.showLastCatch();

const game = new Game();

(() => {
    const imageWidth = 1600;
    const imageHeight = 720;

    const posXprc = .43;
    const posYprc = .85;

    const catPosXprc = .5;
    const catPosYprc = .9;

    const catElem = q('.home__cat')[0];
    const element = q('.game-boy-wrapper')[0];

    document.querySelector('.home__cat')

    let lastViewSize = ``;
    const boyPosition = () => {
        requestAnimationFrame(boyPosition);
        const { width, height } = q('.view')[0].getBoundingClientRect();

        if (`${width}${height}` == lastViewSize) {
            return;
        }

        lastViewSize = `${width}${height}`;

        const { gapX, gapY, scaleCoef } = calculateBackgroundScale(imageWidth, imageHeight, width, height);

        element.style.left = `${imageWidth * posXprc * scaleCoef - gapX}px`;
        element.style.top = `${imageHeight * posYprc * scaleCoef - gapY}px`;

        catElem.style.left = `${imageWidth * catPosXprc * scaleCoef - gapX}px`;
        catElem.style.top = `${imageHeight * catPosYprc * scaleCoef - gapY}px`;
    }
    boyPosition();
})();

q('.button_home').on('click', vC.setViewFn(menuView));

(function licenseActions() {
    q('.button_license').on('click', vC.setViewFn(menuView));
})();

(function menuActions() {
    q('.button-fishing').on('click', vC.setViewFn(riverView));
    q('.button-home').on('click', vC.setViewFn(homeView));
})();

(function riverActions() {
    q('.game-boy-wrapper').on('click', game.cast.bind(game));
    q('.catch').on('click', game.catchFish.bind(game));
    q('.cast').on('click', game.cast.bind(game))

    q('.range-min').on('click', () => S.bet = 10);
    q('.range-max').on('click', () => S.bet = Math.floor(S.balance / 10) * 10);
    q('.range-control_m').on('click', () => S.bet -= 10);
    q('.range-control_p').on('click', () => S.bet += 10);
})();




