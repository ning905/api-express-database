function buildWhereClause(baseSql, queries) {
  if (queries.length) {
    baseSql += " WHERE ";
  }

  const mappedQueries = queries.map((q, i) => `${q} = $${i + 1}`);
  const clause = mappedQueries.join(" AND ");

  return baseSql + clause;
}

function buildUpdateClause(tableName, columnsToUpdate) {
  const mappedColumns = columnsToUpdate.map((col, i) => `${col} = $${i + 1}`);
  const sqlQuery = `UPDATE ${tableName} SET ${mappedColumns.join(" , ")}`;

  console.log(sqlQuery);
  return sqlQuery;
}

module.exports = { buildWhereClause, buildUpdateClause };
