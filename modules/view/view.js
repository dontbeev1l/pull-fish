class ViewController {
    constructor(view) {
        this.activeView = view;
        view.activate();
    }

    setView(view) {
        this.activeView.deactivate();
        view.activate();
        this.activeView = view;
    }
    
    setViewFn(view) {
        return () => {
            this.setView(view);
        }
    }
}

const nope = () => { };

class View {
    constructor(name, activateFn, deactivateFn) {
        this.name = name;
        this.activateFn = activateFn || nope;
        this.deactivateFn = deactivateFn || nope;
    }

    activate() {
        document.querySelector(`.view_${this.name}`).classList.add('view_active');
        this.activateFn();
    }

    deactivate() {
        document.querySelector(`.view_${this.name}`).classList.remove('view_active');
        this.deactivateFn();
    }
}