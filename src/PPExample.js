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
    const mock = PPUtil.getPageConfigAndData();

    this.formsConfig = mock.formsConfig;

    this.listsConfig = mock.listsConfig;

    this.setState({
      loading: false
    });
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
          <Button onClick={() => PPUtil.submitAll(this)}>保存</Button>
        </div>
      );
    }
  }
}
