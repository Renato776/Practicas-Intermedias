cat ReporteGeneral.csv | awk -F',' \
	'{if($25<=2){jk++;print $1,$2,"Total: "$25}else{ren++}}END{print "Deserciones totales:",jk,"Total estudiantes:",ren}'
# The NF variable holds the amount of horizontal fields, NR the amount of lines.
