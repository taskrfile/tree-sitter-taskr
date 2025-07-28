/**
 * @file Treesitter parser for taskrfiles
 * @author Arne Van Looveren
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "taskr",

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.env_definition,
      $.task_definition
    ),

    task_definition: $ => seq(
      "task",
      $.identifier,
      ":",
      repeat($.task_attribute)
    ),

    task_attribute: $ => choice(
      $.run,
      $.desc,
      $.alias,
      $.needs
    ),

    run: $ => seq(
      "  ",
      "run",
      "=",
      $.anything
    ),

    desc: $ => seq(
      "  ",
      "desc",
      "=",
      $.anything
    ),

    alias: $ => seq(
      "  ",
      "alias",
      "=",
      $.list
    ),

    needs: $ => seq(
      "  ",
      "needs",
      "=",
      $.list
    ),

    list: $ => seq(
      $.identifier,
      repeat(
        seq(
          ",",
          $.identifier
        )
      )
    ),

    env_definition: $ => choice(
      $.env,
      $.default_env
    ),

    env: $ => seq(
      "env",
      $.identifier,
      ":",
      $.file_definition
    ),

    default_env: $ => seq(
      "default env",
      $.identifier,
      ":",
      $.file_definition
    ),

    file_definition: $ => seq(
      "  ",
      "file",
      "=",
      $.filename
    ),

    identifier: $ => /[a-z]+/,

    filename: $ => /[\.a-z]+/,

    anything: $ => /.+/
  }
});
