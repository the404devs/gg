var generateInvoiceLists = function() {
    $("#gg").find(".invlink").each(function() {
        $(this).attr("href", "./inv/gg/" + $(this).text() + "-GG.pdf")
    });
    $("#bni").find(".invlink").each(function() {
        $(this).attr("href", "./inv/bn/" + $(this).text() + "-BN.pdf")
    });
    $("#bnt").find(".invlink").each(function() {
        $(this).attr("href", "./time/bn/" + $(this).text() + "-BN.pdf")
    });
    $("#agi").find(".invlink").each(function() {
        $(this).attr("href", "./inv/ag/" + $(this).text() + "-AG.pdf")
    });
    $("#agt").find(".invlink").each(function() {
        $(this).attr("href", "./time/ag/" + $(this).text() + ".pdf")
    });
    showPanes(1);
    window.scrollTo(0, 0);
}