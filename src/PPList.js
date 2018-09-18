import React from "react";
import "antd/dist/antd.css";
import {
  Form,
  Alert,
  Spin,
  Icon,
  Input,
  Button,
  Select,
  Row,
  Col,
  Modal
} from "antd";
import CustomForm from "./CustomForm";

const config = {
  fieldsConfig: {
    f1: {
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
    f2: {
      antFormItemProps: {
        label: "开始日期",
        wrapperCol: {
          width: 300
        }
      },
      antFieldDecorator: {
        options: {
          rules: [{ required: true, message: "Please input your 开始日期!" }]
        }
      },
      antFieldItem: {
        type: "Input",
        props: {}
      }
    },
    f3: {
      antFormItemProps: {
        label: "结束日期",
        wrapperCol: {
          width: 300
        }
      },
      antFieldDecorator: {
        options: {
          rules: [{ required: true, message: "Please input your 结束日期!" }]
        }
      },
      antFieldItem: {
        type: "Input",
        props: {}
      }
    },
    f4: {
      antFormItemProps: {
        label: "内容",
        wrapperCol: {
          width: 300
        }
      },
      antFieldDecorator: {
        options: {
          rules: [{ required: true, message: "Please input your 内容!" }]
        }
      },
      antFieldItem: {
        type: "TextArea",
        props: {
          autosize: { minRows: 2, maxRows: 6 }
        }
      }
    }
  },
  formConfig: {
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
            fields: [{ id: "f1" }, { id: "f2" }, { id: "f3" }, { id: "f4" }]
          }
        ]
      }
    ]
  }
};

export default class PPList extends React.Component {
  state = {
    showModal: false,
    modalTitle: null
  };

  renderHeaderField(field) {
    let key = field.id;
    if (key === 0) {
      key = new Date().getTime();
    }
    return (
      <Col key={key} {...field.props}>
        {field.label}
      </Col>
    );
  }

  renderRecordField(fieldConfig, record) {
    return (
      <Col key={fieldConfig.id} {...fieldConfig.props}>
        {record[fieldConfig.id]}
      </Col>
    );
  }

  renderOneRecord(record, index) {
    const oneRecord = this.props.config.fields.map(item =>
      this.renderRecordField(item, record)
    );
    // 添加编辑link, 宽度固定为span=1
    oneRecord.push(
      <Col key={"edit"} span={1}>
        <a
          onClick={() => {
            this.editRecord(record);
          }}
        >
          编辑
        </a>
      </Col>
    );
    return <Row key={index}>{oneRecord}</Row>;
  }

  renderHeader() {
    return (
      <Row>
        {this.props.config.fields.map(item => this.renderHeaderField(item))}
      </Row>
    );
  }

  renderBody() {
    return this.props.data.map((item, index) =>
      this.renderOneRecord(item, index)
    );
  }

  handleOk = () => {
    // 成功的话是save之后的record, 失败的话是false
    const result = this.f1.submit();
    if (result) {
      this.addOrSet(result);
      this.hideModal();
    }
  };

  addOrSet(record) {
    if (this.state.mode === "edit") {
      const index = this.props.parent.data.findIndex(
        item => item.id == record.id
      );
      this.props.parent.data[index] = record;
    } else if (this.state.mode === "new") {
      this.props.parent.data.push({ ...record, id: 0 });
    }
  }

  handleCancel = () => {
    this.setState({
      showModal: false
    });
  };

  showModal = () => {
    this.setState({
      showModal: true
    });
  };

  hideModal = () => {
    this.setState({
      showModal: false
    });
  };

  editRecord(record) {
    this.showModal();
    // 等待modal中form加载完毕
    setTimeout(() => {
      this.f1.setMode("edit");
      this.setFormData(record);
    }, 100);
  }

  newRecord() {
    this.showModal();
    // 等待modal中form加载完毕
    setTimeout(() => {
      this.f1.setMode("new");
    }, 100);
  }

  setFormData(record) {
    const formConfigFieldsId = config.formConfig.sections
      .reduce(
        (pre, item) =>
          pre.concat(
            item.groups.reduce((pre, item) => pre.concat(item.fields), [])
          ),
        []
      )
      .map(item => item.id);

    const filteredFieldsValue = Object.keys(record)
      .filter(key => formConfigFieldsId.includes(key) || key == "id")
      .reduce((obj, key) => {
        obj[key] = record[key];
        return obj;
      }, {});

    this.f1.ppForm.props.form.setFieldsValue(filteredFieldsValue);
  }

  renderTop() {
    return (
      <div style={{ display: "flex", direction: "column" }}>
        <p>{this.props.title}</p>
        <a onClick={() => this.newRecord()}>
          <Icon
            type="plus"
            theme="outlined"
            style={{ position: "absolute", right: 20 }}
          />
        </a>
      </div>
    );
  }

  render() {
    if (this.props.config) {
      return (
        <div>
          <Modal
            width={this.props.width ? this.props.width : 520}
            title={this.state.modalTitle}
            visible={this.state.showModal}
            destroyOnClose={true}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <CustomForm
              parent={this}
              ref={ref => (this.f1 = ref)}
              config={config}
            />
          </Modal>
          {this.renderTop()}
          {this.renderHeader()}
          {this.renderBody()}
        </div>
      );
    } else {
      return <Spin />;
    }
  }
}
