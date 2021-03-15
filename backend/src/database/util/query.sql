SELECT
  receita_id
FROM
  receita_ingrediente
WHERE
  ingrediente_id IN (ids)
GROUP BY
  receita_id
HAVING count(*) = qtdeids;