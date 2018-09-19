import React from "react";
import "antd/dist/antd.css";
import {
  Form,
  Alert,
  DatePicker,
  Spin,
  Icon,
  Input,
  Button,
  Select,
  Row,
  Col
} from "antd";
import { deepGet } from "./PPUtil";

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker, MonthPicker } = DatePicker;

const lineBreak = {
  flexBasis: "100%",
  width: 0,
  height: 0,
  overflow: "hidden",
  display: "inline-block"
};

export default class PPForm extends React.Component {
  state: {
    windowWidth: 0,
    dynamicOptions: {}
  };

  handleResize() {
    this.setState({ windowWidth: window.innerWidth });
  }

  componentWillMount() {
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener("resize", () => this.handleResize());
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  renderForm() {
    const sections = this.props.formConfig.sections;
    return sections.map((item, index) => (
      <div key={item.id}>{this.renderSection(item, index)}</div>
    ));
  }

  renderSection(section, sectionIndex) {
    const groups = section.groups;

    return (
      <div>
        <p>{section.name}</p>
        {groups.map((item, index) => (
          <Row {...item.antRowProps} key={item.id}>
            {sectionIndex === 0 && index === 0
              ? this.renderGroup(item, true)
              : this.renderGroup(item)}
          </Row>
        ))}
      </div>
    );
  }

  renderGroup(group, addSave) {
    const { colNum } = group;
    // 计算正常项目span数目
    const colSpanNum = 24 / colNum;
    const unitWidth = this.state.windowWidth / 24;

    const fieldsArr = [];

    for (const field of group.fields) {
      if (field === "br") {
        fieldsArr.push("br");
      } else {
        fieldsArr.push({ ...this.props.fieldsConfig[field.id], id: field.id });
      }
    }

    if (addSave) {
      const saveConfig = {
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
      };
      // fieldsArr.push({ ...saveConfig, id: "SAVE" });
    }

    return fieldsArr.map((item, index) => {
      if (item === "br") {
        return <div key={index} style={lineBreak} />;
      }

      // 计算当前item的spanNum
      let spanNum = colSpanNum;
      const currentItemWrapperColWidth = deepGet(
        item.antFormItemProps,
        ["wrapperCol", "width"],
        null
      );
      if (currentItemWrapperColWidth) {
        const currentItemWith =
          Number.parseInt(this.props.labelWidth) + currentItemWrapperColWidth;
        const currentItemSpanNum = currentItemWith / unitWidth + 1;
        for (let i = 1; i <= colNum; i++) {
          if (currentItemSpanNum <= colSpanNum * i) {
            spanNum = colSpanNum * i;
            break;
          }
        }
      }

      return (
        <Col key={item.id} span={spanNum}>
          {this.renderFormItem(item, currentItemWrapperColWidth)}
        </Col>
      );
    });
  }

  renderFormItem(fieldConfig, width) {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const labelWidth = this.props.labelWidth;

    return (
      <FormItem
        {...fieldConfig.antFormItemProps}
        labelCol={{
          style: { width: Number.parseInt(labelWidth) }
        }}
        wrapperCol={{
          style: { width: width }
        }}
        style={{ marginBottom: 20 }}
        key={fieldConfig.id}
      >
        {this.renderField(fieldConfig)}
      </FormItem>
    );
  }

  renderField({ id, antFieldDecorator, antFieldItem }) {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    if (antFieldItem.type === "Button") {
      return this.renderFieldItem(id, antFieldItem);
    } else {
      return getFieldDecorator(id, antFieldDecorator.options)(
        this.renderFieldItem(id, antFieldItem)
      );
    }
  }

  renderFieldItem(id, antFieldItem) {
    let props = antFieldItem.props;
    if (this.props.mode === "display") {
      props = { ...props, disabled: true };
    }
    switch (antFieldItem.type) {
      case "Input":
        return this.renderInput(props, antFieldItem.icon);
      case "TextArea":
        return this.renderTextArea(props, antFieldItem.icon);
      case "Button":
        return this.renderButton(id, props, antFieldItem.child);
      case "Select":
        return this.renderSelect(id, props, antFieldItem.child);
      case "RangePicker":
        return this.renderRangePicker(id, props, antFieldItem.child);

      default:
        return null;
    }
  }

  renderInput(props, icon) {
    return (
      <Input
        prefix={
          icon ? (
            <Icon type={icon} style={{ color: "rgba(0,0,0,.25)" }} />
          ) : null
        }
        {...props}
      />
    );
  }

  renderRangePicker(props) {
    return <RangePicker {...props} />;
  }

  renderTextArea(props) {
    return <TextArea {...props} />;
  }

  renderButton(id, props, child) {
    return (
      <Button
        {...props}
        onClick={() => {
          const parent = this.props.parent;
          const grandpa = this.props.parent.props.parent;
          const func = grandpa[parent.props.id + "_" + id + "OnClick"];
          if (func) {
            func.bind(grandpa)();
          }
        }}
      >
        {child}
      </Button>
    );
  }

  renderSelect(id, props, child) {
    return (
      <Select
        {...props}
        onFocus={
          child === "dynamic"
            ? () => {
                const func = this.props.parent[id + "OnFocus"];
                if (func) {
                  func.bind(this.props.parent)();
                }
              }
            : () => {}
        }
      >
        {this.renderSelectChild(id, child)}
      </Select>
    );
  }

  renderSelectChild(id, child) {
    const arr = [];
    let options = child;

    if (child === "dynamic") {
      // 动态加载靠onFocus
    } else {
      // 1) 固定值, 2) api调用固定值
      if (typeof child === "string" && child.startsWith("http:")) {
        // api模式
        options = deepGet(this.state, ["dynamicOptions", "id"], []);
      }
      for (const option of options) {
        arr.push(
          <Option {...option.propes} key={option.props.value}>
            {option.child}
          </Option>
        );
      }
    }

    return arr;
  }

  setFormErrorMessage(msg) {
    this.setState({
      errorMessage: msg
    });
  }

  renderBottom() {
    // const saveConfig = {
    //   id: "SAVE",
    //   antFormItemProps: {
    //     label: ""
    //   },
    //   antFieldDecorator: {
    //     options: {}
    //   },
    //   antFieldItem: {
    //     type: "Button",
    //     props: {
    //       type: "primary"
    //     },
    //     child: "保存"
    //   }
    // };
    // return (
    //   <div style={{ display: "flex", justifyContent: "flex-end" }}>
    //     {this.renderFormItem(saveConfig)}
    //   </div>
    // );
  }

  renderId() {
    const { getFieldDecorator } = this.props.form;
    return getFieldDecorator("id")(<Input style={{ display: "none" }} />);
  }

  renderHeader() {
    return (
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <p>abc</p>
      </div>
    )
  }

  render() {
    if (this.props.fieldsConfig) {
      // 只有配置文件已经准备好了再渲染
      return (
        <Form {...this.props.formConfig.antFormProps}>
          {this.renderId()}
          {this.renderHeader()}
          {this.renderForm()}
          {this.renderBottom()}
          <Alert
            message={this.state.errorMessage}
            type="error"
            style={this.state.errorMessage ? {} : { display: "none" }}
          />
        </Form>
      );
    } else {
      return <Spin />;
    }
  }
}
