const http = require('http'),
      __url = require('url'),
      fs = require('fs');
var temp = [];
var access = new Object;

settingAccess(access);
http.createServer(function(req, res){
  var source;
  var url = __url.parse(req.url, true);
  // res.setHeader('Content-Type: text/html; charset=utf-8');
  res.setHeader('Access-File', '/.access');

  if(url.pathname.split("/").pop()==''){
    url.pathname+='index.html';
  }
  url.pathname = decodeURI(url.pathname);

  console.log(req.method, url.pathname);

  if(access[url.pathname]!=undefined){
    if(access[url.pathname].status==="disable"){
      return res.end(`403 Forbidden`);
    }else{
      return res.end(access[url.pathname].message);
    }
  }
  
  fs.readFile(__dirname+url.pathname, function(error, buffer){
    if(error)
      return fs.readFile(__dirname+(url.pathname)+'/index.html', function(err, buf){
        if(err)res.end("404 Not Found");
        res.end(buf);
      });
    res.end(buffer);
  });

}).listen(80, function(){
  console.log("Server listen on 80 port");
});


function settingAccess(v){
  if(!v)throw console.log("請輸入變數");
  var accessFile = fs.readFileSync('.access', 'utf8').split(/\r\n|\n/i);
  accessFile.map(a => {
    a = a.split(' ');
    v[a[1]] = new Object();
    v[a[1]].status = a[0];
    if(a[2]!=undefined)
      fs.readFile(__dirname+a[2], function(err, buf){
        v[a[1]].message = buf;
      });
  });
}