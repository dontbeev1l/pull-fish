const backgrounds = new BackgroundsModule(['menu', 'river', 'home']);

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
        backgrounds.setActive('river');
        q('.game-boy-wrapper').removeClass('disabled');
    },
    () => {
        q('.game-boy-wrapper').addClass('disabled');
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
