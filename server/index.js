var fs = require("fs"),
    host = "127.0.0.1",
    port = 5252,
    neo4jUrl = "http://localhost:7474/db/data",
    express = require("express"),
    request = require('request'),
    app = express();

app.use(app.router);
app.use(express.static(__dirname + "/public"));

var query = {
  uniqueness: "node_global",
  order: "depth_first",
  max_depth: 1
};

// Waag Society: 1339353
app.get("/api/:id", function(req, res) {
  res.set('Content-Type', 'application/json');   
  
  request({uri: neo4jUrl + '/index/node/persons/id/' + req.params.id}, function (error, response, body) {
    if (body.length) {      
      var node = JSON.parse(body)[0];      
      var id = node.self.match(/(\d+)$/g)[0];
      var traverseNodes = {
        uri: neo4jUrl + '/node/' + id + '/traverse/node',
        method: 'POST',
        json: query
      };
            
      var traverseRelations = {
        uri: neo4jUrl + '/node/' + id + '/traverse/relationship',
        method: 'POST',
        json: query
      }; 
      
      var nodes = {};
      nodes[id] = {
        id: node.data.id,
        name: node.data.name        
      }
      
      request(traverseNodes, function (error, response, nodesBody) {
        request(traverseRelations, function (error, response, relationshipsBody) {          
          nodesBody.forEach(function(node) {
            var id = node.self.match(/(\d+)$/g)[0];
            nodes[id] = {
              name: node.data.name,
              id: node.data.id
            };              
          });
          
          var links = [];
          relationshipsBody.forEach(function(relationship) {
            var start = relationship.start.match(/(\d+)$/g)[0];
            var end = relationship.end.match(/(\d+)$/g)[0];            
            var link = {
              source: parseInt(start),
              target: parseInt(end),
              type: relationship.type
            };
            links.push(link);
          });
                  
          res.send({nodes: nodes, links: links});
        });        
      });
    }
  });    
});

app.listen(port, host);