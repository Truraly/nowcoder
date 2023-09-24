


## commit & issue message规范

提交commit和issue时，提交信息应该遵循格式：`emoji type: message`

`emjoi type` 为提交类型，`message`为提交信息

### 初始化（init） 
创建项目时
```
🎉 init: 创建项目
```
### 新功能（feature）

设计功能代码的更新
```
✨ feat: 添加了xxx功能
```
### 修补bug（fix）
修改代码bug
```
🐛 fix: 修复了xxx bug
```
### 添加文档
向仓库中添加文档
```
📚 add: 添加了xxx文档
```
### 勘误
勘误文档错误
```
👈 corrig: 修正了xxx文档错误
```
### 修改文档
修改文档
```
📖 modify: 修改了xxx文档
```
### 性能优化
优化代码
```
🔥 perf: 优化了xxx代码
```


### 格式
整理格式，不涉及功能以及意义上的改动
```
🎨 style: 整理了xxx格式
```
### 重构
仓库结构改动/功能重构
```
🔨 refactor: 重构了xxx功能
```
### 回滚
回滚到上一个版本
```
⏪ revert: 回滚到上一个版本
```
### 测试
```
🚨 test: 测试
```
### 构建过程或辅助工具的变动
```
🔧 chore: 构建过程或辅助工具的变动
```
### 持续集成的配置文件和脚本的变动
```
🔩 ci: 持续集成的配置文件和脚本的变动
```
### 其他
其他
```
🚩 other: 其他
```

<!-- <script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
console.log(frontmatter)

</script> -->