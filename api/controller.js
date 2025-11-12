'use strict';

exports.calculate = function(req, res) {
  req.app.use(function(err, _req, res, next) {
    if (res.headersSent) {
      return next(err);
    }

    res.status(400);
    res.json({ error: err.message });
  });

  // TODO: Add operator
  var operations = {
    'add':      function(a, b) { return Number(a) + Number(b) },
    'subtract': function(a, b) { return a - b },
    'multiply': function(a, b) { return a * b },
    'divide':   function(a, b) { return a / b },
    'power':    function(a, b) { return Math.pow(a, b) },
    'sqrt':     function(a, b) { return Math.sqrt(a) }
  };

  if (!req.query.operation) {
    throw new Error("Unspecified operation");
  }

  var operation = operations[req.query.operation];

  if (!operation) {
    throw new Error("Invalid operation: " + req.query.operation);
  }

  var rawOperand1 = req.query.operand1;
  var rawOperand2 = req.query.operand2;

  var operand1 = (rawOperand1 === undefined) ? rawOperand1 : String(rawOperand1).trim();
  var operand2 = (rawOperand2 === undefined) ? rawOperand2 : String(rawOperand2).trim();

  if (!operand1 ||
      !operand1.match(/^([+-])?[0-9\.]+(e([+-])?[0-9]+)?$/i) ||
      operand1.replace(/[-0-9e]/ig, '').length > 1) {
    throw new Error("Invalid operand1: " + rawOperand1);
  }

  if (!operand2 ||
      !operand2.match(/^([+-])?[0-9\.]+(e([+-])?[0-9]+)?$/i) ||
      operand2.replace(/[-0-9e]/ig, '').length > 1) {
    throw new Error("Invalid operand2: " + rawOperand2);
  }

  res.json({ result: operation(operand1, operand2) });
};
