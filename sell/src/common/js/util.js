/* 解析url参数 */
/* ?id=123&a=b */
export function urlParse(){
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg);
  /* ['?id =1234','&a=b'] */
  if(arr){
    arr.forEach((item) =>{
  let tempArr=  item.substring(1).split("=");
  let key = tempArr[0];
  let val = tempArr[1];
  obj[key] = val;
    })
  }
  return obj;
}