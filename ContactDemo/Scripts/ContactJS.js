var mode = 1; // 1 for create mode and 2 for edit mode
var Contact = function () {
    this.ID = 0,
    this.FirstName = "",
    this.LastName = "",
    this.Email = "",
    this.PhoneNumber = "",
    this.IsActive = false;
}

var contact = new Contact();
var id;

function GetContactData() {
    contact = new Contact();
    contact.FirstName = $("#FirstName").val();
    contact.LastName = $("#LastName").val();
    contact.Email = $("#Email").val();
    contact.PhoneNumber = $("#PhoneNumber").val();
    contact.IsActive = $("#IsActive").prop("checked");
    if (mode == 2)
        contact.ID = $("#hdnID").val();
}

function AppendContactRow() {
    var str = "";
    str = str + "<tr>"
        + "<td>" + contact.FirstName + "</td>"
        + "<td>" + contact.LastName + "</td>"
        + "<td>" + contact.Email + "</td>"
        + "<td>" + contact.PhoneNumber + "</td>"
        + "<td><input  class='check-box' disabled='disabled' type='checkbox' " + (contact.IsActive ? "checked" : "") + "></td>"
        + "<td><a class='lnkEdit' id='" + contact.ID + "'>Edit</a> | <a class='lnkDetails' id='" + contact.ID + "'>Details</a> | <a class='lnkDelete' id='" + contact.ID + "'>Delete</a></td>"
        + "</tr>";
    $("#tblContact tbody").append(str);
}

function EditContactRow(obj) {
    var cells = $(obj).closest("tr").find("td");
    $("#FirstName").val($(cells[0]).text());
    $("#LastName").val($(cells[1]).text());
    $("#Email").val($(cells[2]).text());
    $("#PhoneNumber").val($(cells[3]).text());
    var isChk = $(cells[4]).find(".check-box").prop("checked");
    $("#IsActive").prop("checked", isChk);
}

function UpdateContactRow() {
    var obj = $("a[id='" + contact.ID + "']").closest("tr");
    var cells = $(obj).find("td");
    $(cells[0]).text($("#FirstName").val());
    $(cells[1]).text($("#LastName").val());
    $(cells[2]).text($("#Email").val());
    $(cells[3]).text($("#PhoneNumber").val());
    $(cells[4]).find(".check-box").prop("checked", contact.IsActive);
}

function RemoveContactRow() {
    var obj = $("a[id='" + id + "']").closest("tr");
    obj.remove();
}

function ShowContactDetails(obj) {
    var str = "";
    $("#divDetails").html("");
    var cells = $(obj).closest("tr").find("td");
    var isChk = $(cells[4]).find(".check-box").prop("checked");
    str = str + "<h2>Contact Details</h2><hr><dl class='dl-horizontal'>"
                + "<dt>First Name</dt><dd>" + $(cells[0]).text() + "</dd>"
                + "<dt>Last Name</dt><dd>" + $(cells[1]).text() + "</dd>"
                + "<dt>Email</dt><dd>" + $(cells[2]).text() + "</dd>"
                + "<dt>Phone Number</dt><dd>" + $(cells[3]).text() + "</dd>"
                + "<dt>Is Active</dt><dd><input class='check-box' disabled='disabled' type='checkbox' " + (isChk ? "checked" : "") + "></dd>"
                + "</dl><p id='pDetails'><a id='lnkEdit'>Edit</a> | <a class='lnkList'>Back to List</a></p>";
    $("#divDetails").append(str);
}

function ClearContactData() {
    $("#FirstName").val("");
    $("#LastName").val("");
    $("#Email").val("");
    $("#PhoneNumber").val("");
    $("#IsActive").prop("chekced", false);
    contact = null;
}

function MakeDivInvisible() {
    $("#divContactList").addClass("hide");
    $("#divContactCE").addClass("hide");
    $("#divDetails").addClass("hide");
}

function ShowContactList() {
    MakeDivInvisible();
    ClearContactData();
    $("#divContactList").removeClass("hide");
}

function CheckValidation() {
    errors = [];    
    if (contact.FirstName === "")
        errors.push("Please enter first name.");

    if (contact.LastName === "")
        errors.push("Please enter last name.");

    if (contact.Email.trim() === "")
        errors.push("Please enter email.");
    else if (!CheckValidEmailAddress(contact.Email))
        errors.push("Please enter valid email.");

    if (contact.PhoneNumber === "")
        errors.push("Please enter phone number.");

    if (errors.length > 0)
        isValid = false;
}

var createContactResponse = function () {
    contact = response;
    AppendContactRow();
    alert("Contact added successfully.")
    ShowContactList();
    ClearContactData();
}

var editContactResponse = function () {
    UpdateContactRow();
    alert("Contact updated successfully.")
    ShowContactList();
    ClearContactData();
}

var deleteContactResponse = function () {
    RemoveContactRow();
    alert("Contact deleted successfully.")
    ShowContactList();
}

$(document).ready(function () {

    $(document).on("click", "#btnSave", function () {
        GetContactData();
        isValid = true;
        CheckValidation();
        if (isValid) {
            if (mode === 1)
                AjaxFunction(typePOST, "/api/ContactAPI/PostContact", contact, createContactResponse);
            else
                AjaxFunction(typePUT, "/api/ContactAPI/PutContact?id=" + id, contact, editContactResponse);
        }
        else {
            OpenErrorPopupModal()
        }
    });

    $(document).on("click", "#lnkCreate", function () {
        mode = 1;
        MakeDivInvisible();
        $("#divContactCE").removeClass("hide");
    });

    $(document).on("click", ".lnkList", function () {
        ShowContactList();
    });

    $(document).on("click", ".lnkEdit", function () {
        mode = 2;
        EditContactRow(this);
        MakeDivInvisible();
        $("#divContactCE").removeClass("hide");
        $("#hdnID").val($(this).attr("id"));
        id = $(this).attr("id");
    });

    $(document).on("click", ".lnkDetails", function () {
        MakeDivInvisible();
        $("#divDetails").removeClass("hide");
        $("#hdnID").val($(this).attr("id"));
        EditContactRow(this);
        ShowContactDetails(this);
    });

    $(document).on("click", ".lnkDelete", function () {
        id = $(this).attr("id");
        if (confirm("Do you really want to delete this contact?"))
            AjaxFunction(typeDELETE, "/api/ContactAPI/DeleteContact?id=" + id, "", deleteContactResponse);
    });
});