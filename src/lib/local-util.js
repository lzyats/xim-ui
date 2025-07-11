/*
 * 保存
 */
export const localSave = (key, value) => {
  localStorage.setItem(key, value);
};

/*
 * 读取
 */
export const localRead = (key) => {
  return localStorage.getItem(key) || '';
};

/*
 * 清空
 */
export const localClear = () => {
  localStorage.clear();
};