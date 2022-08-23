function addSqlCondition(params, newParam, sqlQuery) {
  if (params.length === 1) {
    condition = ` WHERE ${newParam} = $1`;
  } else {
    condition = ` AND ${newParam} = $${params.length}`;
  }

  return condition;
}

module.exports = { addSqlCondition };
