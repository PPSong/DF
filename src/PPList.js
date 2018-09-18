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
    modalTitle: null,
    data: this.props.data,
    curData: null
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

  setApiUpdatedRecord(apiUrl, record) {
    console.log("setApiUpdatedRecord");
    // mock
    if (!record.id) {
      record.id = new Date().getTime();
    }

    this.addOrSet(record);
    this.hideModal();
  }

  setLocalUpdatedRecord(record) {
    console.log("setLocalUpdatedRecord");
    if (!record.id) {
      // todo 在整张页面递交时, 需要把这些fakeid设置为0
      record.id = "fake" + new Date().getTime();
    }

    this.addOrSet(record);
    this.hideModal();
  }

  handleOk = () => {
    this.f1.ppForm.props.form.validateFields((err, record) => {
      if (!err) {
        // 处理接受到的result(record信息), 直接调用save api或者先放入父级本地数据容器, 失败不要hideModel, 否则hideModel(如果是new的情况, 把从服务器得到的id填入record)
        if (this.props.saveApi) {
          // 由editForm直接调用api保存的情况
          this.setApiUpdatedRecord(this.props.saveApi, record);
        } else {
          this.setLocalUpdatedRecord(record);
        }
      }
    });
  };

  addOrSet(record) {
    // todo: 奇怪, 为什么这里没用setState, 页面的list数据也会更新显示
    const data = this.props.parent.state[this.props.id].data;
    if (this.f1.state.mode === "edit") {
      const index = data.findIndex(item => item.id == record.id);
      data[index] = record;
    } else if (this.f1.state.mode === "new") {
      data.push({ ...record });
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
      this.setState({
        curData: record
      });
    }, 100);
  }

  newRecord() {
    this.showModal();
    // 等待modal中form加载完毕
    setTimeout(() => {
      this.f1.setMode("new");
      this.setState({
        curData: null
      });
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
            // list中的editform save交给Modal的onOk去处理不能在这里用saveRecord
          >
            <CustomForm
              id="f1"
              parent={this}
              ref={ref => (this.f1 = ref)}
              config={config}
              data={this.state.curData}
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
