# tree-sitter-taskr
This is the tree-sitter parser for [taskr](https://github.com/arne-vl/taskr). Currently only provides highlighting.

## Manual configuration
1. Put this snippet in your nvim-treesiter configuration.
```lua
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.taskr = {
    install_info = {
        url = "https://github.com/arne-vl/tree-sitter-taskr",
        files = { "src/parser.c" },
        branch = "main",
        generate_requires_npm = true,
        requires_generate_from_grammar = true,
    },
    filetype = "taskrfile",
}
```

2. Restart `nvim` and install the parser using `:TSInstall taskr`
3. Copy the contents of `queries/taskr/highlights.scm` into `~/.config/nvim/queries/taskr/highlights.scm`
4. Restart `nvim`.
