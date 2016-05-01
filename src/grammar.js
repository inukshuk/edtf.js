// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }


  function zero() { return 0; }

  function num(data) { return Number(data.join('')) }

  function pick(...args) {
    return function (data) { return args.map(i => data[i]) }
  }


var grammar = {
    ParserRules: [
    {"name": "edtf", "symbols": ["L0"], "postprocess": id},
    {"name": "L0", "symbols": ["year"], "postprocess": data => ({ values: data })},
    {"name": "L0", "symbols": ["year_month"], "postprocess": data => ({ values: data[0] })},
    {"name": "year", "symbols": ["positive_year"], "postprocess": id},
    {"name": "year", "symbols": ["negative_year"], "postprocess": id},
    {"name": "year$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}, {"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "year", "symbols": ["year$string$1"], "postprocess": zero},
    {"name": "positive_year", "symbols": ["positive_digit", "digit", "digit", "digit"], "postprocess": num},
    {"name": "positive_year", "symbols": [{"literal":"0"}, "positive_digit", "digit", "digit"], "postprocess": data => num(data.slice(1))},
    {"name": "positive_year$string$1", "symbols": [{"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "positive_year", "symbols": ["positive_year$string$1", "positive_digit", "digit"], "postprocess": data => num(data.slice(1))},
    {"name": "positive_year$string$2", "symbols": [{"literal":"0"}, {"literal":"0"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "positive_year", "symbols": ["positive_year$string$2", "positive_digit"], "postprocess": data => num(data.slice(1))},
    {"name": "negative_year", "symbols": [{"literal":"-"}, "positive_year"], "postprocess": function (d) { return -d[1] }},
    {"name": "year_month", "symbols": ["year", {"literal":"-"}, "month"], "postprocess": pick(0, 2)},
    {"name": "month", "symbols": ["d01_12"], "postprocess": id},
    {"name": "d01_12", "symbols": [{"literal":"0"}, "positive_digit"], "postprocess": data => num(data.slice(1))},
    {"name": "d01_12$string$1", "symbols": [{"literal":"1"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d01_12", "symbols": ["d01_12$string$1"], "postprocess": num},
    {"name": "d01_12$string$2", "symbols": [{"literal":"1"}, {"literal":"1"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d01_12", "symbols": ["d01_12$string$2"], "postprocess": num},
    {"name": "d01_12$string$3", "symbols": [{"literal":"1"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "d01_12", "symbols": ["d01_12$string$3"], "postprocess": num},
    {"name": "digit", "symbols": ["positive_digit"], "postprocess": id},
    {"name": "digit", "symbols": [{"literal":"0"}], "postprocess": id},
    {"name": "positive_digit", "symbols": [/[1-9]/]}
]
  , ParserStart: "edtf"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
