import React from "react";
import PPForm from "./PPForm";
import { Form, Icon, Input, Button, Select, Spin } from "antd";
import * as PPUtil from "./PPUtil";

export default class CustomForm extends React.Component {
  state = { mode: "edit" };

  // new, edit, display
  setMode(mode) {
    this.setState({
      mode: mode
    });
  }

  submit() {
    this.ppForm.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.setFormData) {
          // 如果上级容器设置了setFormData就把values传递给上级处理
          this.props.setFormData(values);
        } else {
          // 自己处理递交事件
          if (this.state.mode === "edit") {
            // edit的情况
          } else if (this.state.mode === "new") {
            // new的情况
          }
        }
        return true;
      } else {
        return false;
      }
    });
  }

  setFormErrorMessage(msg) {
    this.ppForm.setFormErrorMessage(msg);
  }

  setOptions(id, options) {
    this.ppForm.setState({
      dynamicOptions: {
        id: options
      }
    });
  }

  render() {
    return (
      <div>
        <this.EnhancedPPForm
          parent={this}
          mode={this.state.mode}
          formConfig={this.props.config.formConfig}
          fieldsConfig={this.props.config.fieldsConfig}
          fieldsValue={this.props.config.fieldsValue}
          labelWidth="100"
          wrappedComponentRef={ppForm => (this.ppForm = ppForm)}
        />
      </div>
    );
  }

  EnhancedPPForm = Form.create({
    onValuesChange: (props, changedValues, allValues) => {
      if (this.props.onValuesChange) {
        () =>
          this.props.onValuesChange(
            this.ppForm.props.form,
            changedValues,
            allValues
          );
      }
    }
  })(PPForm);
}
