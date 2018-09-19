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

export function parseFormConfig(source) {
  const sections = [];
  for (let section of source) {
    const id = section.id;
    const name = section.name;
    const groups = [];

    for (let groupItem of section.groups) {
      const parts = groupItem.split("&").map(item => item.trim());
      const groupPart = parts[0];
      const groupTags = groupPart.split(".").map(item => item.trim());
      const id = groupTags[0];
      const justify = groupTags[1];
      const colNum = parseInt(groupTags[2]);

      const fieldsPart = parts[1];
      const fieldNames = fieldsPart.split(".").map(item => item.trim());
      const fields = [];
      for (let item of fieldNames) {
        if (item === "|") {
          fields.push("br");
        } else {
          fields.push({ id: item });
        }
      }

      groups.push({
        id,
        antRowProps: {
          type: "flex",
          justify
        },
        colNum,
        fields
      });
    }

    sections.push({
      id,
      name,
      groups
    });
  }

  const target = {
    antFormProps: {
      layout: "inline"
    },
    sections
  };

  return target;
}

export function parseFieldsConfig(source) {
  const target = {};

  for (const item of source) {
    const parts = item.split("&");
    const firstPart = parts[0];
    const optionalPart = parts[1];

    const firstTags = firstPart.split(".").map(item => item.trim());
    let id, type, label, wrapperCol, buttonType, child, autosize;
    const rules = [];

    id = firstTags[0];
    type = firstTags[1];
    if (type === "Button") {
      child = firstTags[2];
    } else {
      label = firstTags[2];
    }

    if (optionalPart) {
      const optionalTags = optionalPart.split(".").map(item => item.trim());
      for (let i = 0; i < optionalTags.length; i++) {
        const parts = optionalTags[i].split("_");
        const name = parts[0];
        const value = parts[1];

        if (name === "width") {
          wrapperCol = {
            width: parseInt(value)
          };
        } else if (name === "rule") {
          if (value === "*") {
            rules.push({ required: true, message: `请输入${label}` });
          }
        } else if (name === "buttonType") {
          buttonType = value;
        } else if (name === "autosize") {
          autosize = JSON.parse(value);
        }
      }
    }

    target[id] = {
      antFormItemProps: {
        label,
        wrapperCol
      },
      antFieldDecorator: {
        options: {
          rules
        }
      },
      antFieldItem: {
        type,
        props: {
          type: buttonType,
          autosize
        },
        child
      }
    };
  }

  return target;
}

export function parseListConfig(source) {
  const fields = [];
  for (let item of source) {
    const tags = item.split(".").map(item => item.trim());
    const id = tags[0];
    const label = tags[1];
    const span = parseInt(tags[2]);
    fields.push({
      id,
      label,
      props: {
        span
      }
    });
  }

  return { fields };
}

export function submitAll(page) {
  {
    const errs = {};
    const formRecords = {};
    const listRecords = {};

    for (const key in page.forms) {
      page.forms[key].ppForm.props.form.validateFields((err, record) => {
        if (!err) {
          formRecords[key] = record;
        } else {
          errs[key] = err;
        }
      });
    }

    for (const key in page.lists) {
      // 把各个list数组复制出来, 以便后面处理fakeId
      listRecords[key] = [];
      for (const item of page.lists[key].state.data) {
        listRecords[key].push({ ...item });
      }
    }

    if (!isEmptyObject(errs)) {
      console.log(errs);
    } else {
      // todo: 处理formRecords中的空id
      for (const key in formRecords) {
        if (!formRecords[key].id) {
          // todo: 确定新增记录的id是数字0还是字符'0'
          formRecords[key].id = 0;
        }
      }

      // 处理listRecords中的fakeId
      for (const list in listRecords) {
        for (const item of listRecords[list]) {
          const tmpId = "" + item.id;
          if (tmpId.startsWith("fake")) {
            // todo: 确定新增记录的id是数字0还是字符'0'
            item.id = 0;
          }
        }
      }

      return {
        formRecords,
        listRecords
      };
    }
  }
}
