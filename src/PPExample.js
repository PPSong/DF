import React from "react";
import "antd/dist/antd.css";
import { Form, Alert, Icon, Input, Button, Select, Row, Col, Spin } from "antd";
import CustomForm from "./CustomForm";
import PPList from "./PPList";
import * as PPUtil from "./PPUtil";

export default class PPExample extends React.Component {
  constructor(props) {
    super(props);
    this.formsConfig = {};

    this.listsConfig = {};

    this.forms = {};

    this.lists = {};

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    // f1 config
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

    this.formsConfig = {
      f1: {
        fieldsConfig: f1FieldsConfig,
        formConfig: f1FormConfig,
        data: f1Data
      }
    };

    this.listsConfig = {
      l1: {
        listConfig: l1ListConfig,
        data: l1Data
      }
    };

    this.setState({
      loading: false
    });
  }

  submitAll() {
    const errs = {};
    const formRecords = {};
    const listRecords = {};

    for (const key in this.forms) {
      this.forms[key].ppForm.props.form.validateFields((err, record) => {
        if (!err) {
          formRecords[key] = record;
        } else {
          errs[key] = err;
        }
      });
    }

    for (const key in this.lists) {
      // 把各个list数组复制出来, 以便后面处理fakeId
      listRecords[key] = [];
      for (const item of this.lists[key].state.data) {
        listRecords[key].push({ ...item });
      }
    }

    if (!PPUtil.isEmptyObject(errs)) {
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

      console.log(formRecords);
      console.log(listRecords);
    }
  }

  f1_saveOnClick() {
    this.forms.f1.ppForm.props.form.validateFields((err, record) => {
      if (!err) {
        // 由editForm直接调用api保存的情况
        // call api to update or create record return {
        //   success: true/false,
        //   data: record/error message
        // }

        // mock
        if (!record.id) {
          record.id = new Date().getTime();
        }
        const result = {
          success: true,
          data: record
        };

        // const result = {
        //   success: false,
        //   data: "error message"
        // };
        if (result.success) {
          this.forms.f1.setFormData(result.data);
        } else {
          this.forms.f1.setFormErrorMessage(result.data);
        }
        console.log(result.data);
      }
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <Spin />
        </div>
      );
    } else {
      return (
        <div>
          <CustomForm
            id="f1"
            parent={this}
            ref={ref => (this.forms.f1 = ref)}
          />
          <PPList
            id="l1"
            parent={this}
            ref={ref => (this.lists.l1 = ref)}
            width={960}
            title={"测试列表"}
            // saveApi={"testUrl"}
          />
          <Button onClick={() => this.submitAll()}>保存</Button>
        </div>
      );
    }
  }
}
