import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";
import resolve from "@rollup/plugin-node-resolve"; // 引入插件

export default {
  input: "./src/index.js", // 入口文件
  output: {
    format: "umd", // 支持amd 和 commonjs规范
    name: "Vue",
    file: "dist/vue.js", // 输出文件
    sourcemap: true,
  },
  plugins: [
    resolve(), // 使用插件
    babel({
      // 使用babel进行转化，但是排除node_modules文件
      exclude: "node_modules/**", // glob 语法；**表示任意文件
    }),
    // dev环境下在3000端口开启一个服务
    process.env.ENV === "development"
      ? serve({
          open: true,
          openPage: "/public/index.html",
          port: 3000,
          contentBase: "",
        })
      : null,
  ],
};
