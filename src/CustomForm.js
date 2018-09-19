import React from "react";
import PPForm from "./PPForm";
import { Form, Icon, Input, Button, Select, Spin } from "antd";
import * as PPUtil from "./PPUtil";

export default class CustomForm extends React.Component {
  constructor(props) {
    super(props);

    this.formConfig =
      this.props.formConfig ||
      this.props.parent.formsConfig[this.props.id].formConfig;
    this.fieldsConfig =
      this.props.fieldsConfig ||
      this.props.parent.formsConfig[this.props.id].fieldsConfig;
    this.data = this.props.data;
    // 这里不能用if (!this.data), 因为this.props.data可能是null
    if (!("data" in this.props)) {
      this.data = this.props.parent.formsConfig[this.props.id].data;
    }

    this.state = {
      model: "edit"
    };
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
    if (PPUtil.isEmptyObject(record)) {
      // 没有数据的情况
      return;
    }
    const formConfigFieldsId = this.formConfig.sections
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
      .filter(key => formConfigFieldsId.includes(key) || key === "id")
      .reduce((obj, key) => {
        obj[key] = record[key];
        return obj;
      }, {});

    this.ppForm.props.form.setFieldsValue(filteredFieldsValue);
  }

  componentDidMount() {
    // 等待form加载完毕
    setTimeout(() => {
      this.setFormData(this.data);
    }, 100);
  }

  render() {
    return (
      <div>
        <this.EnhancedPPForm
          parent={this}
          mode={this.state.mode}
          formConfig={this.formConfig}
          fieldsConfig={this.fieldsConfig}
          data={this.data}
          labelWidth="100"
          wrappedComponentRef={ppForm => (this.ppForm = ppForm)}
        />
      </div>
    );
  }

  EnhancedPPForm = Form.create({
    onValuesChange: (props, changedValues, allValues) => {
      const func = this.props.parent[this.props.id + "_onValuesChange"];
      if (func) {
        func(this, changedValues, allValues);
      }
      if (this.props.onValuesChange) {
        // () =>
        //   this.props.onValuesChange(
        //     this.ppForm.props.form,
        //     changedValues,
        //     allValues
        //   );

      }
      // const func = this.props.parent["onValuesChange"];
      // if (func) {
      //   func(this, changedValues, allValues);
      // }
    }
  })(PPForm);
}
