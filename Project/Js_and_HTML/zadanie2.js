$(function () {
    const books = $('.books')
    const isbnSel = $('input#isbn');
    const authorSel = $('input#author');
    const titleSel = $('input#title');
    const publisherSel = $('input#publisher');
    const typeSel = $('input#type');
    const get = 'GET';
    const deleteItem = 'DELETE';
    const post = 'POST';
    const basicURL = 'http://localhost:8282/books/';

    var formInputs = function (isbn, author, title, publisher, type) {
        this.isbn = isbn;
        this.author = author;
        this.title = title;
        this.publisher = publisher;
        this.type = type;
    };

    function getVal(selector) {
        return selector.val();
    }

    function ajaxTitleList(getAjax, get, basicURL) {
        clearContainer();
        getAjax(get, basicURL).done(function (jsons) {
            jsons.forEach(function (json) {
                let newDiv = $("<div>", {
                    id: json.id,
                    class: "books",
                    text: json.title,
                    style: "font-weight: bold"
                });
                let emptyDiv = $("<div>", {
                    id: json.id,
                    class: "booksDetail",
                    style: "font-weight: normal",

                });
                let deleteLink = $("<a>", {
                    id: json.id,
                    href: 'deleteMe',
                    class: 'deleteLink',
                    text: 'usun',
                    style: "font-weight:normal text-align:right",
                    display: "inline"
                });
                $('#titleContainer').append(newDiv.append(emptyDiv)).append(deleteLink)
            });
            $(".deleteLink").click(function (event) {
                event.preventDefault();
                let idToDelete = this.id;
                getAjax(deleteItem, basicURL + idToDelete).done(function () {
                    ajaxTitleList(getAjax, get, basicURL)
                })
            });
            $('.books').on('click', function () {
                let details = this.firstElementChild;

                getAjax(get, basicURL + details.id).done(function (json) {
                    details.innerHTML = "<ul>"
                        + "<li>" + json.isbn + "</li>"
                        + "<li>" + json.author + "</li>"
                        + "<li>" + json.publisher + "</li>"
                        + "<li>" + json.type + "</li>"
                        + "</ul>"
                });
            });
        });
    }

    function getAjax(sendType, basicURL, dataToSend) {
        return $.ajax({
            type: sendType,
            url: basicURL,
            contentType: 'application/json',
            data: dataToSend,
        });
    }

    function clearContainer() {
        $('#titleContainer').empty()
    }

    $('#formular').submit(function (e) {
        e.preventDefault();
        let JsonToPost = new formInputs(getVal(isbnSel),
            getVal(authorSel),
            getVal(titleSel),
            getVal(publisherSel),
            getVal(typeSel));
        getAjax(post, basicURL, JSON.stringify(JsonToPost)).done(function () {
            console.log("hurrra!!!");
            ajaxTitleList(getAjax, get, basicURL);
        }).fail(function () {
            console.log("NOT HURRA :(");
        })
    });

    ajaxTitleList(getAjax, get, basicURL);

});

