'use strict';
/**
 * @param {string} str
 * @return {?}
 */
function getPathCss(str) {
  if ("" == str) {
    return false;
  }
  var t = str.split("/");
  return t.length <= 0 ? false : (t.splice(-1, 1), t.join("/") + "/");
}
/**
 * @param {!Object} posts
 * @param {string} type
 * @param {string} filename
 * @param {string} uri
 * @param {number} from
 * @return {?}
 */
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
/**
 * @return {?}
 */
function getRatio() {
  /** @type {number} */
  var n = $("#contentDocument").width() - 10;
  var videosInRow = $(".d, .pf").width();
  return n / videosInRow;
}
/**
 * @param {?} data
 * @param {number} timeHorizonInYears
 * @return {undefined}
 */
function showMoreDocContent(data, timeHorizonInYears) {
  showDocContent(timeHorizonInYears, timeHorizonInYears);
  if (timeHorizonInYears + preLoad >= pageShowReal) {
    $(data).parent().hide();
    $(".detailActionDownload").removeClass("hidden");
  } else {
    $(data).attr("onclick", "showMoreDocContent(this, " + (timeHorizonInYears * 1 + preLoad) + ")");
  }
}
/**
 * @param {number} num
 * @param {number} index
 * @return {undefined}
 */
function showDocContent(num, index) {
  if (!(index > num)) {
    $.ajax({
      type : "POST",
      url : ajax,
      data : {
        docId : docId,
        pageMax : pageMax,
        pageShow : pageShowReal,
        folder : folder,
        filePath : filePath,
        fileHtml : fileHtml,
        pageNumber : index,
        pageLength : preLoad,
        link : link,
        ajax : ajax,
        code : code,
        time : timeCurrent,
        type : type
      },
      success : function(fn) {
        var $parent = $("#contentDocument");
        var target = fn.data;
        /** @type {number} */
        var readOnlyMode = 0;
        /** @type {string} */
        var blockCode = "";
        /** @type {string} */
        var code = "";
        var y;
        var noFormsTemplate;
        var ratio;
        var crowdC2;
        var image_height;
        var uncert;
        var triggerEle;
        var newPos;
        var ret;
        if ($parent.find(".loaddingDoc").hide(), target.data.length > 0) {
          $(target.data);
          target.data = reSrcBg(target.data, host, filePath, folder, index);
          /** @type {number} */
          i = 0;
          for (; i < target.data.length; i++) {
            if (target.data[i].state == "success" && typeof target.data[i].data != "undefined") {
              readOnlyMode = target.data[i].page_number;
              /** @type {string} */
              code = '<li id="page-rel-' + target.data[i].page_number + '">' + target.data[i].data + "</li>";
              if (readOnlyMode == 1) {
                blockCode = getAdsense(3);
              } else {
                if (readOnlyMode == 2) {
                  /** @type {string} */
                  blockCode = '<div id="adsBlueSeet" style="margin-top: 10px;display: inline-block;vertical-align: top;margin-right: 40px;"></div>';
                  /** @type {string} */
                  blockCode = blockCode + getAdsense(4);
                  /** @type {number} */
                  y = Math.floor(Math.random() * 2 + 1);
                  /** @type {string} */
                  blockCode = blockCode + (y == 1 ? '<div class="ads_show"><a rel="nofollow" href="https://freelancer.wehelp.vn/dangky" target="_blank"><img src="https://media.store123doc.com/images/web_2/we-help-compressor.png" /></a></div>' : '<div class="ads_show"><a rel="nofollow" href="https://crm.nhanh.vn/?refcode=123doc" target="_blank"><img src="https://media.store123doc.com/images/web_2/crm_nhanh.png" /></a></div>');
                } else {
                  blockCode = readOnlyMode == 3 ? getAdsense(3) : readOnlyMode % 3 == 0 ? getAdsense(3) : readOnlyMode % 3 == 1 ? getAdsense(4) : getAdsense(1);
                }
              }
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
              noFormsTemplate = $("ul li:last-child", $parent);
              if ("undefind" != noFormsTemplate && index > 1) {
                $(code).insertAfter(noFormsTemplate);
              } else {
                $parent.find("ul").append(code);
              }
            }
          }
          ratio = getRatio();
          ratioCurr = ratio;
          $(".d, .pf", $parent).css({
            position : "relative",
            "transform-origin" : "0 0",
            "-o-transform" : "scale(" + ratio + ")",
            "-webkit-transform" : "scale(" + ratio + ")",
            "-moz-transform" : "scale(" + ratio + ")",
            "-ms-transform" : "scale(" + ratio + ")",
            transform : "scale(" + ratio + ")"
          });
        }
        if (crowdC2 = $("li", $parent).not(".page-content"), crowdC2.length > 0) {
          /** @type {number} */
          j = 0;
          for (; j < crowdC2.length; j++) {
            image_height = $(crowdC2[j]).height();
            $(crowdC2[j]).height(image_height * ratio);
            $(crowdC2[j]).addClass("page-content");
          }
        }
        uncert = getPositionPageDoc();
        checkPositionPage(uncert);
        triggerEle = $("li#page-rel-" + num);
        if (triggerEle.length > 0 && index > 1) {
          newPos = $(triggerEle).offset().top;
          $(window).scrollTop(newPos);
        }
        hideDetailBar();
        /** @type {!Array} */
        ret = ret || [];
        ret.push({
          divIdShow : "adsBlueSeet",
          id_postion : 147,
          maxBan : 1
        });
        /** @type {!Array} */
        ret = ret || [];
        /** @type {!Array} */
        pageOptions.banners = ret;
        (function() {
          /** @type {number} */
          check_show_advatgia = 0;
          (new vatgiaAd(pageOptions, adblock)).Ads();
        })();
      },
      dataType : "json"
    });
  }
}
/**
 * @return {undefined}
 */
