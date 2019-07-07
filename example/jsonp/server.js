const http = require('http');
const urllib = require('url');
const port = 8080;
const data = {'data': 'world'};
http.createServer(function(req, res) {
  const params = urllib.parse(req.url, true);
  if(params.query.callback){
    console.log(params.query.callback);
    const str = params.query.callback + '(' + JSON.stringify(data) + ')';
    res.end(str);
  } else {
    res.end();
  }
}).listen(port,function(){
  console.log('basic server is on');
});
