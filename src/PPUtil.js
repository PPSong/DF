export const apiBaseUrl = "http://www.baidu.com/";

/**
 * 传入身份证号码和num.获取出生日期,性别跟年龄
 * @param UUserCard 身份证号码
 * @param num 1获取出生日期
 *            2 获取性别
 *            3 获取年龄,年龄小于1岁的时候默认为1岁
 * @returns {*}
 * @constructor
 */
export function IdCard(UUserCard, num) {
  if (num == 1) {
    //获取出生日期
    const birth =
      UUserCard.substring(6, 10) +
      "-" +
      UUserCard.substring(10, 12) +
      "-" +
      UUserCard.substring(12, 14);
    return birth;
  }
  if (num == 2) {
    //获取性别
    if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
      //男
      return "男";
    } else {
      //女
      return "女";
    }
  }
  if (num == 3) {
    //获取年龄
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
    if (
      UUserCard.substring(10, 12) < month ||
      (UUserCard.substring(10, 12) == month &&
        UUserCard.substring(12, 14) <= day)
    ) {
      age++;
    }
    if (age <= 0) {
      age = 1;
    }
    return age;
  }
}

//sample: deepGet(rels, ["Viola", "Harry", "Sally"], {});
export function deepGet(obj, props, defaultValue) {
  // If we have reached an undefined/null property
  // then stop executing and return the default value.
  // If no default was provided it will be undefined.
  if (obj === undefined || obj === null) {
    return defaultValue;
  }

  // If the path array has no more elements, we've reached
  // the intended property and return its value
  if (props.length === 0) {
    return obj;
  }

  // Prepare our found property and path array for recursion
  var foundSoFar = obj[props[0]];
  var remainingProps = props.slice(1);

  return deepGet(foundSoFar, remainingProps, defaultValue);
}

export function isEmptyObject(obj) {
  return !obj || Object.keys(obj).length === 0;
}