function changeFullScreen() {
  var navHeightDiff = $(window).width();
  var crowdC2;
  if ($("#contentDocument").css({
    width : navHeightDiff - 20 + "px",
    "overflow-y" : "auto",
    padding : "10px"
  }), crowdC2 = $("li.page-content", "#contentDocument").not(".ads"), crowdC2.length > 0) {
    /** @type {number} */
    j = 0;
    for (; j < crowdC2.length; j++) {
      var element = $(".d, .pf", $(crowdC2[j]));
      var cs = element.width();
      var ratio = element.height();
      /** @type {number} */
      var h = (navHeightDiff - 50) / cs;
      element.css({
        "transform-origin" : "0 0",
        "-o-transform" : "scale(" + h + ")",
        "-webkit-transform" : "scale(" + h + ")",
        "-moz-transform" : "scale(" + h + ")",
        "-ms-transform" : "scale(" + h + ")",
        transform : "scale(" + h + ")"
      });
      $(crowdC2[j]).height(ratio * h);
    }
  }
}
/**
 * @return {undefined}
 */
function changeDefault() {
  var h;
  var crowdC2;
  var ratio;
  if ($("#contentDocument").css({
    width : "100%",
    "overflow-y" : "hidden",
    padding : "0"
  }), h = getRatio(), $(".d, .pf", "#contentDocument").css({
    position : "relative",
    "transform-origin" : "0 0",
    "-o-transform" : "scale(" + h + ")",
    "-webkit-transform" : "scale(" + h + ")",
    "-moz-transform" : "scale(" + h + ")",
    "-ms-transform" : "scale(" + h + ")",
    transform : "scale(" + h + ")"
  }), crowdC2 = $("li.page-content", "#contentDocument").not(".ads"), crowdC2.length > 0) {
    /** @type {number} */
    j = 0;
    for (; j < crowdC2.length; j++) {
      ratio = $(".d, .pf", $(crowdC2[j])).height();
      $(crowdC2[j]).height(ratio * h);
    }
  }
}
/**
 * @return {undefined}
 */
function toggleFullScreen() {
  if (screenfull.enabled) {
    var element = $("#contentDocument");
    screenfull.request(element[0]);
  } else {
    alert("Tr\u00c3\u00acnh duy\u00e1\u00bb\u2021t ho\u00e1\u00ba\u00b7c trang web b\u00e1\u00ba\u00a1n \u00c4\u2018ang xem kh\u00c3\u00b4ng cho ph\u00c3\u00a9p xem to\u00c3 n m\u00c3 n h\u00c3\u00acnh!");
  }
}
/**
 * @param {?} mei
 * @return {undefined}
 */
