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
    let f1FieldsConfig = [
      "mail. Input. 电子邮件& width_300. rule_*",
      "f1. Input. f1& rule_*",
      "f2. Input. f2& rule_*",
      "f3. Input. f3& rule_*",
      "f4. Input. f4& rule_*",
      "f5. Input. f5& rule_*",
      "save. Button. 保存& buttonType_primary",
      "rp. RangePicker. 日期"
    ];
    f1FieldsConfig = PPUtil.parseFieldsConfig(f1FieldsConfig);

    let f1FormConfig = [
      // section
      {
        id: "sec1",
        name: "电子邮件",
        // group
        groups: ["sec1g0. start. 2& mail. f1. |. f2. rp", "sec1g1. end. 12& save"]
      }
    ];
    f1FormConfig = PPUtil.parseFormConfig(f1FormConfig);

    const f1Data = {
      id: 1,
      mail: "1@1.com"
    };

    let l1ListConfig = [
      "f1. 子类型. 2",
      "f2. 开始日期. 2",
      "f3. 结束日期. 2",
      "f4. 内容. 16",
      "f5. 操作. 2"
    ];

    l1ListConfig = PPUtil.parseListConfig(l1ListConfig);

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

    let l1EditFormFieldsConfig = [
      "f1. Input. 电子邮件& width_300. rule_*",
      "f2. Input. 开始日期& width_300. rule_*",
      "f3. Input. 结束日期& width_300. rule_*",
      'f4. TextArea. 内容& width_300. autosize_{ "minRows": 5, "maxRows": 6 }. rule_*'
    ];
    l1EditFormFieldsConfig = PPUtil.parseFieldsConfig(l1EditFormFieldsConfig);

    let l1EditFormConfig = [
      // section
      {
        id: "sec1",
        name: "电子邮件",
        // group
        groups: ["sec1g0. start. 2& f1. f2. f3. f4"]
      }
    ];
    l1EditFormConfig = PPUtil.parseFormConfig(l1EditFormConfig);

    this.formsConfig = {
      f1: {
        fieldsConfig: f1FieldsConfig,
        formConfig: f1FormConfig,
        data: f1Data
      },
      f2: {
        fieldsConfig: f1FieldsConfig,
        formConfig: f1FormConfig,
        data: f1Data
      }
    };

    this.listsConfig = {
      l1: {
        listConfig: l1ListConfig,
        data: l1Data,
        editFormConfig: {
          formConfig: l1EditFormConfig,
          fieldsConfig: l1EditFormFieldsConfig
        }
      }
    };

    this.setState({
      loading: false
    });
  }

  f1_onValuesChange(customForm, changedValues, allValues) {
    if (Object.keys(changedValues).includes("f1")) {
      customForm.ppForm.props.form.setFieldsValue({ f2: changedValues.f1 + " append f1" });
    }
  }

  f2_onValuesChange(customForm, changedValues, allValues) {
    if (Object.keys(changedValues).includes("f1")) {
      customForm.ppForm.props.form.setFieldsValue({ f2: changedValues.f1 + " append f2" });
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

  submitAll() {
    console.log(PPUtil.submitAll(this));
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
            saveApi={"testUrl"}
          />
          <CustomForm
            id="f2"
            parent={this}
            ref={ref => (this.forms.f2 = ref)}
          />
          <Button onClick={() => this.submitAll()}>保存</Button>
        </div>
      );
    }
  }
}
