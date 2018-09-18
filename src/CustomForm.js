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

  setApiUpdatedRecord(apiUrl, record) {
    // mock
    if (!record.id) {
      record.id = new Date().getTime();
    }

    this.set(record);
  }

  setLocalUpdatedRecord(record) {
    if (!record.id) {
      // todo 在整张页面递交时, 需要把这些fakeid设置为0
      record.id = "fake" + new Date().getTime();
    }

    this.set(record);
  }

  setFormData(record) {
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
        obj[key] = record[key].value;
        return obj;
      }, {});

    this.ppForm.props.form.setFieldsValue(filteredFieldsValue);
  }

  set(record) {
    this.props.data = record;
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