function showBoxEmbed(mei) {
  $(".docEmbed").removeClass("hidden");
  $(mei).find("i").addClass("active");
  getStringEmbed();
}
/**
 * @return {undefined}
 */
function closeBoxEmbed() {
  $(".docEmbed").addClass("hidden");
  $("i.icon.i_link").removeClass("active");
}
/**
 * @return {undefined}
 */
function getStringEmbed() {
  var getdate = window.docName || "";
  var aInitP = window.link || "";
  var bInitP = window.linkEmbed || "";
  /** @type {string} */
  var selectedCancerStudy = '<a target="_blank" title="' + getdate + ' tr\u00c3\u00aan 123doc.org" href="' + aInitP + '" style="margin: 12px auto 6px auto; font-family: Helvetica,Arial,Sans-serif; font-style: normal; font-variant: normal; font-weight: normal; font-size: 14px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; display: block; text-decoration: underline;">' + getdate + "</a>";
  var state = $("#opstSizeIF").val();
  /** @type {string} */
  var n = "100%";
  /** @type {string} */
  var t = "600";
  var _acgh;
  switch(state) {
    case "800x600":
      /** @type {string} */
      n = "800";
      /** @type {string} */
      t = "600";
      break;
    case "400x600":
      /** @type {string} */
      n = "400";
      /** @type {string} */
      t = "600";
      break;
    case "auto":
      /** @type {string} */
      n = "100%";
      /** @type {string} */
      t = "600";
  }
  /** @type {string} */
  _acgh = '<iframe src="' + bInitP + '" width="' + n + '" height="' + t + '" data-auto-height="true" scrolling="true" name="123doc-embed" id="123doc-embed" frameborder="0" style="border: 1px solid #dfdfdf" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';
  $("#textEmbedIF").val(selectedCancerStudy + _acgh);
}
/**
 * @return {undefined}
 */
function addMart() {
  $.post("/documents/ajax/aja_addCart.php", {
    docId : docId
  }, function(data) {
    if (0 == data.code) {
      alert(data.mess);
    } else {
      var node = $("span", ".add_mart");
      node.text(data.count);
      node.removeClass("hidden").addClass("rotate");
      if (1 == data.count) {
        showCart();
      }
    }
  }, "json");
}
/**
 * @param {?} n
 * @return {undefined}
 */
function checkAddCart(n) {
  $.post("/documents/ajax/aja_checkAddCart.php", {}, function(apiResponseError) {
    if (1 == apiResponseError.code && confirm("B\u00e1\u00ba\u00a1n c\u00c3\u00b3 1 gi\u00e1\u00bb\u008f h\u00c3 ng \u00c4\u2018\u00c3\u00a3 x\u00c3\u00a1c nh\u00e1\u00ba\u00adn nh\u00c6\u00b0ng ch\u00c6\u00b0a thanh to\u00c3\u00a1n. Thanh to\u00c3\u00a1n gi\u00e1\u00bb\u008f h\u00c3 ng n\u00c3 y?")) {
      askPayCart();
    } else {
      addMart(n);
    }
  }, "json");
}
/**
 * @param {?} pelm
 * @return {undefined}
 */
function showFullDes(pelm) {
  $(".detailDescription .des_content").addClass("des_full");
  $(pelm).text("- R\u00c3\u00bat g\u00e1\u00bb\u008dn -");
  $(pelm).attr("onclick", "showSortDes(this)");
}
/**
 * @param {?} pelm
 * @return {undefined}
 */
function showSortDes(pelm) {
  $(".detailDescription .des_content").removeClass("des_full");
  $(pelm).text("- Xem th\u00c3\u00aam -");
  $(pelm).attr("onclick", "showFullDes(this)");
}
/**
 * @return {undefined}
 */
function loadDocumentDatamining() {
  var n = $(".detailDatamining");
  if ("" == n.html()) {
    $.post("/documents/ajax/aja_document_datamining.php", {
      doc : docId
    }, function(t) {
      n.append(t);
      checkDataGa();
    });
  }
}
/**
 * @param {?} pelm
 * @return {undefined}
 */
