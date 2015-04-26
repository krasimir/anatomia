/*
  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
module.exports = function() {

  Syntax = {
      AssignmentExpression: 'AssignmentExpression',
      AssignmentPattern: 'AssignmentPattern',
      ArrayExpression: 'ArrayExpression',
      ArrayPattern: 'ArrayPattern',
      ArrowFunctionExpression: 'ArrowFunctionExpression',
      AwaitExpression: 'AwaitExpression', // CAUTION: It's deferred to ES7.
      BlockStatement: 'BlockStatement',
      BinaryExpression: 'BinaryExpression',
      BreakStatement: 'BreakStatement',
      CallExpression: 'CallExpression',
      CatchClause: 'CatchClause',
      ClassBody: 'ClassBody',
      ClassDeclaration: 'ClassDeclaration',
      ClassExpression: 'ClassExpression',
      ComprehensionBlock: 'ComprehensionBlock',  // CAUTION: It's deferred to ES7.
      ComprehensionExpression: 'ComprehensionExpression',  // CAUTION: It's deferred to ES7.
      ConditionalExpression: 'ConditionalExpression',
      ContinueStatement: 'ContinueStatement',
      DebuggerStatement: 'DebuggerStatement',
      DirectiveStatement: 'DirectiveStatement',
      DoWhileStatement: 'DoWhileStatement',
      EmptyStatement: 'EmptyStatement',
      ExportAllDeclaration: 'ExportAllDeclaration',
      ExportDefaultDeclaration: 'ExportDefaultDeclaration',
      ExportNamedDeclaration: 'ExportNamedDeclaration',
      ExportSpecifier: 'ExportSpecifier',
      ExpressionStatement: 'ExpressionStatement',
      ForStatement: 'ForStatement',
      ForInStatement: 'ForInStatement',
      ForOfStatement: 'ForOfStatement',
      FunctionDeclaration: 'FunctionDeclaration',
      FunctionExpression: 'FunctionExpression',
      GeneratorExpression: 'GeneratorExpression',  // CAUTION: It's deferred to ES7.
      Identifier: 'Identifier',
      IfStatement: 'IfStatement',
      ImportDeclaration: 'ImportDeclaration',
      ImportDefaultSpecifier: 'ImportDefaultSpecifier',
      ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
      ImportSpecifier: 'ImportSpecifier',
      Literal: 'Literal',
      LabeledStatement: 'LabeledStatement',
      LogicalExpression: 'LogicalExpression',
      MemberExpression: 'MemberExpression',
      MethodDefinition: 'MethodDefinition',
      ModuleSpecifier: 'ModuleSpecifier',
      NewExpression: 'NewExpression',
      ObjectExpression: 'ObjectExpression',
      ObjectPattern: 'ObjectPattern',
      Program: 'Program',
      Property: 'Property',
      RestElement: 'RestElement',
      ReturnStatement: 'ReturnStatement',
      SequenceExpression: 'SequenceExpression',
      SpreadElement: 'SpreadElement',
      Super: 'Super',
      SwitchStatement: 'SwitchStatement',
      SwitchCase: 'SwitchCase',
      TaggedTemplateExpression: 'TaggedTemplateExpression',
      TemplateElement: 'TemplateElement',
      TemplateLiteral: 'TemplateLiteral',
      ThisExpression: 'ThisExpression',
      ThrowStatement: 'ThrowStatement',
      TryStatement: 'TryStatement',
      UnaryExpression: 'UnaryExpression',
      UpdateExpression: 'UpdateExpression',
      VariableDeclaration: 'VariableDeclaration',
      VariableDeclarator: 'VariableDeclarator',
      WhileStatement: 'WhileStatement',
      WithStatement: 'WithStatement',
      YieldExpression: 'YieldExpression'
  };

  VisitorKeys = {
      AssignmentExpression: ['left', 'right'],
      AssignmentPattern: ['left', 'right'],
      ArrayExpression: ['elements'],
      ArrayPattern: ['elements'],
      ArrowFunctionExpression: ['params', 'body'],
      AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
      BlockStatement: ['body'],
      BinaryExpression: ['left', 'right'],
      BreakStatement: ['label'],
      CallExpression: ['callee', 'arguments'],
      CatchClause: ['param', 'body'],
      ClassBody: ['body'],
      ClassDeclaration: ['id', 'superClass', 'body'],
      ClassExpression: ['id', 'superClass', 'body'],
      ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
      ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
      ConditionalExpression: ['test', 'consequent', 'alternate'],
      ContinueStatement: ['label'],
      DebuggerStatement: [],
      DirectiveStatement: [],
      DoWhileStatement: ['body', 'test'],
      EmptyStatement: [],
      ExportAllDeclaration: ['source'],
      ExportDefaultDeclaration: ['declaration'],
      ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
      ExportSpecifier: ['exported', 'local'],
      ExpressionStatement: ['expression'],
      ForStatement: ['init', 'test', 'update', 'body'],
      ForInStatement: ['left', 'right', 'body'],
      ForOfStatement: ['left', 'right', 'body'],
      FunctionDeclaration: ['id', 'params', 'body'],
      FunctionExpression: ['id', 'params', 'body'],
      GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
      Identifier: [],
      IfStatement: ['test', 'consequent', 'alternate'],
      ImportDeclaration: ['specifiers', 'source'],
      ImportDefaultSpecifier: ['local'],
      ImportNamespaceSpecifier: ['local'],
      ImportSpecifier: ['imported', 'local'],
      Literal: [],
      LabeledStatement: ['label', 'body'],
      LogicalExpression: ['left', 'right'],
      MemberExpression: ['object', 'property'],
      MethodDefinition: ['key', 'value'],
      ModuleSpecifier: [],
      NewExpression: ['callee', 'arguments'],
      ObjectExpression: ['properties'],
      ObjectPattern: ['properties'],
      Program: ['body'],
      Property: ['key', 'value'],
      RestElement: [ 'argument' ],
      ReturnStatement: ['argument'],
      SequenceExpression: ['expressions'],
      SpreadElement: ['argument'],
      Super: [],
      SwitchStatement: ['discriminant', 'cases'],
      SwitchCase: ['test', 'consequent'],
      TaggedTemplateExpression: ['tag', 'quasi'],
      TemplateElement: [],
      TemplateLiteral: ['quasis', 'expressions'],
      ThisExpression: [],
      ThrowStatement: ['argument'],
      TryStatement: ['block', 'handler', 'finalizer'],
      UnaryExpression: ['argument'],
      UpdateExpression: ['argument'],
      VariableDeclaration: ['declarations'],
      VariableDeclarator: ['id', 'init'],
      WhileStatement: ['test', 'body'],
      WithStatement: ['object', 'body'],
      YieldExpression: ['argument']
  };

  return {
    Syntax: Syntax,
    VisitorKeys: VisitorKeys
  };

};