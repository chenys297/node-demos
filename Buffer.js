const buf1 = Buffer.alloc(10);

// 创建一个长度为10并使用0x1填充的Buffer
const buf2 = new Buffer.alloc(10, 1);

// 创建一个长度为10且未初始化的Buffer
// 此方法比调用alloc更快，但是返回的Buffer实例可能包含旧数据 => 需要使用fill、write或其他能填充Buffer的内容函数进行重写
const buf3 = new Buffer.allocUnsafe(10);

console.log(buf2);