function showMoreOutLine(pelm) {
  $("ul", ".outline").addClass("full");
  $(pelm).attr("onclick", "showSortOutLine(this)");
  $(pelm).text("R\u00c3\u00bat g\u00e1\u00bb\u008dn");
}
/**
 * @param {?} pelm
 * @return {undefined}
 */
function showSortOutLine(pelm) {
  $("ul", ".outline").removeClass("full");
  $(pelm).attr("onclick", "showMoreOutLine(this)");
  $(pelm).text("Xem th\u00c3\u00aam");
}
/**
 * @return {?}
 */
function getPositionPageDoc() {
  var context = $(".page-content").not(".ads");
  /** @type {!Array} */
  var value = [];
  return $.each(context, function(canCreateDiscussions, forSelector) {
    value.push($(forSelector).offset().top);
  }), value;
}
/**
 * @param {!Object} n
 * @return {undefined}
 */
function checkPositionPage(n) {
  $(window).scroll(function() {
    var swapIndex = $(this).scrollTop();
    $.each(n, function(textareaContent, i) {
      if (swapIndex >= i) {
        $("#scrollPage").html(textareaContent + 1);
      }
    });
  });
}
/**
 * @return {undefined}
 */
function showHistoryDownload() {
  colorbox(2, "/documents/popup/show_history_download.php?docId=" + docId, "L\u00e1\u00bb\u2039ch s\u00e1\u00bb\u00ad t\u00e1\u00ba\u00a3i t\u00c3 i li\u00e1\u00bb\u2021u", 600, 600, void 0, function() {
  });
}
/**
 * @return {undefined}
 */
function hideBoxCmtFixed() {
  $(".boxCmt_bottom").addClass("_hidden");
  /** @type {number} */
  checkShowBox = 1;
}
/**
 * @return {undefined}
 */
function showBoxCmtFixed() {
  $(".boxCmt_bottom").removeClass("_hidden");
}
/**
 * @return {undefined}
 */
function hideDetailBar() {
  var fhTop = $(".detailListHotNew").offset().top;
  /** @type {string} */
  var left = $(".detailBar").height() + 20 + "px";
  var i = ($("#showBoxCmtFixed"), $("#contentDocument").offset().top);
  $(".detailDatamining").offset().top - 600;
  $(window).scroll(function() {
    if ($(window).scrollTop() > fhTop) {
      $(".detailBar").css("bottom", "-" + left);
      $(".detailDownload > span > em").hide();
    } else {
      $(".detailBar").css("bottom", "0");
      $(".detailDownload > span > em").show();
    }
    if ($(window).scrollTop() > i) {
      $(".headerRight .mainBox").not("#detailDownload").addClass("hidden");
      $(".mainBox#detailDownload").removeClass("hidden");
    } else {
      $(".headerRight .mainBox").not("#detailDownload").removeClass("hidden");
      $(".mainBox#detailDownload").addClass("hidden");
    }
  });
}
/**
 * @param {string} nocache
 * @return {undefined}
 */
function showBoxDownload_notLogin(nocache) {
  $("body").find(".boxAddMoney_notLogin").remove();
  /** @type {string} */
  var paneHeight = ($(window).width() - 800) / 2 + "px";
  /** @type {string} */
  var photoText = '<div class="bg_transparent addViewAct" onclick="_closeBox(1);"></div><div class="boxAddMoney_notLogin"></div>';
  $("body").append(photoText);
  $.post("/documents/popup/pop_download_not_login.php?docId=" + nocache, {}, function(entryEl) {
    $(".boxAddMoney_notLogin").append(entryEl).css("left", paneHeight);
  });
}
/**
 * @param {?} n
 * @return {undefined}
 */
function _closeBox(n) {
  if ($("body").find(".bg_transparent").hasClass("addViewAct")) {
    addViewAction();
  }
  $("body").find(".boxAddMoney_notLogin").remove();
  $("body").find(".bg_transparent").remove();
  if (n) {
    popupFeedback_open();
  }
}
/**
 * @return {undefined}
 */
function close_tooltip_download() {
  $(".detailDownload > span > em").hide();
}
/**
 * @return {undefined}
 */
function checkDescription() {
  $.post("/documents/ajax/aja_re_gen_description.php", {
    path : filePath,
    file : fileHtml,
    id : docId,
    name : docName
  }, function() {
  }, "json");
}
/**
 * @return {undefined}
 */
