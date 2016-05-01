// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }


  function num(data) { return Number(data.join('')) }

  function pick(...args) {
    return args.length === 1 ?
      data => data[args[0]] :
      data => args.reduce((a, i) => a.concat(data[i]), [])
  }


var grammar = {
    ParserRules: [
    {"name": "edtf", "symbols": ["L0"], "postprocess": id},
    {"name": "L0", "symbols": ["year"], "postprocess": data => ({ values: data })},
    {"name": "L0", "symbols": ["year_month"], "postprocess": data => ({ values: data[0] })},
    {"name": "L0", "symbols": ["year_month_day"], "postprocess": data => ({ values: data[0] })},
    {"name": "year", "symbols": ["positive_year"], "postprocess": id},
    {"name": "year", "symbols": ["negative_year"], "postprocess": id},
    {"name": "year$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}, {"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "year", "symbols": ["year$string$1"], "postprocess": () => 0},
    {"name": "positive_year", "symbols": ["positive_digit", "digit", "digit", "digit"], "postprocess": num},
    {"name": "positive_year", "symbols": [{"literal":"0"}, "positive_digit", "digit", "digit"], "postprocess": data => num(data.slice(1))},
    {"name": "positive_year$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "positive_year", "symbols": ["positive_year$string$1", "positive_digit", "digit"], "postprocess": data => num(data.slice(1))},
    {"name": "positive_year$string$2", "symbols": [{"literal":"0"}, {"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "positive_year", "symbols": ["positive_year$string$2", "positive_digit"], "postprocess": pick(1)},
    {"name": "negative_year", "symbols": [{"literal":"-"}, "positive_year"], "postprocess": data => -data[1]},
    {"name": "year_month", "symbols": ["year", {"literal":"-"}, "month"], "postprocess": pick(0, 2)},
    {"name": "month", "symbols": ["d01_12"], "postprocess": data => data[0] - 1},
    {"name": "year_month_day", "symbols": ["year", {"literal":"-"}, "month_day"], "postprocess": pick(0, 2)},
    {"name": "month_day", "symbols": ["m31", {"literal":"-"}, "day"], "postprocess": pick(0, 2)},
    {"name": "month_day", "symbols": ["m30", {"literal":"-"}, "d01_30"], "postprocess": pick(0, 2)},
    {"name": "month_day$string$1", "symbols": [{"literal":"0"}, {"literal":"2"}, {"literal":"-"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "month_day", "symbols": ["month_day$string$1", "d01_29"], "postprocess": data => [1, data[1]]},
    {"name": "day", "symbols": ["d01_31"], "postprocess": id},
    {"name": "digit", "symbols": ["positive_digit"], "postprocess": id},
    {"name": "digit", "symbols": [{"literal":"0"}], "postprocess": num},
    {"name": "positive_digit", "symbols": [/[1-9]/], "postprocess": num},
    {"name": "m31$subexpression$1$string$1", "symbols": [{"literal":"0"}, {"literal":"1"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$1"]},
    {"name": "m31$subexpression$1$string$2", "symbols": [{"literal":"0"}, {"literal":"3"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$2"]},
    {"name": "m31$subexpression$1$string$3", "symbols": [{"literal":"0"}, {"literal":"5"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$3"]},
    {"name": "m31$subexpression$1$string$4", "symbols": [{"literal":"0"}, {"literal":"7"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$4"]},
    {"name": "m31$subexpression$1$string$5", "symbols": [{"literal":"0"}, {"literal":"8"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$5"]},
    {"name": "m31$subexpression$1$string$6", "symbols": [{"literal":"1"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$6"]},
    {"name": "m31$subexpression$1$string$7", "symbols": [{"literal":"1"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m31$subexpression$1", "symbols": ["m31$subexpression$1$string$7"]},
    {"name": "m31", "symbols": ["m31$subexpression$1"], "postprocess": data => num(data) - 1},
    {"name": "m30$subexpression$1$string$1", "symbols": [{"literal":"0"}, {"literal":"4"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m30$subexpression$1", "symbols": ["m30$subexpression$1$string$1"]},
    {"name": "m30$subexpression$1$string$2", "symbols": [{"literal":"0"}, {"literal":"6"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m30$subexpression$1", "symbols": ["m30$subexpression$1$string$2"]},
    {"name": "m30$subexpression$1$string$3", "symbols": [{"literal":"0"}, {"literal":"9"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m30$subexpression$1", "symbols": ["m30$subexpression$1$string$3"]},
    {"name": "m30$subexpression$1$string$4", "symbols": [{"literal":"1"}, {"literal":"1"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "m30$subexpression$1", "symbols": ["m30$subexpression$1$string$4"]},
    {"name": "m30", "symbols": ["m30$subexpression$1"], "postprocess": data => num(data) - 1},
    {"name": "d01_12", "symbols": [{"literal":"0"}, "positive_digit"], "postprocess": pick(1)},
    {"name": "d01_12", "symbols": [{"literal":"1"}, /[0-2]/], "postprocess": num},
    {"name": "d01_29", "symbols": [{"literal":"0"}, "positive_digit"], "postprocess": pick(1)},
    {"name": "d01_29", "symbols": [/[1-2]/, "digit"], "postprocess": num},
    {"name": "d01_30", "symbols": ["d01_29"], "postprocess": id},
    {"name": "d01_30$string$1", "symbols": [{"literal":"3"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d01_30", "symbols": ["d01_30$string$1"], "postprocess": num},
    {"name": "d01_31", "symbols": ["d01_30"], "postprocess": id},
    {"name": "d01_31$string$1", "symbols": [{"literal":"3"}, {"literal":"1"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d01_31", "symbols": ["d01_31$string$1"], "postprocess": num}
]
  , ParserStart: "edtf"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
