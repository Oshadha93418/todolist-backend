var http = require('http');
var url=require('url');
var mysql=require('mysql');
var qs = require('querystring');

var con = mysql.createConnection({
	host: "localhost",
   	user: "siosolutions",
   	password: "F,6KO8t4ky",
   	database: " siosolutions_todolist"
});


http.createServer(function (req, res) {
	
	
    res.writeHead(200, {'Content-Type': 'text/html'});
	var q=url.parse(req.url,true);
	var path=q.pathname;
	var result="Not a valid url";
	switch(path){
		case"/task/add":
		task_add(req,res);break;

		case"/task/list":
		task_list(req,res);break;
		case"/comptask/list":
		comp_task_list(req,res);break;
		case"/changeState/task":
		complete_task(req,res);break;
		case"/delete/task":
		delete_task(req,res);break;
		case"/search/uncomptask":
		search_uncomptask(req,res);break;
		case"/search/comptask":
		search_comptask(req,res);break;
	}
   
}).listen(8080);

//take to do list data 
function task_list(req,res){
	
	con.query("SELECT * FROM todo_list WHERE is_Complete='0' ", function (err, result, fields) {
	if (err) throw err;
	res.end( JSON.stringify(result));
	});
}

function comp_task_list(req,res){

	con.query("SELECT * FROM todo_list WHERE is_Complete='1' ", function (err, result, fields) {
	if (err) throw err;
	res.end( JSON.stringify(result));
	});
}


function task_add(req,res){
	var q = url.parse(req.url,true);
	var qdata = q.query;
	con.query("INSERT INTO todo_list (tododetails,is_Complete,created_Ddate) VALUES ('"+qdata.task+"','0',NOW())", function (err, result, fields) {
	if (err) throw err;
			res.end( JSON.stringify(result));
			console.log("1 record inserted");
	});
}

function complete_task(req,res){
	var q = url.parse(req.url,true);
	var qdata = q.query;
	var where = " ";
	if(qdata.listId){
		where += " list_id = '"+qdata.listId+"' ";
	}
	con.query("UPDATE todo_list SET is_Complete ='1' WHERE "+where, function (err, result, fields) {
	if (err) throw err;
			res.end( JSON.stringify(result));
			
	});
	console.log("1 record updated");
}

function delete_task(req,res){
	var q = url.parse(req.url,true);
	var qdata = q.query;
	var where = " ";
	if(qdata.listId){
		where += " WHERE list_id = '"+qdata.listId+"' ";
	}
	con.query("DELETE FROM todo_list"+where, function (err, result, fields) {
	if (err) throw err;
			res.end( JSON.stringify(result));
			console.log("deleted");
	});
}

function search_uncomptask(req,res){
	var q = url.parse(req.url,true);
	var qdata = q.query;
	var where = " ";
	if(qdata.key){
		where += "  AND tododetails LIKE '%"+qdata.key+"%' ";
	}
	con.query("SELECT * FROM todo_list WHERE is_Complete ='0'"+where, function (err, result, fields) {
	if (err) throw err;
			res.end( JSON.stringify(result));
	});

}


function search_comptask(req,res){
	var q = url.parse(req.url,true);
	var qdata = q.query;
	var where = " ";
	if(qdata.key){
		where += " AND tododetails LIKE '%"+qdata.key+"%' ";
	}
	con.query("SELECT * FROM todo_list  WHERE is_Complete ='1'"+where, function (err, result, fields) {
	if (err) throw err;
			res.end( JSON.stringify(result));
	});

}