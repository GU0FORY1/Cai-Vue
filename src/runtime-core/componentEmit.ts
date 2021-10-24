//event为用户传入 ...args 为附加参数
//把event转换为onEvent 在props中寻找

import { capitalize } from "../shared";

//偷个懒 这里只处理了add->onAdd 没有处理add-foo->onAddFoo
export const emit = (instance, event, ...args) => {
  const { props } = instance;

  const handler = props["on" + capitalize(event)];
  handler && handler(...args);
};
