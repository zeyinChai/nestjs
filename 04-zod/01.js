let { z } = require("zod");

// 定义模式
const stringSchema = z.string()
const numberSchema = z.number()
// 验证数据

const result1 = stringSchema.parse('hello')
console.log('result1',result1);
const result2 = numberSchema.parse(2)
console.log('result2',result2);
try {
    const result3 = numberSchema.parse('')
    console.log(result3);
} catch (error) {
    console.log('error',error);
}