/**
 * shapeFlags 实现
 * 巧妙的通过位运算实现标识的查找和赋值
 * eg：
 * element 0001
 * component 0010
 * text_children 0100
 * array_children 1000
 *
 * 查找时用 &
 * element & element > 0001    v
 * component & element > 0000  x
 *
 * 赋值使用 |
 * shape = 0001 //标识为elemnt
 * shape = shape | text_children  shape 0101 //标识即为element又是textchildren
 *
 *
 * 这种实现可读性不如直接用对象实现 但是性能很高
 */
export enum ShapeFlags {
  ELEMENT = 1, //0001
  STATEFUL_COMPONENT = 1 << 1, //左位移一位 0010
  TEXT_CHILDREN = 1 << 2, //0100
  ARRAY_CHILDREN = 1 << 3, // 1000
}
