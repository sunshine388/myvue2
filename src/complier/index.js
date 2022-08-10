import { parserHTML } from "./parser";

// ast语法树，是用对象来描述原生语法的  虚拟dom，用对象描述dom节点
export function complieToFuction(template) {
  // 1，将模板变成 AST 语法树
  let ast = parserHTML(template);
  // 2，使用 AST 生成 render 函数
  let code = generate(ast);
}

// 根据ast 语法树生成为 render 函数；
function generate(ast) {
  console.log("parserHTML-ast: " , ast);
}
