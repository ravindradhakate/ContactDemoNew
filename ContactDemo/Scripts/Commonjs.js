var isValid = false;
var typePOST = "POST", typePUT = "PUT", typeDELETE = "DELETE", typeGET = "GET";
var response;
var errors = [];

function OpenErrorPopupModal() {
    var errMsg = "<ul><li>" + errors.join(" </li><li> ") + "</li></ul>"
    $("#divErrorMsg").html(errMsg);
    //$("#divErrorMsg").attr("style", "word-wrap:break-word;");
    $('#popupErr').modal('show');
}

var modelError = function (x, y, z) {
    var response = null;
    errors = [];

    //WE IGNORE MODEL STATE EXTRACTION IF THERE WAS SOME OTHER UNEXPECTED ERROR (I.E. NOT A VALIDATION ERROR)
    if (x.status == 400) {//SINCE WE ARE RETURNING BAD REQUEST STATUS FROM OUR WEB API, SO WE CHECK IF STATUS CODE IS 400
        try {
            response = JSON.parse(x.responseText);
        }
        catch (e) { //this is not sending us a ModelState, else we would get a good responseText JSON to parse)
        }
    }
    if (response != null) {
        var modelState = response.ModelState;       
        for (var key in modelState) {
            if (modelState.hasOwnProperty(key)) {
                for (var i = 0; i < modelState[key].length; i++) {
                    errors.push(modelState[key][i]);
                }
            }
        }
    }
    OpenErrorPopupModal();
}

function AjaxFunction(type, url, data, onsucessFun) {
    $.ajax({
        type: type,
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (returnResponse) {
            response = returnResponse;
            onsucessFun();
        },
        failure: function (returnResponse) {
            alert(returnResponse.responseText);
        },
        error: function (x, y, z) {
            modelError(x, y, z);
        }
    });
}

function CheckValidEmailAddress(emailAddress) {

    var domains = [".com", ".net", ".co.in", ".in", ".org", ".nic", ".firm.in", ".net.in", "gov.in", ".edu.in", ".org.in", ".gen.in", ".ind.in", ".ac.in", ".edu", ".res.in",
    ".gov.in", ".gen", ".ind", ".ac", ".edu.", ".res", ".gov"];

    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF{1,2}]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    emailAddress = $.trim(emailAddress);
    var result = pattern.test(emailAddress);
    if (result) {
        var Temp = emailAddress.split('@');
        var domname = "." + Temp[1].split('.').slice(1).join('.');
        for (j = 0; j < domains.length; j++) {
            if (domname.toLowerCase() == domains[j]) {
                result = true;
                return result;
            }
            else {
                result = false;
            }
        }
    }
    return result
};