$(document).ready(function () {

    main();

    function main() {
        setEvents();
        setNavigation();
        setGallery();
        setClients();
        setEmail();
    }

    function setEvents() {
        const isTouch = isTouchDevice();

        if (isTouch) {
            $('body').addClass('touch-device');
        }

        document.addEventListener('contextmenu', function (event) {
            event.preventDefault()
        });

        setTimeout(function () {
            $('.content-hidden').addClass('content-animation');

            setTimeout(function () {
                $('.content-loading').remove();
                $('.content-animation').removeClass('content-hidden');
            }, 2500);
        });
    }

    function setGallery() {
        $.getJSON("/config/gallery.json?v=5.0.0", function (json) {
            drawCategories(json);
            drawImages(json, true);
        });

        function drawCategories(data) {
            $('#gallery-categories').empty();

            // Categories
            for (let i = 0; i < data.categories.length; i++) {
                const category = data.categories[i];
                const categoryElement = $(
                    '<li data-id="' + category.id + '">' +
                    '<button class="category-button ' + (i === 0 ? 'active' : '') + '">' +
                    category.name +
                    '</button>' +
                    '</li>'
                );
                $('#gallery-categories').append(categoryElement);
                categoryElement.on('click', function () {
                    const button = $(this).children();
                    $('.category-button').removeClass('active');
                    button.addClass('active');
                    drawImages(data);
                });
            }
        }

        function drawImages(data, initialize) {
            const isTouch = isTouchDevice();
            const mixItUpElement = $('#gallery-images').data('mixItUp');

            if (mixItUpElement) {
                mixItUpElement.destroy();
            }

            $('#gallery-images').remove();
            $('#galleries-content').append(
                '<div id="gallery-images" class="gallery-images-hidden"></div>'
            );

            // Images
            const categoryId = $('.category-button.active').parent().data('id');
            for (let i = 0; i < data.images[categoryId].length; i++) {
                const image = data.images[categoryId][i];
                const hoverDisabledClass = isTouch ? 'hover-disabled' : '';

                if (!$('.gallery-col-' + image.position[0]).length) {
                    $('#gallery-images').append(
                        '<div class="gallery-col-' + image.position[0] + '"></div>'
                    );
                }

                $('.gallery-col-' + image.position[0]).append(
                    '<div style="order: ' + image.position[1] + '" class="mix ' + hoverDisabledClass + '" data-my-order="' + i + '">' +
                    '<a href="' + image.image + '?v=5.0.0" data-lightbox="example-set">' +
                    '<div>' +
                    '<img class="img-responsive" src="' + image.thumbnail + '?v=5.0.0" alt="' + image.legend + '">' +
                    '<div class="overlay-parent">' +
                    '<div class="overlay">' +
                    '<h3>' + image.description + '</h3>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</a>' +
                    '</div>'
                );
            }

            if (initialize) {
                setTimeout(function () {
                    $('#gallery-images').removeClass('gallery-images-hidden');
                }, 3500);
            } else {
                setTimeout(function () {
                    $('#gallery-images').removeClass('gallery-images-hidden');
                }, 500);
            }

            $('.mix').hover(function () {
                if (isTouch) {
                    $(this).addClass('hover-disabled');
                }
            }, function () {
                if (isTouch) {
                    $(this).removeClass('hover-disabled');
                }
            });

            $('.mix').on('click', function (e) {
                if (isTouch) {
                    if ($(this).hasClass('hover-disabled')) {
                        $(this).removeClass('hover-disabled');
                        $(this).focus();
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            });

            $('#gallery-images').mixItUp({
                clampWidth: false,
                animation: {
                    duration: 1000
                }
            });
        }
    }

    function isTouchDevice() {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    function setNavigation() {
        $('.navbNavigationlapse').on('show.bs.collapse', function () {
            $('#nav-toggle').addClass('active');
        });

        $('.navbar-collapse').on('hide.bs.collapse', function () {
            $('#nav-toggle').removeClass('active');
        });

        $('.menu').onePageNav({
            currentClass: 'active',
            changeHash: true,
            scrollSpeed: 1200,
            top: 0
        });

        // Animated Scrolling
        let topoffset = 200;
        $('#scroll').click(function () {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                let target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - topoffset
                    }, 1000);
                    return false;
                }
            }
        });

        $.scrollUp({
            scrollDistance: 2000,
            scrollSpeed: 1200,
        });

        new WOW().init();
    }

    function setClients() {
        const isMobile = $(window).width() < 850 ? true : false;
        const clientsElement = $('#clients');
        const moreClientsElement = $('#clients-list-more');
        if (isMobile) {
            moreClientsElement.remove();
            clientsElement.owlCarousel({
                autoPlay: 2000,
                items: 6,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    480: {
                        items: 1
                    },
                    768: {
                        items: 3
                    },
                    1200: {
                        items: 3
                    }
                }
            });
        } else {
            clientsElement.removeClass('owl-carousel').addClass('clients-list');
            $('#clients-list-more-click').off().on('click', function () {
                if (clientsElement.hasClass('clients-list-expanded')) {
                    clientsElement.removeClass('clients-list-expanded');
                    moreClientsElement.removeClass('clients-list-more-expanded');
                } else {
                    clientsElement.addClass('clients-list-expanded');
                    moreClientsElement.addClass('clients-list-more-expanded');
                }
            });
        }
    }

    function setEmail() {
        $('#send-email').off().on('click', function (e) {
            const name = $('#name').val();
            const contact = $('#contact').val();
            const email = $('#email').val();
            const message = $('#message').val();
            $('#email').removeClass('failed');

            if (email) {
                sendEmail(email, name, contact, message)
            } else {
                $('#email').addClass('failed');
            }

            e.stopPropagation();
            e.preventDefault();
        });

        function sendEmail(email, name, contact, message) {
            const html =
                '<html>' +
                '<div>' +
                '<table style="padding: 20px; border-collapse: collapse;">' +
                '<tr style="font-size: 20px;">' +
                '<td style="padding: 10px 0;">' +
                '<b>Nome</b>: ' + name +
                '</td>' +
                '</tr>' +
                '<tr style="font-size: 20px;">' +
                '<td style="padding: 10px 0;">' +
                '<b>Contacto</b>: ' + contact +
                '</td>' +
                '</tr>' +
                '<tr style="font-size: 20px;">' +
                '<td style="padding: 10px 0;">' +
                '<b>Email</b>: ' + email +
                '</td>' +
                '</tr>' +
                '<tr style="font-size: 20px;">' +
                '<td style="padding: 10px 0;">' +
                '<div><b>Mensagem:</b></div>' +
                '<div>' + message + '</div>' +
                '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</html>';

            $.ajax({
                type: 'POST',
                url: 'https://api.sendinblue.com/v3/smtp/email',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': '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'
                },
                data: JSON.stringify({
                    sender: {
                        name: 'Cliente',
                        email: email
                    },
                    to: [{ email: 'sraquelprodrigues@gmail.com' }],
                    subject: 'SITE - NOVO CLIENTE',
                    htmlContent: html
                }),
                success: function (e) {
                    $('#name').val('');
                    $('#contact').val('');
                    $('#email').val('');
                    $('#message').val('');
                    $('#send-email').text('ENVIADO!');
                    $('#send-email').css('pointer-events', 'none');
                    setTimeout(function () {
                        $('#send-email').text('enviar');
                        $('#send-email').css('pointer-events', '');
                    }, 4000);
                },
                error: function (e) {
                    alert('Erro ao enviar email, por favor enviar diretamente para sraquelprodrigues@gmail.com');
                }
            });
        }
    }

});
