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
    this.setFormData(record);
  }

  setFormData(record) {
    if (!record || Object.keys(record).length === 0 ) {
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

  saveOnClick() {
    this.ppForm.props.form.validateFields((err, record) => {
      if (!err) {
        // 处理接受到的result(record信息), 直接调用save api或者先放入父级本地数据容器, 失败不要hideModel, 否则hideModel(如果是new的情况, 把从服务器得到的id填入record)
        if (this.props.saveApi) {
          // 由editForm直接调用api保存的情况
          this.setApiUpdatedRecord(this.props.saveApi, record);
        } else {
          // 如果需要吧form数据传给父级, 不应该在这里设置save按钮
        }
      }
    });
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
