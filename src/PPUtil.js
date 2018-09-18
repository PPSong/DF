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

function convertFieldsConfig() {
  const a = [
    "mail, Input, 电子邮件: width_300, *",
    "save, Button, 保存: type_primary"
  ];

  for (const itemString of a) {
    const itemObj = {};
    const parts = itemString.split(":");
    const firstPart = parts[0];
    const optionalPart = parts[1];

    const firstTags = firstPart.split(",").map(item => item.trim());
    for (let i = 0; i < 3; i++) {
      const id = firstTags[0];
      const type = firstTags[1];
      const label = firstTags[2];
    }
  }
}

// mock
export function getPageConfigAndData() {
  const f1FieldsConfig = {
    mail: {
      antFormItemProps: {
        label: "电子邮件",
        wrapperCol: {
          width: 300
        }
      },
      antFieldDecorator: {
        options: {
          rules: [{ required: true, message: "Please input your 电子邮件!" }]
        }
      },
      antFieldItem: {
        type: "Input",
        props: {}
      }
    },
    save: {
      antFormItemProps: {
        label: ""
      },
      antFieldDecorator: {
        options: {}
      },
      antFieldItem: {
        type: "Button",
        props: {
          type: "primary"
        },
        child: "保存"
      }
    }
  };

  const f1FormConfig = {
    antFormProps: {
      layout: "inline"
    },
    sections: [
      {
        id: "sec1",
        name: "电子邮件",
        groups: [
          {
            id: "sec1g0",
            antRowProps: {
              type: "flex",
              justify: "start"
            },
            colNum: 2,
            fields: [{ id: "mail" }]
          },
          {
            id: "sec1g1",
            antRowProps: {
              type: "flex",
              justify: "end"
            },
            colNum: 12,
            fields: [{ id: "save" }]
          }
        ]
      }
    ]
  };

  const f1Data = {
    id: 1,
    mail: "1@1.com"
  };

  // l1 config
  const l1ListConfig = {
    fields: [
      {
        id: "f1",
        label: "子类型",
        props: {
          span: 2
        }
      },
      {
        id: "f2",
        label: "开始日期",
        props: {
          span: 2
        }
      },
      {
        id: "f3",
        label: "结束日期",
        props: {
          span: 2
        }
      },
      {
        id: "f4",
        label: "内容",
        props: {
          span: 16
        }
      },
      {
        id: "f5",
        label: "操作",
        props: {
          span: 2
        }
      }
    ]
  };

  const l1Data = [
    {
      id: "1",
      f1: "v11",
      f2: "v12",
      f3: "v13",
      f4: "v14"
    },
    {
      id: "2",
      f1: "v21",
      f2: "v22",
      f3: "v23",
      f4: "v24"
    }
  ];

  return {
    formsConfig: {
      f1: {
        fieldsConfig: f1FieldsConfig,
        formConfig: f1FormConfig,
        data: f1Data
      }
    },
    listsConfig: {
      l1: {
        listConfig: l1ListConfig,
        data: l1Data,
        editFormConfig: {
          formConfig: {
            antFormProps: {
              layout: "inline"
            },
            sections: [
              {
                id: "sec1",
                name: "电子邮件",
                groups: [
                  {
                    id: "sec1g0",
                    antRowProps: {
                      type: "flex",
                      justify: "start"
                    },
                    colNum: 2,
                    fields: [
                      { id: "f1" },
                      { id: "f2" },
                      { id: "f3" },
                      { id: "f4" }
                    ]
                  }
                ]
              }
            ]
          },
          fieldsConfig: {
            f1: {
              antFormItemProps: {
                label: "电子邮件",
                wrapperCol: {
                  width: 300
                }
              },
              antFieldDecorator: {
                options: {
                  rules: [
                    { required: true, message: "Please input your 电子邮件!" }
                  ]
                }
              },
              antFieldItem: {
                type: "Input",
                props: {}
              }
            },
            f2: {
              antFormItemProps: {
                label: "开始日期",
                wrapperCol: {
                  width: 300
                }
              },
              antFieldDecorator: {
                options: {
                  rules: [
                    { required: true, message: "Please input your 开始日期!" }
                  ]
                }
              },
              antFieldItem: {
                type: "Input",
                props: {}
              }
            },
            f3: {
              antFormItemProps: {
                label: "结束日期",
                wrapperCol: {
                  width: 300
                }
              },
              antFieldDecorator: {
                options: {
                  rules: [
                    { required: true, message: "Please input your 结束日期!" }
                  ]
                }
              },
              antFieldItem: {
                type: "Input",
                props: {}
              }
            },
            f4: {
              antFormItemProps: {
                label: "内容",
                wrapperCol: {
                  width: 300
                }
              },
              antFieldDecorator: {
                options: {
                  rules: [
                    { required: true, message: "Please input your 内容!" }
                  ]
                }
              },
              antFieldItem: {
                type: "TextArea",
                props: {
                  autosize: { minRows: 2, maxRows: 6 }
                }
              }
            }
          }
        }
      }
    }
  };
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
