import React from "react";
import "antd/dist/antd.css";
import { Form, Alert, Icon, Input, Button, Select, Row, Col, Spin } from "antd";
import CustomForm from "./CustomForm";
import PPList from "./PPList";
import * as PPUtil from "./PPUtil";

export default class PPExample extends React.Component {
  state = {
    loading: true,
    f1Config: null,
    f2Config: null,
    f3Config: null
  };

  componentDidMount() {
    // f1 config
    const f1FieldsConfig = {
      id: {
        antFormItemProps: {
          label: "id"
        },
        antFieldDecorator: {
          options: {}
        },
        antFieldItem: {
          type: "Input",
          props: {}
        }
      },
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
              fields: [{ id: "id" }, { id: "mail" }]
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
      f1Config: {
        fieldsConfig: f1FieldsConfig,
        formConfig: f1FormConfig,
        data: f1FieldsValue
      },
      f2Config: {
        fieldsConfig: f1FieldsConfig,
        formConfig: f1FormConfig,
        fieldsValue: f1FieldsValue
      },
      f3Config: {
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
    this.f1.ppForm.props.form.validateFields((err, record) => {
      if (!err) {
        console.log(record);
      }
    });

    this.f2.ppForm.props.form.validateFields((err, record) => {
      if (!err) {
        console.log(record);
      }
    });

    console.log(this.state.f3Config.data)
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
            parent={this}
            ref={ref => (this.f1 = ref)}
            config={this.state.f1Config}
            data={this.state.f1Config.data}
            saveApi={"testUrl"}
          />
          <CustomForm
            parent={this}
            ref={ref => (this.f2 = ref)}
            config={this.state.f1Config}
            data={this.state.f1Config.data}
            saveApi={"testUrl"}
          />
          <PPList
            parent={this}
            config={this.state.f3Config.config}
            data={this.state.f3Config.data}
            width={960}
            title={"测试列表"}
            saveApi={"testUrl"}
          />
          <Button onClick={() => this.submitAll()}>保存</Button>
        </div>
      );
    }
  }
}
