require 'json'
require 'csv'

i = 0
ids = {}
CSV.open('data/nodes.csv','wb', col_sep: "\t") do |nodes|    
  # Write headers
  nodes << ["id:int:persons", "name:string:persons"]
  
  File.open("data/handelsregister.nt", "r").each_line do |line|

    m = line.match /^(.*) (.*) \"(.*)\" \./
    if m
      id = m[0][/\d+/].to_i
      name = m[3]      
      name.gsub!(/['"]/, '')      
      #name.gsub!(/\\u([\da-fA-F]{4})/) {|m| [$1].pack("H*").unpack("n*").pack("U*")}   
      
      nodes << [id, name] if not ids.has_key? id
      ids[id] = true
    end
    
    if i % 5000 == 0
      puts i
    end
    i+=1

  end
end

i = 0
CSV.open('rels.csv','wb', col_sep: "\t") do |rels|  
  # Write headers
  rels << ["id:int:persons", "id:int:persons", "type"]
  
  File.open("data/handelsregister.nt", "r").each_line do |line|
    m = line.match /^(.*) (.*) <(.*)> \./
    if m
      id1 = m[1][/\d+/].to_i
      id2 = m[3][/\d+/].to_i
      type = m[2][/#\w+/][1..-1].downcase
      rels << [id1, id2, type] if (ids.has_key? id1) and (ids.has_key? id2)
    end
    
    if i % 5000 == 0
      puts i
    end
    i+=1
  end
end

# rm -r /usr/local/Cellar/neo4j/2.0.0/libexec/data/graph.db
# ./import.sh /usr/local/Cellar/neo4j/2.0.0/libexec/data/graph.db nodes.csv rels.csv