function scrollToComment() {
  $("html, body").animate({
    scrollTop : $("#detailCommentFb").offset().top
  }, 500);
}
/**
 * @param {?} mei
 * @return {undefined}
 */
function remmove_ac(mei) {
  $(mei).find(".lbl_active").removeClass("lbl_active");
}
/**
 * @param {string} grp_name
 * @param {string} tpl_id
 * @return {undefined}
 */
function showFormNotifiDocument(grp_name, tpl_id) {
  $.post("/users/popup/pop_show_user_notifi_document.php?docId=" + grp_name + "&docName=" + tpl_id, {}, function(n) {
    colorbox(1, n, "B\u00c3\u00a1o x\u00e1\u00ba\u00a5u t\u00c3 i li\u00e1\u00bb\u2021u", 600, 400, void 0, function() {
    });
  });
}
/**
 * @param {number} n
 * @param {string} froot
 * @param {string} fext
 * @return {undefined}
 */
function showFormHDAdmin(n, froot, fext) {
  if (!(0 >= n)) {
    colorbox(2, "/documents/popup/show_formHDAdmin.php?docId=" + n + "&docName=" + froot + "&useId=" + fext, "H\u00e1\u00ba\u00adu duy\u00e1\u00bb\u2021t t\u00c3 i li\u00e1\u00bb\u2021u", 500, 350, void 0, function() {
    });
  }
}
/**
 * @param {number} header
 * @return {?}
 */
function getAdsense(header) {
  var pendingInput;
  switch(str = "", header) {
    case 1:
      /** @type {string} */
      str = '<ins class="adsbygoogle"\t\t\t\t\t    style="display:inline-block;width:300px;height:250px"\t\t\t\t\t     data-ad-client="ca-pub-2979760623205174"\t\t\t\t\t     data-ad-slot="6900588045"></ins>';
      break;
    case 2:
      /** @type {string} */
      str = '<ins class="adsbygoogle"\t\t\t\t\t     style="display:inline-block;width:300px;height:600px"\t\t\t\t\t     data-ad-client="ca-pub-2979760623205174"\t\t\t\t\t     data-ad-slot="8377321249"></ins>';
      break;
    case 3:
      /** @type {string} */
      str = '<ins class="adsbygoogle"\t\t\t\t\t     style="display:inline-block;width:728px;height:90px"\t\t\t\t\t     data-ad-client="ca-pub-2979760623205174"\t\t\t\t\t     data-ad-slot="9854054443"></ins>';
      break;
    case 4:
      /** @type {string} */
      str = '<ins class="adsbygoogle"\t\t\t\t\t     style="display:inline-block;width:336px;height:280px"\t\t\t\t\t     data-ad-client="ca-pub-2979760623205174"\t\t\t\t\t     data-ad-slot="2330787642"></ins>';
      break;
    case 5:
      /** @type {string} */
      str = '<ins class="adsbygoogle"\t\t\t\t\t     style="display:inline-block;width:160px;height:600px"\t\t\t\t\t     data-ad-client="ca-pub-2979760623205174"\t\t\t\t\t     data-ad-slot="3807520840"></ins>';
      break;
    case 6:
      /** @type {string} */
      str = '<ins class="adsbygoogle"                      style="display:inline-block;width:320px;height:100px"                      data-ad-client="ca-pub-2979760623205174"                      data-ad-slot="1622450445"></ins>';
      break;
    case 7:
      /** @type {string} */
      str = '<ins class="adsbygoogle"\t\t\t\t\t\t     style="display:inline-block;width:728px;height:15px"\t\t\t\t\t\t     data-ad-client="ca-pub-2979760623205174"\t\t\t\t\t\t     data-ad-slot="9319378846"></ins>';
      break;
    case 8:
      /** @type {string} */
      str = '<ins class="adsbygoogle"\t\t\t\t\t\t     style="display:inline-block;width:200px;height:90px"\t\t\t\t\t\t     data-ad-client="ca-pub-2979760623205174"\t\t\t\t\t\t     data-ad-slot="3272845248"></ins>';
      break;
    case 9:
      /** @type {string} */
      str = '<ins class="adsbygoogle"\t\t\t\t\t\t     style="display:inline-block;width:900px;height:144px"\t\t\t\t\t\t     data-ad-client="ca-pub-2979760623205174"\t\t\t\t\t\t     data-ad-slot="6231549643"></ins>';
      break;
    default:
      /** @type {string} */
      str = "";
  }
  return is_getAdsJs ? pendingInput = "" : (pendingInput = "", is_getAdsJs = 1), "" != str && (str = pendingInput + str + "<script>(adsbygoogle = window.adsbygoogle || []).push({});\x3c/script>"), str;
}
/**
 * @return {?}
 */
