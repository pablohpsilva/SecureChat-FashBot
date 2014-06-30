var BOSH_SERVICE = 'http://localhost:5280/http-bind';
var connection = null;
var admin_jabber_id = 'admin@localhost';
var password = 'admin';


function connect(user)
{
	var userName = user;
	connection = new Strophe.Connection(BOSH_SERVICE);
	//connection.connect(admin_jabber_id, password, onConnect);
	var callback = function (status) {
    if (status === Strophe.Status.REGISTER) {
        // fill out the fields
        connection.register.fields.username = userName;
        connection.register.fields.password = "password";
        // calling submit will continue the registration process
        connection.register.submit();
    } else if (status === Strophe.Status.REGISTERED) {
        console.log("registered!");
        // calling login will authenticate the registered JID.
        connection.authenticate();
    } else if (status === Strophe.Status.CONFLICT) {
        console.log("Contact already existed!");
    } else if (status === Strophe.Status.NOTACCEPTABLE) {
        console.log("Registration form not properly filled out.")
    } else if (status === Strophe.Status.REGIFAIL) {
        console.log("The Server does not support In-Band Registration")
    } else if (status === Strophe.Status.CONNECTED) {
        // do something after successful authentication
    } else {
        // Do other stuff
    }
};

    connection.register.connect("localhost", callback, 60, 1);
}

function conn()
{
	connection = new Strophe.Connection(BOSH_SERVICE);
	//connection.connect(admin_jabber_id, password, onConnect);
  /*
  	<iq type='get' id='reg1' to='shakespeare.lit'>
  			<query xmlns='jabber:iq:register'/>
	</iq>
    */
	var iq = $iq( { id: "babatunde", to: "localhost", type:"set" })
       .c("query", { xmlns:"jabber:iq:register"})
       .tree();

    var request = $iq({ from:'admin@localhost', id:'babatunde', to:'localhost', type:'set'})
    				.c("command", {xmlns:'http://jabber.org/protocol/commands', action:'execute', node:'http://jabber.org/protocol/admin#add-user'})
    				.tree();
	connection.send(request); 
}

function disconnect()
{
	connection.disconnect();
}

function onConnect(status)
{
     if (status == Strophe.Status.CONNECTING) {
	showMessage('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
	showMessage('Strophe failed to connect.');
	//$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.DISCONNECTING) {
	showMessage('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
	showMessage('Strophe is disconnected.');
	//$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.CONNECTED) {
	showMessage('Strophe is connected.');
	connection.addHandler(onMessage, null, 'message', null, null,  null); 
	connection.send($pres().tree());
    }

}

function createUser(user){
	var userName = user;	
	connection.register.connect("localhost", onConnect, wait, hold);
}

function showMessage(msg){
	document.getElementById('myAnchor').innerHTML = msg;
}

function onMessage(msg)
{
	var elems = msg.getElementsByTagName('body');

    if (type == "chat" && elems.length > 0) {
		var body = elems[0];
		showMessage("This is a message from the sever: " + Strophe.getText(body));
	}
}
