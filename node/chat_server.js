const ws = require("nodejs-websocket");

const server = ws.createServer(function(conn){

conn.on("text", function(data) {

let dataObject = JSON.parse(data);

if (dataObject.type == "join") {
    conn.nickName = dataObject.name;

    sendToAll({
        type: "status",
        message: conn.nickName + " joined to chat."
    });
}else if(dataObject.type == "message"){
    sendToAll({
        type: "message",
        name: conn.nickName,
        message: dataObject.message
    });
}

});

conn.on("close", function(){

    if(conn.nickName) {
        sendToAll({
            type: "status",
            message: conn.nickName + " left chat"
        });
    }
});

conn.on("error", function(e) {

    console.log("you are disconnected!");
});

}).listen(8000, "localhost", function(){
    console.log("server is Active!");
});

function sendToAll(data) {

    let msg = JSON.stringify(data);

    server.connections.forEach(function(conn){
        conn.sendText(msg);
    });
}