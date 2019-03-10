$(document).ready(function () {
    getDocJson();
});

function getRatio() {
    /** @type {number} */
    var n = $("#contentDocument").width() - 10;
    var videosInRow = $(".d, .pf").width();
    return n / videosInRow;
}

function reSrcBg(posts, type, filename, uri, from) {
    var uppercase_re;
    var dataTransformed;
    for (i in posts) {
        if ("undefined" != typeof posts[i].data && posts[i].data) {
            /** @type {string} */
            uppercase_re = "background-image:url(p" + (parseInt(i) + 1) + ".png)";
            if (from > 1) {
                /** @type {string} */
                uppercase_re = "background-image:url(p" + (parseInt(from) + parseInt(i)) + ".png)";
            }
            /** @type {string} */
            dataTransformed = "background-image:url(" + type + "/" + filename + "/" + uri + "/p" + (parseInt(i) + 1) + ".png)";
            posts[i].data = posts[i].data.replace(uppercase_re, dataTransformed);
        }
    }
    return posts;
}

function getDocJson(ajaxurl) {
    $.ajax({
        method: 'POST',
        url: 'https://cors-anywhere.herokuapp.com/https://data1.store123doc.com/documents/ajax/ajax_readEB.php',
        data: {
            docId: docId,
            pageMax: pageMax,
            pageShow: pageShowReal,
            folder: folder,
            filePath: filePath,
            fileHtml: fileHtml,
            pageNumber: pageNumber,
            pageLength: preLoad,
            link: link,
            ajax: ajax,
            code: code,
            time: timeCurrent,
            type: type
        },
        dataType: 'json',
        success: onSuccess,
        error: onError
    })
}

function onSuccess(jsonReturn, textStatus, xhr) {
    ratio = getRatio();
    // $(".d, .pf", $parent).css({
    //     position: "relative",
    //     "transform-origin": "0 0",
    //     "-o-transform": "scale(" + ratio + ")",
    //     "-webkit-transform": "scale(" + ratio + ")",
    //     "-moz-transform": "scale(" + ratio + ")",
    //     "-ms-transform": "scale(" + ratio + ")",
    //     transform: "scale(" + ratio + ")"
    // });
    console.log("ratio")
    console.log(ratio)

    var target = jsonReturn.data;
    var $parent = $("#contentDocument");
    target.data = reSrcBg(target.data, host, filePath, folder, pageNumber);
    // for (var i = 0; i < target.data.length; i++) {
    //     var currentPage = target.data[i].data

    //     $("\<li id=\"page-rel-1\" class=\"page-content\" style=\"height: 1163.76px\;\"\>").html(currentPage).appendTo("#mainContent");
    // }
    for (var i=0; i < target.data.length; i++) {
        console.log(target.data[i].page_number)
        if (target.data[i].state == "success" && typeof target.data[i].data != "undefined") {
            readOnlyMode = target.data[i].page_number;
            /** @type {string} */
            code = '<li id="page-rel-' + target.data[i].page_number + '">' + target.data[i].data + "</li>";
            blockCode = "";
            /** @type {string} */
            code = '<li id="page-rel-' + readOnlyMode + '">' + target.data[i].data + "</li>";
            /** @type {string} */
            code = code + '<li class="page-content ads">';
            /** @type {string} */
            code = code + blockCode;
            /** @type {string} */
            code = code + "</div>";
            /** @type {string} */
            code = code + "</li>";
            $parent.find("ul").append(code);
        }
    }

}



//if JSON fails
function onError(xhr, status, errorThrown) {

    alert("Sorry, there was a problem!");
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);

}


