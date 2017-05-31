var Slider = {
    init: function() {
        this.parent = document.getElementById(this.parent);

        var node = '';

        for (var i = 0; i < this.images.length; i++) {
            var image = this.images[i];
            node += '<div id="' + this.imageId + i + '" style="background: url(' + image.src + ') no-repeat center;' +
                'background-size:' + (image.size || 'cover') + ';transition-duration:' +
                this.transition.duration + ';position:absolute;width:100%;height:100%;display:none;">' +
                '<a href="' + (image.headerLink || '') + '" class="' + this.headerClass + '">' + (image.header || '') + '</a>' +
                '<a href="' + (image.commentLink || '') + '" class="' + this.commentClass + '">' + (image.comment || '') + '</a></div>';
        }

        if (this.buttons) {
            for (var i = 0; i < 2; i++) {
                var button = '<img class="' + this.buttons.class + '" src="' + this.buttons[i == 0 ? 'prevImage' : 'nextImage'] +
                    '" onclick="Slider.change(\'' + (i == 0 ? 'prev' : 'next') + '\')" style="' +
                    'position: absolute;' + (i == 0 ? 'left' : 'right') + ':20px;"/>';
                node += button;
            }
        }
        if (this.directButtons) {
            var button = '<div id="' + this.directButtons.containerId + '">';
            for (var i = 0; i < this.images.length; i++) {
                button += '<img id="' + this.directButtons.containerId + i + '" src="' +
                    this.directButtons.inactive + '" onclick="Slider.change(' + i + ')"/>';
            }
            button += '</div>';
            node += button;
        }
        if (this.progressbar) {
            node += '<style>@keyframes progressbar { from {width: 0;} to {width: 100%;}}</style><div id="' +
                Slider.progressbar.id + '" style="width:0;transition: width ' + (Slider.delay / 1000) + 's linear;"></div>';
        }

        this.parent.innerHTML = node;

        window.addEventListener('load', this.onLoad, false);
    },

    onLoad: function() {
        Slider.change();
        Slider.timer = window.setInterval(Slider.change, Slider.delay);
    },

    change: function(button) {
        var lng = Slider.images.length,
            next = (Slider.active + 1 == lng) ? 0 : (Slider.active + 1);

        switch (button) {
            case 'prev':
                next = (Slider.active == 0) ? (lng - 1) : (Slider.active - 1);
                window.clearInterval(Slider.timer);
                Slider.timer = window.setInterval(Slider.change, Slider.delay);
                break;
            default:
                if (button == Slider.active) { return; }
                next = parseInt(button);
            case 'next':
                window.clearInterval(Slider.timer);
                Slider.timer = window.setInterval(Slider.change, Slider.delay);
                break;
            case undefined:
        }
        for (var i = 0; i < lng; i++) {
            var image = Slider.images[i],
                element = document.getElementById(Slider.imageId + i);
            switch (i) {
                case Slider.active:
                    element.style[Slider.transition.property] = Slider.transition.after || Slider.transition.before;
                    break;
                case next:
                    element.style.transitionDuration = Slider.transition.duration || '1s';
                    element.style[Slider.transition.property] = Slider.transition.active;
                    break;
                default:
                    element.style.transitionDuration = '0s';
                    element.style[Slider.transition.property] = Slider.transition.after || Slider.transition.before;
                    element.style[Slider.transition.property] = Slider.transition.before || Slider.transition.after;
                    break;
            }
            element.style.display = 'block';
        }
        Slider.active = next;
        if (this.progressbar) { Slider.updateProgressbar(); }
        Slider.updateDirectButtons();
    },

    updateDirectButtons: function() {
        if (Slider.directButtons) {
            for (var i = 0; i < Slider.images.length; i++) {
                var button = document.getElementById(Slider.directButtons.containerId + i);
                button.src = i == Slider.active ? Slider.directButtons.active : Slider.directButtons.inactive;
            }
        }
    },

    updateProgressbar: function() {
        var p = document.getElementById(Slider.progressbar.id);
        p.style.animation = 'none';
        p.parentElement.removeChild(p);
        Slider.parent.appendChild(p);
        p.style.animation = 'progressbar ' + (Slider.delay / 1000) + 's infinite linear';
    },

    images: [],

    addImage: function(params) { this.images.push(params); },

    active: -1,

    delay: 5000,

    transition: {
        property: 'opacity',
        duration: '1s',
        active: '1',
        before: '0',
        after: '0',
    },

    buttons: {
        prevImage: 'img/prevButton.svg',
        nextImage: 'img/nextButton.svg',
        class: 'sliderButtons'
    },

    directButtons: {
        active: 'img/buttonActive.svg',
        inactive: 'img/buttonInactive.svg',
        containerId: 'sliderDirectButtons'
    },

    progressbar: {
        id: 'progressbar'
    },

    parent: 'slider',
    imageId: 'sliderImage',
    headerClass: 'sliderHeader',
    commentClass: 'sliderComment',
}