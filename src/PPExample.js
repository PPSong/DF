import React from "react";
import "antd/dist/antd.css";
import { Form, Alert, Icon, Input, Button, Select, Row, Col, Spin } from "antd";
import CustomForm from "./CustomForm";
import PPList from "./PPList";
import * as PPUtil from "./PPUtil";

export default class PPExample extends React.Component {
  state = {
    loading: true,
    f1: null,
    f2: null,
    l3: null
  };

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

    const f1FieldsValue = {
      id: 1,
      mail: "1@1.com"
    };
    // f2 config

    // f3 config
    const f3ListConfig = {
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

    const f3Data = [
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

    this.setState({
      f1: {
        fieldsConfig: f1FieldsConfig,
        formConfig: f1FormConfig,
        data: f1FieldsValue
      },
      f2: {
        fieldsConfig: f1FieldsConfig,
        formConfig: f1FormConfig,
        data: f1FieldsValue
      },
      l1: {
        config: f3ListConfig,
        data: f3Data
      }
    });

    // todo: 这个地方不严谨, 由于setState是异步操作, 可能上面的获取动作还没完成, 暂时用timeout来规避
    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 100);
  }

  setData(data) {
    data.id = new Date().getTime();
    this.setState({
      f1Config: {
        ...this.state.f1Config,
        data: data
      }
    });

    console.log(this.state.f1Config.data);
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
      listRecords[key] = this.lists[key].state.data;
    }

    if (!PPUtil.isEmptyObject(errs)) {
      console.log(errs);
    } else {
      // 处理listRecords中的fakeId
      const processedListRecords = this.processFakeId(listRecords);

      console.log(formRecords);
      console.log(processedListRecords);
    }
  }

  processFakeId(listRecords) {
    const processedListRecords = {};
    for (const list in listRecords) {
      processedListRecords[list] = [];
      for (const item of listRecords[list]) {
        if (item.id.startsWith("fake")) {
          // todo: 确定新增记录的id是数字0还是字符'0'
          processedListRecords[list].push({ ...item, id: 0 });
        } else {
          processedListRecords[list].push(item);
        }
      }
    }
    return processedListRecords;
  }

  forms = {};

  lists = {};

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
            config={this.state.f1}
            data={this.state.f1.data}
            saveRecord={record => this.saveRecordF1(record)}
          />
          <CustomForm
            id="f2"
            parent={this}
            ref={ref => (this.forms.f2 = ref)}
            config={this.state.f2}
            data={this.state.f2.data}
            saveRecord={record => this.saveRecordF2(record)}
          />
          <PPList
            id="l1"
            parent={this}
            ref={ref => (this.lists.l1 = ref)}
            config={this.state.l1.config}
            data={this.state.l1.data}
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
