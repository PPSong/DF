import React from "react";
import PPForm from "./PPForm";
import { Form, Icon, Input, Button, Select, Spin } from "antd";
import * as PPUtil from "./PPUtil";

export default class CustomForm extends React.Component {
  state = { mode: "edit" };

  saveOnClick() {
    this.ppForm.props.form.validateFields((err, record) => {
      if (!err) {
        // 由editForm直接调用api保存的情况
        // call api to update or create record return {
        //   success: true/false,
        //   data: record/error message
        // }
        const result = this.props.saveRecord(record);
        if (result.success) {
          this.setFormData(record);
        } else {
          this.setFormErrorMessage(result.data);
        }
      }
    });
  }

  // new, edit, display
  setMode(mode) {
    this.setState({
      mode: mode
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

  setFormData(record) {
    if (!record || Object.keys(record).length === 0) {
      // 没有数据的情况
      return;
    }
    const formConfigFieldsId = this.props.config.formConfig.sections
      .reduce(
        (pre, item) =>
          pre.concat(
            item.groups.reduce((pre, item) => pre.concat(item.fields), [])
          ),
        []
      )
      .map(item => item.id);
    // 设置当前值
    const filteredFieldsValue = Object.keys(record)
      .filter(key => formConfigFieldsId.includes(key))
      .reduce((obj, key) => {
        obj[key] = record[key];
        return obj;
      }, {});

    this.ppForm.props.form.setFieldsValue(filteredFieldsValue);
  }

  componentDidMount() {
    // 等待form加载完毕
    setTimeout(() => {
      this.setFormData(this.props.data);
    }, 100);
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
