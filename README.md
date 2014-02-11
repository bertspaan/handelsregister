Install Neo4j:

```sh
brew install neo4j
```

Download Neo4j [`batch-import`](https://github.com/jexp/batch-import/tree/20) into `batch-import` directory:

Create CSV files from `handelsregister.nt`:

```sh
ruby create_csv.rb
```

Remove old Neo4j database:

```sh
rm -r /usr/local/Cellar/neo4j/2.0.0/libexec/data/graph.db
```

Import CSV files into new Neo4j database:

```sh
cd batch-import
./import.sh /usr/local/Cellar/neo4j/2.0.0/libexec/data/graph.db ../data/nodes.csv ../data/rels.csv
```
