//工具方法
class Utils {

  //格式化日期
  formatDate(date, format) {
    //date: 日期对象
    //format: 日期格式(yyyy-MM-dd hh:mm:ss)

    //将年份替换yyyy ==> 2021-MM-dd hh:mm:ss
    let year = date.getFullYear().toString();

    //判断是否存在yyyy
    if (/(y+)/.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      // 

      year = year.slice(4 - content.length);

      format = format.replace(content, year);
    }

    // 

    //替换月日时分秒
    let o = {
      M: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds()
    };

    for (let key in o) {
      //根据key动态生成正则
      let reg = new RegExp(`(${key}+)`);
      // 
      if (reg.test(format)) {
        //获取匹配组的内容
        let c = RegExp.$1;
        // 
        let text = o[key] >= 10 ? o[key] : c.length === 2 ? '0' + o[key] : o[key];
        format = format.replace(c, text);
        // 
      }
    }

    return format;


  }

  //随机生成颜色
  createColor() {
    let rgb = [];
    for (let i = 0; i < 3; i++) {
      //0-255
      let color = Math.ceil(Math.random() * 255);
      rgb.push(color);
    }

    return `rgb(${rgb.join(',')})`;
  }

}
//commonJS规范
//导出: module.exports 或者 exports
//导入: require
module.exports = new Utils();