; https://neovim.io/doc/user/treesitter.html#_treesitter-syntax-highlighting
; Place this file in `~/.config/nvim/queries/taskr/`

"," @punctuation.delimiter
":" @keyword.conditional.ternary

(kw_default_env) @keyword
(kw_env) @keyword
(file_key) @property
(filename) @string.special.path

(kw_task) @keyword
(run_key) @property
(desc_key) @property
(alias_key) @property
(needs_key) @property

(text) @string
(command) @function
(identifier) @variable
(comment) @comment