function getRandomColor() {
  /** @type {!Array<string>} */
  var letters = "BCDEF".split("");
  /** @type {string} */
  var color = "#";
  /** @type {number} */
  var n = 0;
  for (; n < 6; n++) {
    /** @type {string} */
    color = color + letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}
/**
 * @param {string} string
 * @return {?}
 */
function getLastCharacter(string) {
  var splitStr = string.split(" ");
  var i = splitStr.length;
  return i = i - 1, splitStr[i].charAt(0);
}
/**
 * @param {string} selector
 * @return {?}
 */
function sortContent(selector) {
  var reverseSignedTransactions = selector.split(" ");
  var transactionTotal = reverseSignedTransactions.length;
  /** @type {string} */
  selector = "";
  var propagateCounter;
  if (transactionTotal > 11) {
    /** @type {number} */
    propagateCounter = 0;
    for (; propagateCounter < 10; propagateCounter++) {
      /** @type {string} */
      selector = selector + (" " + reverseSignedTransactions[propagateCounter]);
    }
    /** @type {string} */
    selector = selector + "...";
  } else {
    /** @type {number} */
    propagateCounter = 0;
    for (; propagateCounter < transactionTotal; propagateCounter++) {
      /** @type {string} */
      selector = selector + (" " + reverseSignedTransactions[propagateCounter]);
    }
  }
  return selector;
}
/**
 * @param {string} s
 * @return {?}
 */
function sortTitle(s) {
  var reverseSignedTransactions = s.split(" ");
  var transactionTotal = reverseSignedTransactions.length;
  /** @type {string} */
  s = "";
  var propagateCounter;
  if (transactionTotal > 6) {
    /** @type {number} */
    propagateCounter = 0;
    for (; propagateCounter < 6; propagateCounter++) {
      /** @type {string} */
      s = s + (" " + reverseSignedTransactions[propagateCounter]);
    }
    /** @type {string} */
    s = s + "...";
  } else {
    /** @type {number} */
    propagateCounter = 0;
    for (; propagateCounter < transactionTotal; propagateCounter++) {
      /** @type {string} */
      s = s + (" " + reverseSignedTransactions[propagateCounter]);
    }
  }
  return s;
}
/**
 * @return {undefined}
 */
function popupDocReq() {
  $("body").find(".boxAddMoney").remove();
  /** @type {string} */
  var horizCenter = ($(window).width() - 800) / 2 - 50 + "px";
  /** @type {string} */
  var photoText = '<div class="bg_transparent" onclick="closeBox();"></div><div style="position: absolute;left:25%;top:300px;" class="boxAddMoney"></div>';
  $("body").append(photoText);
  $.ajax({
    url : "/global/ajax/aja_send_req_doc.php",
    type : "POST",
    dataType : "html",
    beforeSend : function() {
      $("<div id='loading-excel'></div>").appendTo("body");
    },
    complete : function() {
      $("#loading-excel").remove();
    },
    success : function(htmlExercise) {
      $(".boxAddMoney").append(htmlExercise);
    }
  });
}
/** @type {number} */
var is_getAdsJs = 0;
var documentElement;
!function(window, document) {
  /** @type {boolean} */
  var keyboardAllowed = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT" in Element;
  var fn = function() {
    var val;
    var l;
    /** @type {!Array} */
    var attrs = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", "mozCancelFullScreen", 
    "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenchange", "MSFullscreenerror"]];
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var length = attrs.length;
    var normalized = {};
    for (; length > i; i++) {
      if (val = attrs[i], val && val[1] in document) {
        /** @type {number} */
        i = 0;
        l = val.length;
        for (; l > i; i++) {
          normalized[attrs[0][i]] = val[i];
        }
        return normalized;
      }
    }
    return false;
  }();
  var screenfull = {
    request : function(elem) {
      var request = fn.requestFullscreen;
      elem = elem || document.documentElement;
      if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {
        elem[request]();
      } else {
        elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
      }
    },
    exit : function() {
      document[fn.exitFullscreen]();
    },
    toggle : function(elem) {
      if (this.isFullscreen) {
        this.exit();
      } else {
        this.request(elem);
      }
    },
    onchange : function() {
    },
    onerror : function() {
    },
    raw : fn
  };
  return fn ? (Object.defineProperties(screenfull, {
    isFullscreen : {
      get : function() {
        return !!document[fn.fullscreenElement];
      }
    },
    element : {
      enumerable : true,
      get : function() {
        return document[fn.fullscreenElement];
      }
    },
    enabled : {
      enumerable : true,
      get : function() {
        return !!document[fn.fullscreenEnabled];
      }
    }
  }), document.addEventListener(fn.fullscreenchange, function(p1__3354_SHARP_) {
    screenfull.onchange.call(screenfull, p1__3354_SHARP_);
  }), document.addEventListener(fn.fullscreenerror, function(p1__3354_SHARP_) {
    screenfull.onerror.call(screenfull, p1__3354_SHARP_);
  }), void(window.screenfull = screenfull)) : void(window.screenfull = false);
}(window, document);
/** @type {!Array} */
var _pages = [];
/** @type {number} */
var _widthContentElement = 0;
/** @type {number} */
var _heightContentElement = 0;
/** @type {number} */
var checkShowBox = 0;
/** @type {string} */
var div_adcontent = "bs-inread-container";
/** @type {string} */
var div_player = "bs-player-inread";
/** @type {string} */
var v_height = "250";
/** @type {string} */
var v_width = "420";
/** @type {string} */
var div_maincontains = "adsBlueSeet";
/** @type {string} */
var rule = "div";
/** @type {number} */
var rule_show_before = 1;
/** @type {string} */
var bs_mode = "auto";
/** @type {number} */
var timestamp = +new Date;
/** @type {string} */
var tag = "http://blueserving.com/vast.xml?key=e4a774eccac0be7e1cff0e9742623acb&r=" + timestamp;
$(document).ready(function() {
  var dfy = getPathCss(strCss);
  var zeroSizeMax;
  var pixelSizeTargetMax;
  var diffInMicroSeconds;
  var photoText;
  $.get(strCss, {}, function(n) {
    n = n.replace(/(\w*)\.ttf/g, dfy + "$1.ttf");
    /** @type {string} */
    var photoText = '<style rel="more">' + n + "</style>";
    $("head").append(photoText);
  }).always(function() {
    showDocContent(pageNumber, 1);
    if ("undefined" != typeof enableBlueSheet_Inread && enableBlueSheet_Inread) {
      setTimeout(function() {
        /** @type {!Element} */
        var script = document.createElement("script");
        var element;
        /** @type {string} */
        script.type = "text/javascript";
        /** @type {string} */
        script.src = "http://lab.blueserving.com/libs/bs-inread-HTMLv1.0.js";
        /** @type {!NodeList<Element>} */
        element = document.getElementsByTagName("footer");
        element[0].parentNode.insertBefore(script, element[0]);
      }, 2E3);
    }
    loadDocumentDatamining();
  });
  if (isGenTagTeaserAuto) {
    $.post("/documents/ajax/ajax_gen_tags_teaser_relate.php", {
      doc : docId,
      docName : docName,
      checkMd5 : checkMd5Teaser,
      timeCurr : timeGenTeaser
    }, function() {
    });
  }
  if ($("#divAdFix").length > 0) {
    zeroSizeMax = $("#divAdFix").offset().top;
    /** @type {number} */
    pixelSizeTargetMax = 0;
    $(window).scroll(function() {
      pixelSizeTargetMax = $(window).scrollTop();
      if (zeroSizeMax - pixelSizeTargetMax < -350) {
        $("#divAdFix").addClass("divAdFix");
      } else {
        $("#divAdFix").removeClass("divAdFix");
      }
    });
  }
  diffInMicroSeconds = $(".detailRight").offset().top + $(".detailRight").height();
  /** @type {number} */
  window.h = Math.floor(diffInMicroSeconds - 25);
  $.getJSON("/test/data.json", function(arrayOfOptions) {
    /** @type {string} */
    var str = "";
    /** @type {number} */
    var i = 0;
    $.each(arrayOfOptions, function(n, r) {
      return str = str + "<li>", str = str + ("<a target='_blank' href='" + r.url + "' class='miny_lastest_thumb' style='background: "), str = str + getRandomColor(), str = str + ("' title='" + r.user + "'>"), str = str + (getLastCharacter(r.user) + "</a>"), str = str + ("<div class='miny_lastest_cate_top'><a target='_blank' href='" + r.url + "' class='miny_lastest_title'>"), str = str + sortTitle(r.title), str = str + "</a></br>", str = str + "<div class='miny_lastest_cates'><span>", $.each(r.tags, 
      function(n, a) {
        str = str + "<a href='#' class='miny_lastest_cate' style='background:";
        str = str + a.color;
        /** @type {string} */
        str = str + "'>";
        /** @type {string} */
        str = str + a.name;
        /** @type {string} */
        str = str + "</a>";
      }), str = str + ("<span class='miny_lastest_time'>" + r.time + "</span></div>"), str = str + ("<div class='miny_lastest_answer'><a target='_blank' href='" + r.url + "' class='miny_lastest_answer_link'><i class='miny_lastest_answer_img'></i> Tr\u00e1\u00ba\u00a3 l\u00e1\u00bb\u009di ngay</a></div>"), str = str + "<div class='miny_lastest_sortContent'>", str = str + "<p>", str = str + sortContent(r.content), str = str + "</p></div></li>", i++, i > 4 ? false : void 0;
    });
    $("#miny_lastest_ul").append(str);
  });
  if (document.body.scrollTop >= window.h) {
    $("#divAd2").addClass("floating");
  }
  if (document.body.scrollTop < window.h) {
    $("#divAd2").removeClass("floating");
  }
  if (catParentId1 !== undefined && parseInt(catParentId1) === 54) {
    console.log("category_5444");
    /** @type {string} */
    photoText = "   \x3c!-- Facebook Pixel Code --\x3e     <script>     !function(f,b,e,v,n,t,s)     {if(f.fbq)return;n=f.fbq=function(){n.callMethod?     n.callMethod.apply(n,arguments):n.queue.push(arguments)};     if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';     n.queue=[];t=b.createElement(e);t.async=!0;     t.src=v;s=b.getElementsByTagName(e)[0];     s.parentNode.insertBefore(t,s)}(window,document,'script',     'https://connect.facebook.net/en_US/fbevents.js');      fbq('init', '1828234860536593');      fbq('track', 'PageView');     \x3c/script>     <noscript>      <img height=\"1\" width=\"1\"      src=\"https://www.facebook.com/tr?id=1828234860536593&ev=PageView     &noscript=1\"/>     </noscript>    \x3c!-- End Facebook Pixel Code --\x3e  ";
    $("head").append(photoText);
  }
}), documentElement = document.getElementById("contentDocument"), document.addEventListener(screenfull.raw.fullscreenchange, function() {
  if (screenfull.isFullscreen) {
    changeFullScreen();
  } else {
    changeDefault();
  }
}), $("#opstSizeIF").change(function() {
  getStringEmbed();
}), isDocEssay && $("#container").empty().append('<div class="document-alert document-alert-error">Kh\u00c3\u00b4ng th\u00e1\u00bb\u0192 t\u00c3\u00acm th\u00e1\u00ba\u00a5y t\u00c3 i li\u00e1\u00bb\u2021u n\u00c3 y tr\u00c3\u00aan h\u00e1\u00bb\u2021 th\u00e1\u00bb\u2018ng. Mong b\u00e1\u00ba\u00a1n th\u00c3\u00b4ng c\u00e1\u00ba\u00a3m!</div>'), $(window).scroll(function() {
  if (document.body.scrollTop >= window.h) {
    $("#divAd2").addClass("floating");
  }
  if (document.body.scrollTop < window.h) {
    $("#divAd2").removeClass("floating");
  }
});
