var db;
var dbCreated = false;

onPageStart();

function onPageStart(){
    db = window.openDatabase("CountData","1.0","CountDATABASE",200000);
    if(!dbCreated){
       db.transaction(populateDB,transaction_error1,transactionDB_success);
}
 db.transaction(getlistitem);
}
function populateDB(tx){

tx.executeSql("DROP TABLE IF EXISTS ITEMS");
    var sql = "CREATE TABLE IF NOT EXISTS ITEMS("
        + "ITEMS_ID INT PRIMARY KEY, "
        + "TITLE VARCHAR(64), "
        + "CONTENT TEXT, "
		+ "SOLUONG INT)";
    tx.executeSql(sql);

    tx.executeSql("INSERT INTO ITEMS VALUES(1,'LEGO','Đồ chơi dành cho con nít',1)");
    tx.executeSql("INSERT INTO ITEMS VALUES(2,'Iphone4','Điện thoại SmarkPhone iphone4',2)");
	tx.executeSql("INSERT INTO ITEMS VALUES(3,'Bphone','điện thoại smarkPhone Bphone',100)");
}

function transaction_error1(tx,error){
 alert("loi");
}

function transactionDB_success(){
    dbCreated = true;
    alert("Create Table success");
}


function newitem(){
        var stritemid = document.getElementById("xid").value;
	    
        var stritemtitle = document.getElementById("xtitle").value;
	
        var stritemcontent = document.getElementById("xinfo").value;
		
		var stritemsl = count;
		
		
        db.transaction(function(tx){insertItem(tx,stritemid,stritemtitle,stritemcontent,stritemsl)},transaction_error1,query_success1);
	    
        }
    

    function insertItem(tx,id,Tl,info,sl){
        var sql = "INSERT INTO ITEMS VALUES('"+id+"','"+Tl+"','"+info+"',"+sl+")";
		
        tx.executeSql(sql);
		
    }
	
//end //

//phương thức khi thành công//
function query_success1(){
        alert("Success");
        window.location = "index.html#List";
		db.transaction(getlistitem);
    }
//end//

function getlistitem(tx){
        var strSearch = document.getElementById("xsearch").value;
        var valSearch = "Select * from ITEMS";       
		if(strSearch != ""){
            valSearch += " where Title like '%" + strSearch + "%'";
			
        }
        tx.executeSql(valSearch,[],query_getlistnews_success,transaction_error1);
    }
//hàm show lên listview //
function query_getlistnews_success(tx,result){
        $("#listview1").empty();
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            $('#listview1').append('<li><a href="javascript:getItem('+row['ITEMS_ID']+');">'+row["ITEMS_ID"]+'-<br>'+row["TITLE"]+''+row["SOLUONG"]+'</li>');
        }
        $("#listview1").listview("refresh");
    }
//end//
 function getItem(id){
        db.transaction(function(tx){getItemById2(tx,id)},transaction_error1);
    }

    function getItemById2(tx,id){
        var strQuery = "Select * from ITEMS where ITEMS_ID = "+id;
        tx.executeSql(strQuery,[],query_getItemById_success,transaction_error1);
        window.location.replace("index.html#info");
    }
	function query_getItemById_success(tx,result){
      
        var row = result.rows.item(0);
		
       
        document.getElementById("yid").value = row['ITEMS_ID'];
		 document.getElementById("ytitle").value = row['TITLE'];
		  document.getElementById("yinfo").value = row['CONTENT'];
		  document.getElementById("xsl").value = row['SOLUONG'];
  
    }
	//hàm update//
	function updateitem(){
        var strItemId = document.getElementById("yid").value;
        var strNEWSTitle = document.getElementById("ytitle").value;
        var strNEWSContent = document.getElementById("yinfo").value;
		var strsl = document.getElementById("xsl").value;
        
        
         if(strNEWSTitle == ""){
            alert("Title can not be blank.Please try again.");
        }
        else if(strNEWSContent == ""){
            alert("Content can not be blank.Please try again.");
        }
		else if(strsl == ""){
            alert("Số lượng can not be blank.Please try again.");
        }
       
        else{
            db.transaction(function(tx){updateItem(tx,strItemId,strNEWSTitle,strNEWSContent,strsl)},transaction_error1,query_success1);
        }
    }
	
	function updateItem(tx,id,title,content,sl){
        var sql = "UPDATE ITEMS SET TITLE='"+title+"', CONTENT='"+content+"',SOLUONG="+sl+" WHERE ITEMS_ID = "+id;
        tx.executeSql(sql);
    }
//end//
//hàm delete//
function deleteitem(){
        var r = confirm("You sure you want to delete information?");
        if(r){
            db.transaction(deleteITEM,transaction_error1,query_success1);
        }
    }

    function deleteITEM(tx){
        var strNEWSId = document.getElementById("yid").value;
        tx.executeSql("Delete from ITEMS where ITEMS_ID="+strNEWSId);
    }
//end//
//hàm reset số lượng//

function resetItem(){
        var x = confirm("You sure you want to Reset information?");
        if(x){
            db.transaction(resetitem,transaction_error1,query_success1);
        }
    }
function resetitem(tx){
      var strNEWSId = document.getElementById("yid").value;
	  var sql = "UPDATE ITEMS SET SOLUONG = 0 WHERE ITEMS_ID="+strNEWSId;
       tx.executeSql(sql);
db.transaction(getlistitem);
};
//end//

//hàm search //
function  searchitem(){
        db.transaction(getlistitem,transaction_error1);
    }
//end//
  