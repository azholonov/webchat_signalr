$(function () {

    setScreen(false);

    // Declare a proxy to reference the hub.
    var chatHub = $.connection.chatHub;

    registerClientMethods(chatHub);

    // Start Hub
    $.connection.hub.start().done(function () {

        registerEvents(chatHub)

    });

    $('#btnLogin').click(function () {
        $("#regSection").hide();
        $("#loginSection").show();
    });
    $('#btnRegistration').click(function () {
        $("#regSection").show();
        $("#loginSection").hide();
    });

    $('#dateFrom').datetimepicker({
        locale: 'ru',
        format: 'DD.MM.YYYY hh:mm:ss',
        daysOfWeekDisabled: [0, 6]
    });

    $('#dateTo').datetimepicker({
        locale: 'ru',
        format: 'DD.MM.YYYY hh:mm:ss',
        daysOfWeekDisabled: [0, 6]
    });
});

function setScreen(isLogin) {

    if (!isLogin) {

        $("#divChat").hide();
        $("#regSection").hide();
        $("#loginSection").hide();
    }
    else {

        $("#divChat").show();
        $("#loginSection").hide();
        $("#regSection").hide();
    }

}

function registerEvents(chatHub) {

    $("#btnStartChat").click(function () {

        var name = $("#inputLogin").val();
        var pswd = $("#inputPswd").val();
        if (name.length > 0 && pswd.length > 0) {
            chatHub.server.connect(name, pswd);
        }
        else {
            alert("Please enter name and login");
        }

    });

    $("#btnRegisterChat").click(function () {

        var name = $("#inputRegLogin").val();
        var pswd = $("#inputRegPswd").val();
        if (name.length > 0 && pswd.length > 0) {
            chatHub.server.register(name, pswd);
        }
        else {
            alert("Please enter name and password");
        }

    });


    $('#btnGetHistory').click(function () {
        $('#chatHistory').empty();
        var loginname = $('#hdUserName').val();
        var dateFrom = $('#dateFrom').val()
        var dateTo = $('#dateTo').val()
        var inputName = $('#inputName').val()
        var code = "";
        $.getJSON('/GetHistory?name='+ inputName +'&dtfrom=' + dateFrom + '&dtto=' + dateTo ,function (result) {
            $.each(result,function (i, field) {
                code = "";
                if (loginname == field["UserName"]) {
                    code = $('<div class="message">' + field["sendTime"] + ' <strong><font color="forestgreen">' + field["UserName"] + ' :</font></strong> ' + field["Text"] + '</div>');
                } else {
                    code = $('<div class="message">' + field["sendTime"] + ' <strong>' + field["UserName"] + ' :</strong> ' + field["Text"] + '</div>');
                }
                $('#chatHistory').append(code);
            });
        });
    });



    $('#btnSendMsg').click(function () {

        var msg = $("#txtMessage").val();
        if (msg.length > 0) {

            var userName = $('#hdUserName').val();
            chatHub.server.sendMessageToAll(userName, msg);
            $("#txtMessage").val('');
        }
    });


    $("#inputLogin").keypress(function (e) {
        if (e.which == 13) {
            $("#btnStartChat").click();
        }
    });

    $("#txtMessage").keypress(function (e) {
        if (e.which == 13) {
            $('#btnSendMsg').click();
        }
    });


}

function registerClientMethods(chatHub) {

    // Calls when user successfully logged in
    chatHub.client.onConnected = function (id, userName, allUsers, messages) {

        setScreen(true);

        $('#hdId').val(id);
        $('#hdUserName').val(userName);
        $('#spanUser').html(userName);

        // Add All Users
        for (i = 0; i < allUsers.length; i++) {

            AddUser(chatHub, allUsers[i].ConnectionId, allUsers[i].UserName);
        }

        // Add Existing Messages
        for (i = 0; i < messages.length; i++) {

            AddMessage(messages[i].UserName, messages[i].Message);
        }


    }

    // On New User Connected
    chatHub.client.onNewUserConnected = function (id, name) {

        AddUser(chatHub, id, name);
    }


    // On User Disconnected
    chatHub.client.onUserDisconnected = function (id, userName) {

        $('#' + id).remove();

        var disc = $('<div class="disconnect">"' + userName + '" logged off.</div>');

        $(disc).hide();
        $('#divusers').prepend(disc);
        $(disc).fadeIn(200).delay(2000).fadeOut(200);

    }

    chatHub.client.messageReceived = function (userName, message) {

        AddMessage(userName, message);
    }


}

function AddUser(chatHub, id, name) {

    var userId = $('#hdId').val();

    var code = "";

    if (userId == id) {

        code = $('<div class="loginUser">' + name + "</div>");

    } else {

        code = $('<a id="' + id + '" class="user" >' + name + '<a>');
    }

    $("#divusers").append(code);

}

function AddMessage(userName, message) {

    var loginname = $('#hdUserName').val();

    var code = "";
    
    if (userName == loginname) {
        code = $('<div class="message"><span class="loginUserName">' + userName + '</span>: ' + message + '</div>');
    } else {
        code = $('<div class="message"><span class="userName">' + userName + '</span>: ' + message + '</div>');
    }

    $('#divChatWindow').append(code);

    var height = $('#divChatWindow')[0].scrollHeight;
    $('#divChatWindow').scrollTop(height);
}